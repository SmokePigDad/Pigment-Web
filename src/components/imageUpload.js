// Image upload component functionality

import { getElementById } from '../utils/helpers.js';
import { validateImageFile, compressImage } from '../services/imageHostingService.js';

// Upload state
let uploadedImageUrl = null;
let uploadedImageFile = null;

// Configuration
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Initializes the image upload component
 */
export function initializeImageUpload() {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    setupImageUploadHandlers();
  }, 200);
}

/**
 * Sets up image upload event handlers
 */
function setupImageUploadHandlers() {
  const fileInput = getElementById('image-upload-input');
  const dropZone = getElementById('image-upload-zone');
  const clearBtn = getElementById('clear-uploaded-image');

  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
  }

  if (dropZone) {
    setupDropZone(dropZone, fileInput);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearUploadedImage);
  }
}

/**
 * Sets up drag and drop functionality
 * @param {HTMLElement} dropZone - Drop zone element
 * @param {HTMLInputElement} fileInput - File input element
 */
function setupDropZone(dropZone, fileInput) {
  dropZone.addEventListener('click', () => {
    fileInput?.click();
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });
}

/**
 * Handles file selection from input
 * @param {Event} event - File input change event
 */
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    handleFile(file);
  }
}

/**
 * Handles file processing and validation
 * @param {File} file - Selected file
 */
async function handleFile(file) {
  console.log('Processing file:', file.name, file.type, file.size);

  // Use the new validation function
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    showUploadError(validation.error);
    return;
  }

  // Compress image if it's large
  let processedFile = file;
  if (file.size > 2 * 1024 * 1024) { // 2MB
    try {
      console.log('Compressing large image...');
      const compressedBlob = await compressImage(file);
      processedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
      console.log('Image compressed from', file.size, 'to', processedFile.size, 'bytes');
    } catch (error) {
      console.warn('Failed to compress image, using original:', error);
    }
  }

  uploadedImageFile = processedFile;
  processImageFile(processedFile);
}

/**
 * Processes the uploaded image file
 * @param {File} file - Image file to process
 */
function processImageFile(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    uploadedImageUrl = e.target.result;
    displayImagePreview(uploadedImageUrl, file.name);
    clearUploadError();
    
    // Enable transformation controls
    enableTransformationControls();
  };

  reader.onerror = () => {
    showUploadError('Failed to read the image file');
  };

  reader.readAsDataURL(file);
}

/**
 * Displays the uploaded image preview
 * @param {string} imageUrl - Image data URL
 * @param {string} filename - Original filename
 */
function displayImagePreview(imageUrl, filename) {
  const previewContainer = getElementById('image-preview-container');
  const dropZone = getElementById('image-upload-zone');
  
  if (previewContainer && dropZone) {
    previewContainer.innerHTML = `
      <div class="image-preview">
        <img src="${imageUrl}" alt="Uploaded image preview" class="preview-image">
        <div class="image-info">
          <div class="filename">${filename}</div>
          <div class="file-size">${formatFileSize(uploadedImageFile.size)}</div>
        </div>
        <button id="clear-uploaded-image" class="btn btn-clear btn-small">
          <i class="fas fa-times"></i> Remove
        </button>
      </div>
    `;
    
    previewContainer.style.display = 'block';
    dropZone.style.display = 'none';
    
    // Re-attach clear button handler
    const clearBtn = getElementById('clear-uploaded-image');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearUploadedImage);
    }
  }
}

/**
 * Clears the uploaded image
 */
function clearUploadedImage() {
  uploadedImageUrl = null;
  uploadedImageFile = null;
  
  const previewContainer = getElementById('image-preview-container');
  const dropZone = getElementById('image-upload-zone');
  const fileInput = getElementById('image-upload-input');
  
  if (previewContainer) {
    previewContainer.style.display = 'none';
    previewContainer.innerHTML = '';
  }
  
  if (dropZone) {
    dropZone.style.display = 'flex';
  }
  
  if (fileInput) {
    fileInput.value = '';
  }
  
  // Disable transformation controls
  disableTransformationControls();
  clearUploadError();
}

/**
 * Shows upload error message
 * @param {string} message - Error message
 */
function showUploadError(message) {
  const errorContainer = getElementById('upload-error-message');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }
}

/**
 * Clears upload error message
 */
function clearUploadError() {
  const errorContainer = getElementById('upload-error-message');
  if (errorContainer) {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
  }
}

/**
 * Enables transformation controls
 */
function enableTransformationControls() {
  const transformBtn = getElementById('transform-btn');
  if (transformBtn) {
    transformBtn.disabled = false;
  }
}

/**
 * Disables transformation controls
 */
function disableTransformationControls() {
  const transformBtn = getElementById('transform-btn');
  if (transformBtn) {
    transformBtn.disabled = true;
  }
}

/**
 * Formats file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets the uploaded image URL
 * @returns {string|null} Image URL or null if no image uploaded
 */
export function getUploadedImageUrl() {
  return uploadedImageUrl;
}

/**
 * Gets the uploaded image file
 * @returns {File|null} Image file or null if no image uploaded
 */
export function getUploadedImageFile() {
  return uploadedImageFile;
}

/**
 * Checks if an image is uploaded
 * @returns {boolean} True if image is uploaded
 */
export function hasUploadedImage() {
  return uploadedImageUrl !== null;
}
