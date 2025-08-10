// Inspire button component functionality

import { getInspirationPrompt } from '../services/inspireService.js';
import { getElementById } from '../utils/helpers.js';

/**
 * Initializes the inspire button
 */
export function initializeInspireButton() {
  const inspireBtn = getElementById('inspire-btn');
  
  if (!inspireBtn) {
    console.warn('Inspire button not found');
    return;
  }

  setupInspireClickHandler(inspireBtn);
  setupInspireKeyboardHandler(inspireBtn);
}

/**
 * Sets up the inspire button click handler
 * @param {HTMLElement} button - Inspire button element
 */
function setupInspireClickHandler(button) {
  button.addEventListener('click', handleInspireClick);
}

/**
 * Sets up the inspire button keyboard handler
 * @param {HTMLElement} button - Inspire button element
 */
function setupInspireKeyboardHandler(button) {
  button.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      handleInspireClick();
    }
  });
}

/**
 * Handles the inspire button click/activation
 */
async function handleInspireClick() {
  const promptElement = getElementById('prompt');
  
  if (!promptElement) {
    console.warn('Prompt element not found');
    return;
  }

  const currentPrompt = promptElement.value.trim();
  
  try {
    // Show loading state
    setInspireButtonLoading(true);
    
    // Get new inspiration prompt
    const newPrompt = await getInspirationPrompt(currentPrompt);
    
    // Update prompt field
    promptElement.value = newPrompt;
    promptElement.focus();
    
  } catch (error) {
    console.error('Error getting inspiration:', error);
    
    // Fallback to a simple default if everything fails
    promptElement.value = "A beautiful landscape at sunset";
    promptElement.focus();
    
  } finally {
    // Remove loading state
    setInspireButtonLoading(false);
  }
}

/**
 * Sets the loading state of the inspire button
 * @param {boolean} isLoading - Whether the button is in loading state
 */
function setInspireButtonLoading(isLoading) {
  const inspireBtn = getElementById('inspire-btn');
  
  if (!inspireBtn) return;
  
  const icon = inspireBtn.querySelector('i');
  
  if (isLoading) {
    inspireBtn.disabled = true;
    inspireBtn.style.opacity = '0.6';
    
    if (icon) {
      icon.className = 'fas fa-spinner fa-spin';
    }
  } else {
    inspireBtn.disabled = false;
    inspireBtn.style.opacity = '1';
    
    if (icon) {
      icon.className = 'fas fa-dice';
    }
  }
}
