// Art style selector component functionality

import { getArtStyleNames } from '../utils/promptBuilder.js';
import { getElementById } from '../utils/helpers.js';

/**
 * Initializes the art style selector dropdown
 */
export function initializeArtStyleSelector() {
  const styleDropdown = getElementById('style');
  
  if (!styleDropdown) {
    console.warn('Style dropdown not found');
    return;
  }

  populateArtStyleDropdown(styleDropdown);
}

/**
 * Populates the art style dropdown with available styles
 * @param {HTMLSelectElement} dropdown - Style dropdown element
 */
function populateArtStyleDropdown(dropdown) {
  try {
    // Start with default option
    dropdown.innerHTML = '<option value="">None (Default)</option>';
    
    // Get sorted style names
    const styleNames = getArtStyleNames();
    
    // Build options HTML
    let stylesHTML = '';
    for (const name of styleNames) {
      stylesHTML += `<option value="${name}">${name}</option>`;
    }
    
    // Add to dropdown
    dropdown.innerHTML += stylesHTML;
    
  } catch (error) {
    console.error('Error populating art style dropdown:', error);
    dropdown.innerHTML = '<option value="">None (Default)</option>';
  }
}

/**
 * Gets the currently selected art style
 * @returns {string} Selected art style or empty string for default
 */
export function getSelectedArtStyle() {
  const styleDropdown = getElementById('style');
  return styleDropdown ? styleDropdown.value : '';
}

/**
 * Sets the selected art style
 * @param {string} styleName - Name of the style to select
 */
export function setSelectedArtStyle(styleName) {
  const styleDropdown = getElementById('style');
  if (styleDropdown) {
    styleDropdown.value = styleName;
  }
}
