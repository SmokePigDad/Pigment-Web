// Size selector component functionality

import { IMAGE_SIZES } from '../config/constants.js';
import { getElementById } from '../utils/helpers.js';

/**
 * Initializes the size selector dropdown
 */
export function initializeSizeSelector() {
  const sizeDropdown = getElementById('size');
  
  if (!sizeDropdown) {
    console.warn('Size dropdown not found');
    return;
  }

  populateSizeDropdown(sizeDropdown);
}

/**
 * Populates the size dropdown with available sizes
 * @param {HTMLSelectElement} dropdown - Size dropdown element
 */
function populateSizeDropdown(dropdown) {
  try {
    let optionsHTML = '';
    
    for (const size of IMAGE_SIZES) {
      const isSelected = size.selected ? ' selected' : '';
      optionsHTML += `<option value="${size.value}"${isSelected}>${size.label}</option>`;
    }
    
    dropdown.innerHTML = optionsHTML;
    
  } catch (error) {
    console.error('Error populating size dropdown:', error);
    // Fallback to basic options
    dropdown.innerHTML = `
      <option value="512,512">512×512 (Square)</option>
      <option value="1024,1024" selected>1024×1024 (Square)</option>
      <option value="640,960">640×960 (2:3 Portrait)</option>
      <option value="960,640">960×640 (3:2 Landscape)</option>
    `;
  }
}
