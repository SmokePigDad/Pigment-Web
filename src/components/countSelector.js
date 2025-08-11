// Count selector component functionality

import { IMAGE_COUNTS } from '../config/constants.js';
import { getElementById } from '../utils/helpers.js';

/**
 * Initializes the count selector dropdown
 */
export function initializeCountSelector() {
  const countDropdown = getElementById('count');
  
  if (!countDropdown) {
    console.warn('Count dropdown not found');
    return;
  }

  populateCountDropdown(countDropdown);
}

/**
 * Populates the count dropdown with available counts
 * @param {HTMLSelectElement} dropdown - Count dropdown element
 */
function populateCountDropdown(dropdown) {
  try {
    let optionsHTML = '';
    
    for (const count of IMAGE_COUNTS) {
      const isSelected = count.selected ? ' selected' : '';
      optionsHTML += `<option value="${count.value}"${isSelected}>${count.label}</option>`;
    }
    
    dropdown.innerHTML = optionsHTML;
    
  } catch (error) {
    console.error('Error populating count dropdown:', error);
    // Fallback to basic options
    dropdown.innerHTML = `
      <option value="2">2 images</option>
      <option value="4" selected>4 images</option>
      <option value="10">10 images</option>
      <option value="25">25 images</option>
    `;
  }
}
