// Service for Kontext image-to-image transformation API

import { API_CONFIG } from '../config/constants.js';

/**
 * Uploads image to a temporary hosting service and returns URL
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<string>} URL of uploaded image
 */
export async function uploadImageForTransformation(imageFile) {
  // Convert file to data URL for now
  // In production, you'd want to upload to a proper image hosting service
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };

    reader.readAsDataURL(imageFile);
  });
}

/**
 * Transforms an image using the Kontext model
 * @param {Object} params - Transformation parameters
 * @param {string} params.prompt - Transformation prompt
 * @param {string} params.imageUrl - URL of the source image
 * @param {AbortSignal} params.signal - Abort signal for cancellation
 * @returns {Promise<Blob>} Transformed image blob
 */
export async function transformImage(params) {
  const { prompt, imageUrl, signal } = params;
  
  // URL encode the prompt
  const encodedPrompt = encodeURIComponent(prompt);
  
  // For data URLs, we need to upload to a temporary service first
  let publicImageUrl = imageUrl;

  if (imageUrl.startsWith('data:')) {
    // Try to upload to a temporary service, fallback to data URL
    try {
      publicImageUrl = await uploadToTempService(imageUrl);
    } catch (error) {
      console.warn('Failed to upload image, using data URL directly:', error);
      // Some APIs might accept data URLs directly
      publicImageUrl = imageUrl;
    }
  }
  
  // Build the Kontext API URL
  const apiUrl = `${API_CONFIG.POLLINATIONS_BASE_URL}/prompt/${encodedPrompt}?model=kontext&image=${encodeURIComponent(publicImageUrl)}`;
  
  try {
    const response = await fetch(apiUrl, { signal });
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait and try again.');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transformation failed (${response.status}): ${errorText}`);
    }
    
    const blob = await response.blob();
    
    if (!blob || !blob.type.startsWith('image')) {
      throw new Error('API did not return a valid image');
    }
    
    return blob;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Transformation was cancelled');
    }
    throw error;
  }
}

/**
 * Uploads image data URL to a temporary hosting service
 * @param {string} dataUrl - Data URL of the image
 * @returns {Promise<string>} Public URL of uploaded image
 */
async function uploadToTempService(dataUrl) {
  // Convert data URL to blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  // For this implementation, we'll use imgbb as a temporary hosting service
  // In production, you might want to use your own backend or a service like Cloudinary

  try {
    // Try using a simple temporary file hosting service
    const formData = new FormData();
    formData.append('file', blob, 'image.png');

    // Using 0x0.st as a simple temporary hosting service
    const uploadResponse = await fetch('https://0x0.st', {
      method: 'POST',
      body: formData
    });

    if (uploadResponse.ok) {
      const url = await uploadResponse.text();
      return url.trim();
    }
  } catch (error) {
    console.warn('Failed to upload to temporary service:', error);
  }

  // Fallback: try a different approach - use the data URL directly
  // Some APIs might accept data URLs, though it's not guaranteed
  return dataUrl;
}

/**
 * Validates if a file is a supported image format
 * @param {File} file - File to validate
 * @returns {boolean} True if file is supported
 */
export function isValidImageFile(file) {
  return SUPPORTED_FORMATS.includes(file.type) && file.size <= MAX_FILE_SIZE;
}

/**
 * Gets supported file formats as a string
 * @returns {string} Comma-separated list of supported formats
 */
export function getSupportedFormats() {
  return SUPPORTED_FORMATS.map(format => format.split('/')[1].toUpperCase()).join(', ');
}

/**
 * Converts file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets the maximum allowed file size
 * @returns {number} Maximum file size in bytes
 */
export function getMaxFileSize() {
  return MAX_FILE_SIZE;
}
