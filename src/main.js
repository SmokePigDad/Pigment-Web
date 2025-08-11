// Main application entry point

import { initializeModelSelector } from './components/modelSelector.js';
import { initializeArtStyleSelector } from './components/artStyleSelector.js';
import { initializeSizeSelector } from './components/sizeSelector.js';
import { initializeCountSelector } from './components/countSelector.js';
import { initializeBatchToggle } from './components/batchToggle.js';
import { initializeInspireButton } from './components/inspireButton.js';
import { initializeGallery } from './components/gallery.js';
import { initializeImageGenerator } from './components/imageGenerator.js';
import { initializePromptHistory } from './components/promptHistory.js';
import { initializeSeedControl } from './components/seedControl.js';
import { initializeImageComparison } from './components/imageComparison.js';
import { initializeGalleryFilter } from './components/galleryFilter.js';
import { initializeSettingsPanel } from './components/settingsPanel.js';
import { initializeKeyboardShortcuts } from './components/keyboardShortcuts.js';
import { initializeTabSystem } from './components/tabSystem.js';
import { initializeImageUpload } from './components/imageUpload.js';
import { initializeImageToImage } from './components/imageToImage.js';

/**
 * Initializes the entire application
 */
function initializeApp() {
  console.log('Initializing Pigment application...');
  
  try {
    // Initialize tab system first
    initializeTabSystem();

    // Initialize all components
    initializeModelSelector();
    initializeArtStyleSelector();
    initializeSizeSelector();
    initializeCountSelector();
    initializeBatchToggle();
    initializeInspireButton();
    initializeGallery();
    initializeImageGenerator();

    // Initialize new enhanced features
    initializePromptHistory();
    initializeSeedControl();
    initializeImageComparison();
    initializeGalleryFilter();
    initializeSettingsPanel();
    initializeKeyboardShortcuts();

    // Initialize image-to-image features
    initializeImageUpload();
    initializeImageToImage();
    
    console.log('Pigment application initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

/**
 * Handles DOM content loaded event
 */
function handleDOMContentLoaded() {
  initializeApp();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
} else {
  // DOM is already loaded
  handleDOMContentLoaded();
}

// Export for potential external use
export { initializeApp };
