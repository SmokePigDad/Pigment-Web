// Utility functions for building prompts with art styles

import { artStyles } from '../config/artStyles.js';

/**
 * Builds a complete prompt by combining base prompt with art style
 * @param {string} basePrompt - The base image description
 * @param {string} artStyle - The selected art style key
 * @returns {string} Complete prompt with art style applied
 */
export function buildPrompt(basePrompt, artStyle) {
  if (artStyle && artStyles[artStyle]) {
    return `${basePrompt}, ${artStyles[artStyle]}`;
  }
  return basePrompt;
}

/**
 * Gets all available art style names
 * @returns {string[]} Array of art style names
 */
export function getArtStyleNames() {
  return Object.keys(artStyles).sort();
}

/**
 * Gets art style description by name
 * @param {string} styleName - The art style name
 * @returns {string|null} Art style description or null if not found
 */
export function getArtStyleDescription(styleName) {
  return artStyles[styleName] || null;
}
