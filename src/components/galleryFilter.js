// Gallery filter component functionality

import { getElementById } from '../utils/helpers.js';

/**
 * Initializes the gallery filter component
 */
export function initializeGalleryFilter() {
  createFilterUI();
  setupFilterHandlers();
}

/**
 * Creates the filter UI elements
 */
function createFilterUI() {
  const gallerySection = document.querySelector('.gallery-section');
  if (!gallerySection) return;

  const galleryHeader = gallerySection.querySelector('.gallery-header');
  if (!galleryHeader) return;

  // Create filter container
  const filterContainer = document.createElement('div');
  filterContainer.className = 'gallery-filter-container';
  filterContainer.innerHTML = `
    <div class="filter-row">
      <div class="filter-group">
        <label for="filter-search"><i class="fas fa-search"></i></label>
        <input type="text" id="filter-search" class="filter-input" 
               placeholder="Search prompts...">
      </div>
      <div class="filter-group">
        <label for="filter-style"><i class="fas fa-brush"></i></label>
        <select id="filter-style" class="filter-select">
          <option value="">All Styles</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="filter-size"><i class="fas fa-expand-arrows-alt"></i></label>
        <select id="filter-size" class="filter-select">
          <option value="">All Sizes</option>
        </select>
      </div>
      <div class="filter-group">
        <button id="filter-favorites" class="filter-btn" title="Show only favorites">
          <i class="fas fa-heart"></i>
        </button>
        <button id="filter-reset" class="filter-btn" title="Reset filters">
          <i class="fas fa-undo"></i>
        </button>
      </div>
    </div>
  `;

  // Insert after gallery header
  galleryHeader.insertAdjacentElement('afterend', filterContainer);
}

/**
 * Sets up event handlers for filtering
 */
function setupFilterHandlers() {
  const searchInput = getElementById('filter-search');
  const styleSelect = getElementById('filter-style');
  const sizeSelect = getElementById('filter-size');
  const favoritesBtn = getElementById('filter-favorites');
  const resetBtn = getElementById('filter-reset');

  if (searchInput) {
    searchInput.addEventListener('input', debounce(applyFilters, 300));
  }

  if (styleSelect) {
    styleSelect.addEventListener('change', applyFilters);
    populateStyleFilter();
  }

  if (sizeSelect) {
    sizeSelect.addEventListener('change', applyFilters);
    populateSizeFilter();
  }

  if (favoritesBtn) {
    favoritesBtn.addEventListener('click', toggleFavoritesFilter);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
  }

  // Listen for new images being added
  const gallery = getElementById('gallery');
  if (gallery) {
    const observer = new MutationObserver(() => {
      updateFilterOptions();
    });
    observer.observe(gallery, { childList: true });
  }
}

/**
 * Populates the style filter dropdown
 */
function populateStyleFilter() {
  const styleSelect = getElementById('filter-style');
  if (!styleSelect) return;

  const styles = new Set();
  document.querySelectorAll('.image-card').forEach(card => {
    const img = card.querySelector('.generated-image');
    if (img && img.alt) {
      // Extract style from alt text if available
      const altText = img.alt;
      // This is a simplified extraction - you might want to store style data differently
      styles.add('Various'); // Placeholder
    }
  });

  // Clear existing options except "All Styles"
  const allOption = styleSelect.querySelector('option[value=""]');
  styleSelect.innerHTML = '';
  styleSelect.appendChild(allOption);

  // Add detected styles
  styles.forEach(style => {
    const option = document.createElement('option');
    option.value = style;
    option.textContent = style;
    styleSelect.appendChild(option);
  });
}

/**
 * Populates the size filter dropdown
 */
function populateSizeFilter() {
  const sizeSelect = getElementById('filter-size');
  if (!sizeSelect) return;

  const sizes = new Set();
  document.querySelectorAll('.image-container').forEach(container => {
    const aspectRatio = container.dataset.aspectRatio;
    if (aspectRatio) {
      sizes.add(aspectRatio);
    }
  });

  // Clear existing options except "All Sizes"
  const allOption = sizeSelect.querySelector('option[value=""]');
  sizeSelect.innerHTML = '';
  sizeSelect.appendChild(allOption);

  // Add detected sizes
  sizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = `${size} Aspect Ratio`;
    sizeSelect.appendChild(option);
  });
}

/**
 * Updates filter options when new images are added
 */
function updateFilterOptions() {
  populateStyleFilter();
  populateSizeFilter();
}

/**
 * Applies all active filters
 */
function applyFilters() {
  const searchTerm = getElementById('filter-search')?.value.toLowerCase() || '';
  const selectedStyle = getElementById('filter-style')?.value || '';
  const selectedSize = getElementById('filter-size')?.value || '';
  const favoritesOnly = getElementById('filter-favorites')?.classList.contains('active') || false;

  const imageCards = document.querySelectorAll('.image-card');
  let visibleCount = 0;

  imageCards.forEach(card => {
    let visible = true;

    // Search filter
    if (searchTerm) {
      const img = card.querySelector('.generated-image');
      const altText = img?.alt.toLowerCase() || '';
      if (!altText.includes(searchTerm)) {
        visible = false;
      }
    }

    // Style filter
    if (selectedStyle && visible) {
      // Implement style filtering logic based on your data structure
      // This is a placeholder
    }

    // Size filter
    if (selectedSize && visible) {
      const container = card.querySelector('.image-container');
      const aspectRatio = container?.dataset.aspectRatio;
      if (aspectRatio !== selectedSize) {
        visible = false;
      }
    }

    // Favorites filter
    if (favoritesOnly && visible) {
      if (!card.classList.contains('favorite')) {
        visible = false;
      }
    }

    // Apply visibility
    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });

  // Update status
  updateFilterStatus(visibleCount, imageCards.length);
}

/**
 * Toggles the favorites filter
 */
function toggleFavoritesFilter() {
  const favoritesBtn = getElementById('filter-favorites');
  if (!favoritesBtn) return;

  favoritesBtn.classList.toggle('active');
  applyFilters();
}

/**
 * Resets all filters
 */
function resetFilters() {
  const searchInput = getElementById('filter-search');
  const styleSelect = getElementById('filter-style');
  const sizeSelect = getElementById('filter-size');
  const favoritesBtn = getElementById('filter-favorites');

  if (searchInput) searchInput.value = '';
  if (styleSelect) styleSelect.value = '';
  if (sizeSelect) sizeSelect.value = '';
  if (favoritesBtn) favoritesBtn.classList.remove('active');

  // Show all images
  document.querySelectorAll('.image-card').forEach(card => {
    card.style.display = '';
  });

  updateFilterStatus(document.querySelectorAll('.image-card').length, document.querySelectorAll('.image-card').length);
}

/**
 * Updates the filter status display
 * @param {number} visible - Number of visible images
 * @param {number} total - Total number of images
 */
function updateFilterStatus(visible, total) {
  let statusElement = document.querySelector('.filter-status');
  
  if (!statusElement) {
    statusElement = document.createElement('div');
    statusElement.className = 'filter-status';
    const filterContainer = document.querySelector('.gallery-filter-container');
    if (filterContainer) {
      filterContainer.appendChild(statusElement);
    }
  }

  if (visible === total) {
    statusElement.textContent = `Showing all ${total} images`;
  } else {
    statusElement.textContent = `Showing ${visible} of ${total} images`;
  }
}

/**
 * Debounce function to limit rapid function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
