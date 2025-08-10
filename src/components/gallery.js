// Gallery component functionality

import { addToFavorites, removeFromFavorites, isFavorite, resetAppState } from '../utils/stateManager.js';
import { batchDownloadImages, getFavoriteImages, getAllImages, downloadSingleImage } from '../utils/downloadUtils.js';
import { getElementById, generateUniqueId } from '../utils/helpers.js';

/**
 * Initializes the gallery component
 */
export function initializeGallery() {
  setupGalleryControls();
}

/**
 * Sets up gallery control buttons
 */
function setupGalleryControls() {
  const clearBtn = getElementById('clear-btn');
  const downloadAllBtn = getElementById('download-all-btn');
  const downloadFavoritesBtn = getElementById('download-favorites-btn');

  if (clearBtn) {
    clearBtn.addEventListener('click', handleClearGallery);
  }

  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', handleDownloadAll);
  }

  if (downloadFavoritesBtn) {
    downloadFavoritesBtn.addEventListener('click', handleDownloadFavorites);
  }
}

/**
 * Handles clearing the gallery
 */
function handleClearGallery() {
  resetAppState();
  
  const gallery = getElementById('gallery');
  if (gallery) {
    gallery.innerHTML = "";
  }
  
  // Reset progress indicators
  const progressBar = getElementById('progress-bar');
  const progressText = getElementById('progress-text');
  const statusMessage = getElementById('status-message');
  
  if (progressBar) progressBar.style.width = "0%";
  if (progressText) progressText.textContent = "Ready to generate";
  if (statusMessage) statusMessage.textContent = "Generation cancelled.";
  
  // Blur prompt field
  const promptElement = getElementById('prompt');
  if (promptElement) promptElement.blur();
}

/**
 * Handles downloading all images
 */
async function handleDownloadAll() {
  const images = getAllImages();
  if (images.length === 0) {
    showGalleryStatus("No images to download", true);
    return;
  }
  
  try {
    await batchDownloadImages(images, "all-images.zip");
    showGalleryStatus(`Downloaded ${images.length} images`);
  } catch (error) {
    console.error('Error downloading all images:', error);
    showGalleryStatus("Failed to download images", true);
  }
}

/**
 * Handles downloading favorite images
 */
async function handleDownloadFavorites() {
  const favoriteImages = getFavoriteImages();
  if (favoriteImages.length === 0) {
    showGalleryStatus("No favorite images to download", true);
    return;
  }
  
  try {
    await batchDownloadImages(favoriteImages, "favorite-images.zip");
    showGalleryStatus(`Downloaded ${favoriteImages.length} favorite images`);
  } catch (error) {
    console.error('Error downloading favorite images:', error);
    showGalleryStatus("Failed to download favorite images", true);
  }
}

/**
 * Creates an image card element
 * @param {Object} params - Image parameters
 * @param {string} params.prompt - Image prompt
 * @param {string} params.style - Art style
 * @param {string} params.seed - Generation seed
 * @returns {HTMLElement} Image card element
 */
export function createImageCard(params) {
  const { prompt, style, seed } = params;
  const imgId = generateUniqueId('img');
  
  const card = document.createElement('div');
  card.className = "image-card";
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "group");
  card.setAttribute("aria-label", style ? `Generated image in ${style} style` : `Generated image`);
  card.dataset.imgId = imgId;

  const imgContainer = document.createElement('div');
  imgContainer.className = "image-container";

  const placeholder = document.createElement('div');
  placeholder.className = "image-placeholder";
  imgContainer.appendChild(placeholder);

  const imgElement = document.createElement('img');
  imgElement.className = "generated-image";
  imgElement.alt = `AI output for: ${prompt}`;
  imgContainer.appendChild(imgElement);

  const favButton = createFavoriteButton(imgId);
  imgContainer.appendChild(favButton);

  const overlay = createImageOverlay(imgElement, prompt, style, seed);
  imgContainer.appendChild(overlay);

  card.appendChild(imgContainer);
  
  return { card, imgElement, placeholder };
}

/**
 * Creates a favorite toggle button
 * @param {string} imgId - Image ID
 * @returns {HTMLElement} Favorite button element
 */
function createFavoriteButton(imgId) {
  const favBtn = document.createElement('button');
  favBtn.className = "fav-toggle";
  favBtn.innerHTML = `<i class="fas fa-heart"></i>`;
  favBtn.setAttribute('aria-pressed', 'false');
  favBtn.setAttribute('aria-label', 'Mark as favorite');
  favBtn.title = "Mark as favorite";
  
  favBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleFavorite(imgId, favBtn);
  });
  
  return favBtn;
}

/**
 * Creates image overlay with action buttons
 * @param {HTMLImageElement} imgElement - Image element
 * @param {string} prompt - Image prompt
 * @param {string} style - Art style
 * @param {string} seed - Generation seed
 * @returns {HTMLElement} Overlay element
 */
function createImageOverlay(imgElement, prompt, style, seed) {
  const overlay = document.createElement('div');
  overlay.className = 'card-overlay';

  const actions = document.createElement('div');
  actions.className = "image-actions";

  // Download button
  const dlBtn = document.createElement('button');
  dlBtn.className = "action-btn";
  dlBtn.innerHTML = `<i class="fas fa-download"></i>`;
  dlBtn.title = "Download image";
  dlBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    downloadSingleImage(imgElement.src, `image-${Date.now()}.png`);
  });

  actions.appendChild(dlBtn);
  overlay.appendChild(actions);
  
  return overlay;
}

/**
 * Toggles favorite status for an image
 * @param {string} imgId - Image ID
 * @param {HTMLElement} favButton - Favorite button element
 */
function toggleFavorite(imgId, favButton) {
  const card = favButton.closest('.image-card');
  
  if (isFavorite(imgId)) {
    removeFromFavorites(imgId);
    favButton.setAttribute('aria-pressed', 'false');
    favButton.title = "Mark as favorite";
    card.classList.remove('favorite');
  } else {
    addToFavorites(imgId);
    favButton.setAttribute('aria-pressed', 'true');
    favButton.title = "Remove from favorites";
    card.classList.add('favorite');
  }
}

/**
 * Shows a status message in the gallery
 * @param {string} message - Status message
 * @param {boolean} isError - Whether this is an error message
 */
export function showGalleryStatus(message, isError = false) {
  const statusElement = getElementById('status-message');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.color = isError ? '#f44336' : '#48c774';
    
    setTimeout(() => {
      statusElement.textContent = "";
      statusElement.style.color = '';
    }, 2200);
  }
}
