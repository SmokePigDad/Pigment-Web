// Keyboard shortcuts component functionality

import { getElementById } from '../utils/helpers.js';
import { getSettings } from './settingsPanel.js';

const shortcuts = {
  'ctrl+enter': () => triggerGeneration(),
  'ctrl+i': () => triggerInspire(),
  'ctrl+h': () => togglePromptHistory(),
  'ctrl+r': () => generateRandomSeed(),
  'ctrl+c': () => toggleComparison(),
  'ctrl+f': () => focusFilter(),
  'ctrl+s': () => openSettings(),
  'escape': () => closeModals(),
  'ctrl+d': () => downloadAll(),
  'ctrl+shift+d': () => downloadFavorites(),
  'ctrl+shift+c': () => clearGallery()
};

/**
 * Initializes keyboard shortcuts
 */
export function initializeKeyboardShortcuts() {
  setupKeyboardHandlers();
  createShortcutsHelp();
}

/**
 * Sets up keyboard event handlers
 */
function setupKeyboardHandlers() {
  document.addEventListener('keydown', handleKeyDown);
}

/**
 * Handles keydown events
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyDown(event) {
  // Check if shortcuts are enabled
  const settings = getSettings();
  if (!settings?.enableKeyboardShortcuts) return;

  // Don't trigger shortcuts when typing in inputs
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
    // Allow escape to work in inputs
    if (event.key === 'Escape') {
      event.target.blur();
      closeModals();
    }
    return;
  }

  const key = buildKeyString(event);
  const handler = shortcuts[key];

  if (handler) {
    event.preventDefault();
    handler();
  }
}

/**
 * Builds a key string from keyboard event
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {string} Key string
 */
function buildKeyString(event) {
  const parts = [];
  
  if (event.ctrlKey) parts.push('ctrl');
  if (event.shiftKey) parts.push('shift');
  if (event.altKey) parts.push('alt');
  
  parts.push(event.key.toLowerCase());
  
  return parts.join('+');
}

/**
 * Creates the shortcuts help UI
 */
function createShortcutsHelp() {
  const helpBtn = document.createElement('button');
  helpBtn.id = 'shortcuts-help-btn';
  helpBtn.className = 'btn shortcuts-help-btn';
  helpBtn.innerHTML = '<i class="fas fa-keyboard"></i>';
  helpBtn.title = 'View keyboard shortcuts (Ctrl+?)';
  
  const galleryControls = document.querySelector('.gallery-controls');
  if (galleryControls) {
    galleryControls.appendChild(helpBtn);
  }

  helpBtn.addEventListener('click', showShortcutsModal);

  // Add Ctrl+? shortcut to show help
  shortcuts['ctrl+?'] = showShortcutsModal;
  shortcuts['ctrl+/'] = showShortcutsModal;

  createShortcutsModal();
}

/**
 * Creates the shortcuts help modal
 */
function createShortcutsModal() {
  const modal = document.createElement('div');
  modal.id = 'shortcuts-modal';
  modal.className = 'shortcuts-modal';
  modal.innerHTML = `
    <div class="shortcuts-modal-content">
      <div class="shortcuts-header">
        <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
        <button id="close-shortcuts" class="btn-close">&times;</button>
      </div>
      <div class="shortcuts-container">
        <div class="shortcuts-section">
          <h4>Generation</h4>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
            <span>Generate Images</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>I</kbd>
            <span>Get Inspiration</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>R</kbd>
            <span>Generate Random Seed</span>
          </div>
        </div>
        
        <div class="shortcuts-section">
          <h4>Gallery</h4>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>D</kbd>
            <span>Download All Images</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>
            <span>Download Favorites</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>C</kbd>
            <span>Toggle Comparison Mode</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>
            <span>Clear Gallery</span>
          </div>
        </div>
        
        <div class="shortcuts-section">
          <h4>Interface</h4>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>H</kbd>
            <span>Toggle Prompt History</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>F</kbd>
            <span>Focus Search Filter</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>S</kbd>
            <span>Open Settings</span>
          </div>
          <div class="shortcut-item">
            <kbd>Escape</kbd>
            <span>Close Modals</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Setup close handler
  const closeBtn = modal.querySelector('#close-shortcuts');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideShortcutsModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideShortcutsModal();
    }
  });
}

// Shortcut handler functions
function triggerGeneration() {
  const generateBtn = getElementById('generate-btn');
  if (generateBtn && !generateBtn.disabled) {
    generateBtn.click();
  }
}

function triggerInspire() {
  const inspireBtn = getElementById('inspire-btn');
  if (inspireBtn) {
    inspireBtn.click();
  }
}

function togglePromptHistory() {
  const historyBtn = getElementById('prompt-history-btn');
  if (historyBtn) {
    historyBtn.click();
  }
}

function generateRandomSeed() {
  const randomSeedBtn = getElementById('random-seed-btn');
  if (randomSeedBtn) {
    randomSeedBtn.click();
  }
}

function toggleComparison() {
  const compareBtn = getElementById('compare-toggle-btn');
  if (compareBtn) {
    compareBtn.click();
  }
}

function focusFilter() {
  const filterSearch = getElementById('filter-search');
  if (filterSearch) {
    filterSearch.focus();
  }
}

function openSettings() {
  const settingsBtn = getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.click();
  }
}

function closeModals() {
  // Close all open modals
  const modals = document.querySelectorAll('.comparison-modal, .settings-modal, .shortcuts-modal');
  modals.forEach(modal => {
    if (modal.style.display !== 'none') {
      modal.style.display = 'none';
    }
  });
  
  // Close dropdowns
  const dropdowns = document.querySelectorAll('.prompt-history-dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.style.display = 'none';
  });
  
  document.body.style.overflow = '';
}

function downloadAll() {
  const downloadBtn = getElementById('download-all-btn');
  if (downloadBtn) {
    downloadBtn.click();
  }
}

function downloadFavorites() {
  const downloadFavBtn = getElementById('download-favorites-btn');
  if (downloadFavBtn) {
    downloadFavBtn.click();
  }
}

function clearGallery() {
  const clearBtn = getElementById('clear-btn');
  if (clearBtn) {
    clearBtn.click();
  }
}

function showShortcutsModal() {
  const modal = getElementById('shortcuts-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function hideShortcutsModal() {
  const modal = getElementById('shortcuts-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}
