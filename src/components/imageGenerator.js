// Image generation component functionality

import { buildPrompt, getArtStyleNames } from '../utils/promptBuilder.js';
import { buildImageUrl, fetchImageWithRetry, generateRandomSeed } from '../services/pollinationsService.js';
import { setGenerationState, abortGeneration, addRevokeURL, AppState } from '../utils/stateManager.js';
import { createImageCard, showGalleryStatus } from './gallery.js';
import { isBatchModeEnabled } from './batchToggle.js';
import { getElementById, sleep, pluralize } from '../utils/helpers.js';
import { API_CONFIG } from '../config/constants.js';

/**
 * Initializes the image generator
 */
export function initializeImageGenerator() {
  const generateBtn = getElementById('generate-btn');

  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerateButtonClick);
  }
}

/**
 * Handles the generate/cancel button click
 */
function handleGenerateButtonClick() {
  if (AppState.isGenerating) {
    // Cancel generation
    handleCancelGeneration();
  } else {
    // Start generation
    handleGenerateImages();
  }
}

/**
 * Handles canceling the current generation
 */
function handleCancelGeneration() {
  abortGeneration();
  updateGenerateButton(false);
  updateStatusMessage("Generation was cancelled.");
}

/**
 * Updates the generate button UI based on generation state
 * @param {boolean} isGenerating - Whether generation is in progress
 */
function updateGenerateButton(isGenerating) {
  const generateBtn = getElementById('generate-btn');
  if (!generateBtn) return;

  if (isGenerating) {
    generateBtn.innerHTML = '<i class="fas fa-stop"></i> Cancel Generation';
    generateBtn.classList.add('btn-cancel');
    generateBtn.classList.remove('btn-generate');
    generateBtn.setAttribute('aria-label', 'Cancel image generation');
    generateBtn.setAttribute('title', 'Stop the current image generation process');
  } else {
    generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Images';
    generateBtn.classList.remove('btn-cancel');
    generateBtn.classList.add('btn-generate');
    generateBtn.setAttribute('aria-label', 'Generate Images');
    generateBtn.setAttribute('title', 'Start generating AI images with current settings');
  }
}

/**
 * Handles the generate images button click
 */
async function handleGenerateImages() {
  if (AppState.isGenerating) {
    return;
  }

  const generationParams = getGenerationParameters();
  if (!generationParams) {
    showGalleryStatus("Please fill in all required fields", true);
    return;
  }

  const abortController = new AbortController();
  setGenerationState(true, abortController);
  updateGenerateButton(true);

  const queue = buildGenerationQueue(generationParams);
  
  updateProgressUI(0, queue.length, "Starting generation...");

  let imagesGenerated = 0;
  
  try {
    for (let i = 0; i < queue.length; i++) {
      if (AppState.abortGeneration || abortController.signal.aborted) {
        updateStatusMessage("Generation was cancelled.");
        break;
      }

      const task = queue[i];
      const styleForDisplay = task.style || generationParams.selectedStyle || "Default";
      
      updateProgressUI(i, queue.length, `Generating image ${i + 1} of ${queue.length} (${task.model})...`);

      try {
        const success = await generateAndDisplayImage(task, styleForDisplay, abortController.signal);
        if (success) {
          imagesGenerated++;
        }
      } catch (error) {
        console.error('Generation error:', error);
        updateStatusMessage("A generation error occurred. Please check your network, prompt, and model settings.");
      }

      updateProgressBar((i + 1) / queue.length * 100);

      // Rate limiting delay between requests
      if (i < queue.length - 1) {
        updateProgressText("Waiting before next image (rate limited)…");
        await sleep(API_CONFIG.RATE_LIMIT_DELAY);
      }
    }
  } catch (error) {
    console.error('Critical generation error:', error);
    updateStatusMessage("A critical error stopped the process. Check the console.");
  } finally {
    updateProgressBar(100);
    updateProgressText(`Done. Generated ${pluralize(imagesGenerated, "image")}.`);
    setGenerationState(false);
    updateGenerateButton(false);
  }
}

/**
 * Gets generation parameters from the UI
 * @returns {Object|null} Generation parameters or null if invalid
 */
function getGenerationParameters() {
  const promptElement = getElementById('prompt');
  const countElement = getElementById('count');
  const sizeElement = getElementById('size');
  const modelElement = getElementById('model');
  const styleElement = getElementById('style');
  const nologoElement = getElementById('nologo');
  const privateElement = getElementById('private');
  const enhanceElement = getElementById('enhance');
  const transparentElement = getElementById('transparent');

  if (!promptElement || !promptElement.value.trim()) {
    return null;
  }

  const basePrompt = promptElement.value.trim();
  const count = Number(countElement?.value || 4);
  const size = (sizeElement?.value || "1024,1024").split(',');
  const width = Number(size[0]);
  const height = Number(size[1]);
  const selectedModel = modelElement?.value || 'flux';
  const selectedStyle = styleElement?.value || '';
  const nologo = nologoElement?.checked || false;
  const priv = privateElement?.checked || false;
  const enhance = enhanceElement?.checked || false;
  const transparent = transparentElement?.checked || false;

  return {
    basePrompt,
    count,
    width,
    height,
    selectedModel,
    selectedStyle,
    nologo,
    priv,
    enhance,
    transparent
  };
}

/**
 * Builds the generation queue based on parameters
 * @param {Object} params - Generation parameters
 * @returns {Array} Array of generation tasks
 */
function buildGenerationQueue(params) {
  const {
    basePrompt,
    count,
    width,
    height,
    selectedModel,
    selectedStyle,
    nologo,
    priv,
    enhance,
    transparent
  } = params;

  const queue = [];

  if (isBatchModeEnabled()) {
    // Batch mode: generate one image for each art style
    const allStyles = getArtStyleNames();
    const batchSeed = generateRandomSeed();
    
    for (const style of allStyles) {
      queue.push({
        prompt: buildPrompt(basePrompt, style),
        model: selectedModel,
        style,
        width,
        height,
        seed: batchSeed,
        nologo,
        priv,
        enhance,
        transparent
      });
    }
  } else {
    // Normal mode: generate specified number of images
    for (let i = 0; i < count; i++) {
      const seed = generateRandomSeed();
      queue.push({
        prompt: buildPrompt(basePrompt, selectedStyle),
        model: selectedModel,
        style: selectedStyle,
        width,
        height,
        seed,
        nologo,
        priv,
        enhance,
        transparent,
        _displaySeed: seed
      });
    }
  }

  return queue;
}

/**
 * Generates and displays a single image
 * @param {Object} task - Generation task
 * @param {string} styleForDisplay - Style name for display
 * @param {AbortSignal} signal - Abort signal
 * @param {number} retryAttempt - Current retry attempt
 * @returns {Promise<boolean>} Success status
 */
async function generateAndDisplayImage(task, styleForDisplay, signal, retryAttempt = 1) {
  const url = buildImageUrl(task);
  const { card, imgElement, placeholder } = createImageCard({
    prompt: task.prompt,
    style: task.style,
    seed: task.seed
  });

  const gallery = getElementById('gallery');
  if (gallery) {
    gallery.appendChild(card);
  }

  try {
    // Show loading placeholder
    placeholder.innerHTML = `<div class="placeholder-content"><i class="fas fa-magic"></i><span>Generating...${retryAttempt > 1 ? " (retry " + retryAttempt + ")" : ""}</span><div class="placeholder-style-name">${styleForDisplay}</div></div>`;
    
    // Fetch image
    const blob = await fetchImageWithRetry(url, 3, signal);
    const src = URL.createObjectURL(blob);

    if (signal.aborted) {
      URL.revokeObjectURL(src);
      return false;
    }

    // Display image
    imgElement.src = src;
    addRevokeURL(src);
    card.classList.add('image-loaded');
    
    return true;
  } catch (error) {
    console.error('Image generation failed:', error);
    
    // Show error in placeholder
    placeholder.innerHTML = `<div class="placeholder-content" style="color:#f44336"><i class="fas fa-exclamation-triangle"></i><span>Error</span><pre style="font-size:0.95em;color:#eb9797;overflow-x:auto;max-width:350px;">${error.message || error}</pre><div style="margin-top:10px"><button class="btn action-btn" style="background:#444;border:1px solid #f44336;color:#fff" id="retry-btn">Retry</button></div></div>`;
    
    // Add retry functionality
    const retryBtn = placeholder.querySelector("#retry-btn");
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        generateAndDisplayImage(task, styleForDisplay, signal, retryAttempt + 1);
      });
    }
    
    return false;
  }
}

/**
 * Updates progress UI elements
 * @param {number} current - Current progress
 * @param {number} total - Total items
 * @param {string} text - Progress text
 */
function updateProgressUI(current, total, text) {
  updateProgressBar(current / total * 100);
  updateProgressText(text);
}

/**
 * Updates the progress bar
 * @param {number} percentage - Progress percentage (0-100)
 */
function updateProgressBar(percentage) {
  const progressBar = getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
}

/**
 * Updates the progress text
 * @param {string} text - Progress text
 */
function updateProgressText(text) {
  const progressText = getElementById('progress-text');
  if (progressText) {
    progressText.textContent = text;
  }
}

/**
 * Updates the status message
 * @param {string} message - Status message
 */
function updateStatusMessage(message) {
  const statusMessage = getElementById('status-message');
  if (statusMessage) {
    statusMessage.textContent = message;
  }
}
