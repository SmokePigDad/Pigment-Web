// Image comparison component functionality

import { getElementById } from '../utils/helpers.js';

let comparisonMode = false;
let selectedImages = new Set();

/**
 * Initializes the image comparison component
 */
export function initializeImageComparison() {
  createComparisonUI();
  setupComparisonHandlers();
}

/**
 * Creates the comparison UI elements
 */
function createComparisonUI() {
  const galleryControls = document.querySelector('.gallery-controls');
  if (!galleryControls) return;

  // Create comparison toggle button
  const compareBtn = document.createElement('button');
  compareBtn.id = 'compare-toggle-btn';
  compareBtn.className = 'btn';
  compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
  compareBtn.title = 'Toggle comparison mode';
  compareBtn.setAttribute('aria-label', 'Toggle image comparison mode');

  // Create comparison view button
  const viewCompareBtn = document.createElement('button');
  viewCompareBtn.id = 'view-compare-btn';
  viewCompareBtn.className = 'btn btn-compare-view';
  viewCompareBtn.innerHTML = '<i class="fas fa-eye"></i>';
  viewCompareBtn.title = 'View selected images in comparison';
  viewCompareBtn.style.display = 'none';

  galleryControls.appendChild(compareBtn);
  galleryControls.appendChild(viewCompareBtn);

  // Create comparison modal
  createComparisonModal();
}

/**
 * Creates the comparison modal
 */
function createComparisonModal() {
  const modal = document.createElement('div');
  modal.id = 'comparison-modal';
  modal.className = 'comparison-modal';
  modal.innerHTML = `
    <div class="comparison-modal-content">
      <div class="comparison-header">
        <h3>Image Comparison</h3>
        <button id="close-comparison" class="btn-close">&times;</button>
      </div>
      <div class="comparison-container" id="comparison-container">
        <!-- Images will be inserted here -->
      </div>
      <div class="comparison-controls">
        <button id="clear-comparison" class="btn btn-clear">Clear Selection</button>
        <button id="download-comparison" class="btn">Download Selected</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

/**
 * Sets up event handlers for comparison functionality
 */
function setupComparisonHandlers() {
  const compareBtn = getElementById('compare-toggle-btn');
  const viewCompareBtn = getElementById('view-compare-btn');
  const modal = getElementById('comparison-modal');
  const closeBtn = getElementById('close-comparison');
  const clearBtn = getElementById('clear-comparison');

  if (compareBtn) {
    compareBtn.addEventListener('click', toggleComparisonMode);
  }

  if (viewCompareBtn) {
    viewCompareBtn.addEventListener('click', showComparisonModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', hideComparisonModal);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearComparison);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideComparisonModal();
      }
    });
  }

  // Listen for new images being added to gallery
  const gallery = getElementById('gallery');
  if (gallery) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('image-card')) {
            setupImageCardComparison(node);
          }
        });
      });
    });

    observer.observe(gallery, { childList: true });
  }
}

/**
 * Sets up comparison functionality for an image card
 * @param {HTMLElement} card - Image card element
 */
function setupImageCardComparison(card) {
  if (!comparisonMode) return;

  card.addEventListener('click', (e) => {
    if (!comparisonMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const imgId = card.dataset.imgId;
    if (!imgId) return;

    if (selectedImages.has(imgId)) {
      selectedImages.delete(imgId);
      card.classList.remove('comparison-selected');
    } else {
      if (selectedImages.size >= 4) {
        showComparisonMessage('Maximum 4 images can be compared at once');
        return;
      }
      selectedImages.add(imgId);
      card.classList.add('comparison-selected');
    }

    updateComparisonUI();
  });
}

/**
 * Toggles comparison mode
 */
function toggleComparisonMode() {
  comparisonMode = !comparisonMode;
  const compareBtn = getElementById('compare-toggle-btn');
  const gallery = getElementById('gallery');

  if (comparisonMode) {
    compareBtn.classList.add('active');
    compareBtn.innerHTML = '<i class="fas fa-times"></i>';
    compareBtn.title = 'Exit comparison mode';
    gallery?.classList.add('comparison-mode');
    
    // Setup existing cards
    document.querySelectorAll('.image-card').forEach(setupImageCardComparison);
    showComparisonMessage('Click images to select for comparison (max 4)');
  } else {
    compareBtn.classList.remove('active');
    compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
    compareBtn.title = 'Toggle comparison mode';
    gallery?.classList.remove('comparison-mode');
    clearComparison();
  }
}

/**
 * Updates the comparison UI based on selected images
 */
function updateComparisonUI() {
  const viewCompareBtn = getElementById('view-compare-btn');
  if (viewCompareBtn) {
    if (selectedImages.size >= 2) {
      viewCompareBtn.style.display = 'inline-flex';
      viewCompareBtn.innerHTML = `<i class="fas fa-eye"></i> Compare (${selectedImages.size})`;
    } else {
      viewCompareBtn.style.display = 'none';
    }
  }
}

/**
 * Shows the comparison modal
 */
function showComparisonModal() {
  const modal = getElementById('comparison-modal');
  const container = getElementById('comparison-container');
  
  if (!modal || !container) return;

  // Clear previous content
  container.innerHTML = '';

  // Add selected images
  selectedImages.forEach(imgId => {
    const card = document.querySelector(`[data-img-id="${imgId}"]`);
    if (card) {
      const img = card.querySelector('.generated-image');
      if (img) {
        const comparisonItem = document.createElement('div');
        comparisonItem.className = 'comparison-item';
        comparisonItem.innerHTML = `
          <img src="${img.src}" alt="${img.alt}" class="comparison-image">
          <div class="comparison-info">
            <p>${img.alt}</p>
          </div>
        `;
        container.appendChild(comparisonItem);
      }
    }
  });

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/**
 * Hides the comparison modal
 */
function hideComparisonModal() {
  const modal = getElementById('comparison-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

/**
 * Clears the comparison selection
 */
function clearComparison() {
  selectedImages.clear();
  document.querySelectorAll('.comparison-selected').forEach(card => {
    card.classList.remove('comparison-selected');
  });
  updateComparisonUI();
}

/**
 * Shows a temporary message for comparison operations
 * @param {string} message - Message to show
 */
function showComparisonMessage(message) {
  // Use existing gallery status function if available
  const statusElement = getElementById('status-message');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.color = 'var(--primary)';
    
    setTimeout(() => {
      statusElement.textContent = '';
      statusElement.style.color = '';
    }, 3000);
  }
}
