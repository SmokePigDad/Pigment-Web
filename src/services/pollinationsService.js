// Service for interacting with Pollinations AI API

import { API_CONFIG } from '../config/constants.js';

/**
 * Generates an image URL for the Pollinations API
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - The image prompt
 * @param {number} params.width - Image width
 * @param {number} params.height - Image height
 * @param {string} params.seed - Generation seed
 * @param {string} params.model - AI model to use
 * @param {boolean} params.nologo - Remove watermark
 * @param {boolean} params.private - Private generation
 * @param {boolean} params.enhance - Enhance prompt
 * @param {boolean} params.transparent - Transparent background
 * @returns {string} Complete API URL
 */
export function buildImageUrl(params) {
  const {
    prompt,
    width,
    height,
    seed,
    model,
    nologo,
    private: priv,
    enhance,
    transparent
  } = params;

  const encodedPrompt = encodeURIComponent(prompt);
  const urlParams = {
    width,
    height,
    seed,
    model,
    '_': Date.now()
  };

  if (nologo) urlParams.nologo = "true";
  if (priv) urlParams.private = "true";
  if (enhance) urlParams.enhance = "true";
  if (transparent) urlParams.transparent = "true";

  const searchParams = new URLSearchParams(urlParams);
  return `${API_CONFIG.POLLINATIONS_BASE_URL}/prompt/${encodedPrompt}?${searchParams.toString()}`;
}

/**
 * Fetches an image from the Pollinations API with retry logic
 * @param {string} url - The API URL
 * @param {number} maxRetries - Maximum number of retries
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise<Blob>} Image blob
 * @throws {Error} If all retries fail or request is aborted
 */
export async function fetchImageWithRetry(url, maxRetries = API_CONFIG.MAX_RETRIES, signal) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, { signal });
      
      if (response.status === 429) {
        throw new Error(`Rate limit exceeded (HTTP 429): Too many requests. Please wait and try again.`);
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }
      
      const blob = await response.blob();
      if (!blob || !blob.type.startsWith("image")) {
        throw new Error("API did not return a valid image.");
      }
      
      return blob;
    } catch (error) {
      lastError = error;
      
      if (error.name === 'AbortError') {
        throw lastError;
      }
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      }
    }
  }
  
  throw lastError;
}

/**
 * Generates a random seed for image generation
 * @returns {number} Random seed
 */
export function generateRandomSeed() {
  return Math.floor(Math.random() * 1000000);
}
