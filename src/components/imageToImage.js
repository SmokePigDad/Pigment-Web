// Image-to-image transformation component functionality

import { getElementById } from '../utils/helpers.js';
import { transformImage } from '../services/kontextService.js';
import { getUploadedImageUrl, hasUploadedImage } from './imageUpload.js';
import { downloadBlob } from '../utils/downloadUtils.js';

// Transformation state
let isTransforming = false;
let currentAbortController = null;

/**
 * Initializes the image-to-image transformation component
 */
export function initializeImageToImage() {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    setupTransformationHandlers();
    setupExamplePrompts();
  }, 250);
}

/**
 * Sets up transformation event handlers
 */
function setupTransformationHandlers() {
  const transformBtn = getElementById('transform-btn');
  const downloadResultBtn = getElementById('download-result-btn');
  
  if (transformBtn) {
    transformBtn.addEventListener('click', handleTransformButtonClick);
  }
  
  if (downloadResultBtn) {
    downloadResultBtn.addEventListener('click', handleDownloadResult);
  }
}

/**
 * Handles transform/cancel button click
 */
function handleTransformButtonClick() {
  if (isTransforming) {
    handleCancelTransformation();
  } else {
    handleStartTransformation();
  }
}

/**
 * Handles starting the transformation process
 */
async function handleStartTransformation() {
  // Validate inputs
  if (!hasUploadedImage()) {
    showTransformationError('Please upload an image first');
    return;
  }
  
  const prompt = getTransformationPrompt();
  if (!prompt.trim()) {
    showTransformationError('Please enter a transformation prompt');
    return;
  }
  
  // Start transformation
  setTransformationState(true);
  currentAbortController = new AbortController();
  
  try {
    const imageUrl = getUploadedImageUrl();
    console.log('Starting transformation with image URL:', imageUrl ? 'Data URL loaded' : 'No image');

    updateTransformationStatus('Preparing image for transformation...');

    console.log('Calling transformImage with prompt:', prompt.trim());
    const transformedBlob = await transformImage({
      prompt: prompt.trim(),
      imageUrl: imageUrl,
      signal: currentAbortController.signal
    });

    console.log('Transformation completed, blob received:', transformedBlob);
    updateTransformationStatus('Transformation complete!');
    displayTransformationResult(transformedBlob);

  } catch (error) {
    console.error('Transformation error:', error);
    if (error.message.includes('cancelled')) {
      updateTransformationStatus('Transformation cancelled');
    } else {
      showTransformationError(`Transformation failed: ${error.message}`);
    }
  } finally {
    setTransformationState(false);
    currentAbortController = null;
  }
}

/**
 * Handles canceling the transformation
 */
function handleCancelTransformation() {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  setTransformationState(false);
  updateTransformationStatus('Transformation cancelled');
}

/**
 * Sets the transformation state and updates UI
 * @param {boolean} transforming - Whether transformation is in progress
 */
function setTransformationState(transforming) {
  isTransforming = transforming;
  
  const transformBtn = getElementById('transform-btn');
  const progressContainer = getElementById('transform-progress-container');
  
  if (transformBtn) {
    if (transforming) {
      transformBtn.innerHTML = '<i class="fas fa-stop"></i> Cancel';
      transformBtn.classList.add('btn-cancel');
    } else {
      transformBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Transform Image';
      transformBtn.classList.remove('btn-cancel');
    }
  }
  
  if (progressContainer) {
    progressContainer.style.display = transforming ? 'block' : 'none';
  }
  
  clearTransformationError();
}

/**
 * Gets the transformation prompt from the input
 * @returns {string} Transformation prompt
 */
function getTransformationPrompt() {
  const promptInput = getElementById('transformation-prompt');
  return promptInput ? promptInput.value : '';
}

/**
 * Updates the transformation status message
 * @param {string} message - Status message
 */
function updateTransformationStatus(message) {
  const statusElement = getElementById('transform-status-message');
  if (statusElement) {
    statusElement.textContent = message;
  }
}

/**
 * Shows transformation error message
 * @param {string} message - Error message
 */
function showTransformationError(message) {
  const errorContainer = getElementById('transform-error-message');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }
  updateTransformationStatus('');
}

/**
 * Clears transformation error message
 */
function clearTransformationError() {
  const errorContainer = getElementById('transform-error-message');
  if (errorContainer) {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
  }
}

/**
 * Displays the transformation result
 * @param {Blob} imageBlob - Transformed image blob
 */
function displayTransformationResult(imageBlob) {
  const resultContainer = getElementById('transformation-result');
  const downloadBtn = getElementById('download-result-btn');
  
  if (resultContainer) {
    const imageUrl = URL.createObjectURL(imageBlob);
    
    resultContainer.innerHTML = `
      <div class="result-comparison">
        <div class="result-section">
          <h4>Original</h4>
          <img src="${getUploadedImageUrl()}" alt="Original image" class="result-image">
        </div>
        <div class="result-section">
          <h4>Transformed</h4>
          <img src="${imageUrl}" alt="Transformed image" class="result-image">
        </div>
      </div>
    `;
    
    resultContainer.style.display = 'block';
    
    // Store the blob for download
    resultContainer.dataset.imageBlob = imageUrl;
  }
  
  if (downloadBtn) {
    downloadBtn.style.display = 'block';
    downloadBtn.disabled = false;
  }
}

/**
 * Handles downloading the transformation result
 */
function handleDownloadResult() {
  const resultContainer = getElementById('transformation-result');
  if (!resultContainer || !resultContainer.dataset.imageBlob) return;
  
  const imageUrl = resultContainer.dataset.imageBlob;
  
  // Convert blob URL back to blob for download
  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const filename = `transformed-image-${Date.now()}.png`;
      downloadBlob(blob, filename);
    })
    .catch(error => {
      console.error('Failed to download transformed image:', error);
      showTransformationError('Failed to download image');
    });
}

/**
 * Clears the transformation result
 */
export function clearTransformationResult() {
  const resultContainer = getElementById('transformation-result');
  const downloadBtn = getElementById('download-result-btn');
  
  if (resultContainer) {
    // Revoke any blob URLs to free memory
    const existingBlobUrl = resultContainer.dataset.imageBlob;
    if (existingBlobUrl && existingBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(existingBlobUrl);
    }
    
    resultContainer.innerHTML = '';
    resultContainer.style.display = 'none';
    delete resultContainer.dataset.imageBlob;
  }
  
  if (downloadBtn) {
    downloadBtn.style.display = 'none';
    downloadBtn.disabled = true;
  }
  
  clearTransformationError();
  updateTransformationStatus('');
}

/**
 * Sets up example prompt click handlers
 */
function setupExamplePrompts() {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    const examplePrompts = document.querySelectorAll('.example-prompt');
    examplePrompts.forEach(prompt => {
      prompt.addEventListener('click', () => {
        const promptText = prompt.dataset.prompt;
        const promptInput = getElementById('transformation-prompt');
        if (promptInput && promptText) {
          promptInput.value = promptText;
          promptInput.focus();
        }
      });
    });
  }, 100);
}
