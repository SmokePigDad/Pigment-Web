// Application state management

/**
 * Application state object
 */
export const AppState = {
  isGenerating: false,
  abortGeneration: false,
  currentAbortController: null,
  revokeURLs: [],
  availableModels: [],
  activeModel: null
};

/**
 * Set of favorite image IDs
 */
export const FAVORITES = new Set();

/**
 * Updates the generation state
 * @param {boolean} isGenerating - Whether generation is in progress
 * @param {AbortController} abortController - Current abort controller
 */
export function setGenerationState(isGenerating, abortController = null) {
  AppState.isGenerating = isGenerating;
  AppState.currentAbortController = abortController;
  AppState.abortGeneration = false;
}

/**
 * Aborts the current generation
 */
export function abortGeneration() {
  AppState.abortGeneration = true;
  if (AppState.currentAbortController) {
    AppState.currentAbortController.abort();
    AppState.currentAbortController = null;
  }
  AppState.isGenerating = false;
}

/**
 * Adds a URL to be revoked later
 * @param {string} url - Object URL to track
 */
export function addRevokeURL(url) {
  AppState.revokeURLs.push(url);
}

/**
 * Revokes all tracked URLs and clears the list
 */
export function revokeAllURLs() {
  if (AppState.revokeURLs && Array.isArray(AppState.revokeURLs)) {
    for (const url of AppState.revokeURLs) {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Failed to revoke URL:', url, error);
      }
    }
  }
  AppState.revokeURLs = [];
}

/**
 * Sets the available models
 * @param {Array} models - Array of model objects
 */
export function setAvailableModels(models) {
  AppState.availableModels = models;
  const defaultModel = models.find(m => m.is_default) || models[0];
  AppState.activeModel = defaultModel ? defaultModel.name : null;
}

/**
 * Sets the active model
 * @param {string} modelName - Name of the model to set as active
 */
export function setActiveModel(modelName) {
  AppState.activeModel = modelName;
}

/**
 * Gets the current active model
 * @returns {string|null} Active model name
 */
export function getActiveModel() {
  return AppState.activeModel;
}

/**
 * Adds an image to favorites
 * @param {string} imageId - Image ID to add to favorites
 */
export function addToFavorites(imageId) {
  FAVORITES.add(imageId);
}

/**
 * Removes an image from favorites
 * @param {string} imageId - Image ID to remove from favorites
 */
export function removeFromFavorites(imageId) {
  FAVORITES.delete(imageId);
}

/**
 * Checks if an image is in favorites
 * @param {string} imageId - Image ID to check
 * @returns {boolean} True if image is favorited
 */
export function isFavorite(imageId) {
  return FAVORITES.has(imageId);
}

/**
 * Clears all favorites
 */
export function clearFavorites() {
  FAVORITES.clear();
}

/**
 * Gets all favorite image IDs
 * @returns {string[]} Array of favorite image IDs
 */
export function getFavoriteIds() {
  return Array.from(FAVORITES);
}

/**
 * Resets the entire application state
 */
export function resetAppState() {
  abortGeneration();
  revokeAllURLs();
  clearFavorites();
}
