// Service for Kontext image-to-image transformation API

import { API_CONFIG } from '../config/constants.js';
import { uploadImageToHost, dataUrlToBlob } from './imageHostingService.js';

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
    // Convert data URL to blob and upload to hosting service
    try {
      console.log('Converting data URL to blob...');
      const blob = await dataUrlToBlob(imageUrl);

      console.log('Uploading image to hosting service...');
      publicImageUrl = await uploadImageToHost(blob);
      console.log('Image uploaded successfully:', publicImageUrl);

      if (!publicImageUrl || publicImageUrl.startsWith('data:')) {
        throw new Error('Failed to get public URL for image');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error(`Unable to upload image: ${error.message}`);
    }
  }

  // Build the Kontext API URL
  const apiUrl = `${API_CONFIG.POLLINATIONS_BASE_URL}/prompt/${encodedPrompt}?model=kontext&image=${encodeURIComponent(publicImageUrl)}`;

  console.log('Making API request to:', apiUrl.substring(0, 200) + '...');

  try {
    const response = await fetch(apiUrl, {
      signal,
      method: 'GET',
      headers: {
        'Accept': 'image/*'
      }
    });
    
    console.log('API response status:', response.status, response.statusText);

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait and try again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`Transformation failed (${response.status}): ${errorText || response.statusText}`);
    }

    const blob = await response.blob();
    console.log('Received blob:', blob.type, blob.size);

    if (!blob || blob.size === 0) {
      throw new Error('API returned an empty response');
    }

    if (!blob.type.startsWith('image')) {
      console.warn('Unexpected blob type:', blob.type);
      // Some APIs might return images with generic content types
      if (blob.size > 1000) { // Assume it's an image if it's large enough
        console.log('Assuming blob is an image based on size');
      } else {
        throw new Error('API did not return a valid image');
      }
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
