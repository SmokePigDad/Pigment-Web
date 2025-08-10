// Utilities for downloading images and creating ZIP files

import { UI_CONFIG } from '../config/constants.js';

/**
 * Ensures JSZip library is loaded
 * @returns {Promise<Object>} JSZip constructor
 */
export async function ensureJSZip() {
  if (window.JSZip) {
    return window.JSZip;
  }
  
  const script = document.createElement('script');
  script.src = UI_CONFIG.JSZIP_CDN_URL;
  document.head.appendChild(script);
  
  await new Promise(resolve => {
    script.onload = resolve;
  });
  
  return window.JSZip;
}

/**
 * Downloads multiple images as a ZIP file
 * @param {HTMLImageElement[]} imageElements - Array of image elements
 * @param {string} filename - ZIP filename
 * @returns {Promise<void>}
 */
export async function batchDownloadImages(imageElements, filename) {
  const JSZip = await ensureJSZip();
  const zip = new JSZip();
  let count = 1;
  
  for (const img of imageElements) {
    const url = img.src;
    if (url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const name = `image${count}.png`;
        zip.file(name, blob);
        count++;
      } catch (error) {
        console.warn(`Failed to add image ${count} to ZIP:`, error);
      }
    }
  }
  
  const content = await zip.generateAsync({ type: "blob" });
  downloadBlob(content, filename);
}

/**
 * Downloads a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename
 */
export function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, 1000);
}

/**
 * Downloads a single image
 * @param {string} imageUrl - URL of the image
 * @param {string} filename - Filename for download
 * @returns {Promise<void>}
 */
export async function downloadSingleImage(imageUrl, filename) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw error;
  }
}

/**
 * Gets favorite images from the gallery
 * @returns {HTMLImageElement[]} Array of favorite image elements
 */
export function getFavoriteImages() {
  const favoriteCards = document.querySelectorAll('.image-card.favorite');
  return Array.from(favoriteCards).map(card => 
    card.querySelector('.generated-image')
  ).filter(img => img !== null);
}

/**
 * Gets all images from the gallery
 * @returns {HTMLImageElement[]} Array of all image elements
 */
export function getAllImages() {
  return Array.from(document.querySelectorAll('.generated-image'));
}
