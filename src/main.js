// Main application entry point

import { initializeModelSelector } from './components/modelSelector.js';
import { initializeArtStyleSelector } from './components/artStyleSelector.js';
import { initializeBatchToggle } from './components/batchToggle.js';
import { initializeInspireButton } from './components/inspireButton.js';
import { initializeGallery } from './components/gallery.js';
import { initializeImageGenerator } from './components/imageGenerator.js';

/**
 * Initializes the entire application
 */
function initializeApp() {
  console.log('Initializing Pigment application...');
  
  try {
    // Initialize all components
    initializeModelSelector();
    initializeArtStyleSelector();
    initializeBatchToggle();
    initializeInspireButton();
    initializeGallery();
    initializeImageGenerator();
    
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
