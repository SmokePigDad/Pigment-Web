// Batch mode toggle component functionality

import { getElementById } from '../utils/helpers.js';

// Internal batch mode state
let batchMode = false;

/**
 * Initializes the batch mode toggle
 */
export function initializeBatchToggle() {
  const batchToggle = getElementById('batch-toggle');
  
  if (!batchToggle) {
    console.warn('Batch toggle not found');
    return;
  }

  setupBatchToggleHandler(batchToggle);
}

/**
 * Sets up the batch toggle event handler
 * @param {HTMLElement} toggleButton - Batch toggle button element
 */
function setupBatchToggleHandler(toggleButton) {
  // Initialize to false
  setBatchToggleState(false);

  toggleButton.addEventListener('click', function() {
    const newState = !batchMode;
    setBatchToggleState(newState);
    updateBatchModeUI(newState);
  });
}

/**
 * Sets the batch toggle state
 * @param {boolean} val - New batch mode state
 */
function setBatchToggleState(val) {
  batchMode = !!val;
  const btn = getElementById('batch-toggle');
  if (!btn) return;

  btn.setAttribute('aria-checked', batchMode ? 'true' : 'false');
  if (batchMode) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}

/**
 * Updates UI elements based on batch mode state
 * @param {boolean} isBatchMode - Whether batch mode is enabled
 */
function updateBatchModeUI(isBatchMode) {
  const countSelect = getElementById('count');
  const styleSelect = getElementById('style');
  
  if (countSelect) {
    countSelect.disabled = isBatchMode;
    if (isBatchMode) {
      countSelect.style.opacity = '0.5';
    } else {
      countSelect.style.opacity = '1';
    }
  }
  
  if (styleSelect) {
    styleSelect.disabled = isBatchMode;
    if (isBatchMode) {
      styleSelect.style.opacity = '0.5';
    } else {
      styleSelect.style.opacity = '1';
    }
  }
}

/**
 * Checks if batch mode is currently enabled
 * @returns {boolean} True if batch mode is enabled
 */
export function isBatchModeEnabled() {
  return batchMode === true;
}

/**
 * Sets the batch mode state
 * @param {boolean} enabled - Whether to enable batch mode
 */
export function setBatchMode(enabled) {
  setBatchToggleState(enabled);
  updateBatchModeUI(enabled);
}
