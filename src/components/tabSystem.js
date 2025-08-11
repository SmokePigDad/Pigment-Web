// Tab system component functionality

import { getElementById } from '../utils/helpers.js';

// Tab state
let activeTab = 'text-to-image';

/**
 * Initializes the tab system
 */
export function initializeTabSystem() {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    createTabNavigation();
    setupTabHandlers();
    showTab(activeTab);
  }, 100);
}

/**
 * Creates the tab navigation UI
 */
function createTabNavigation() {
  const container = document.querySelector('.container');
  if (!container) return;

  // Find the header and insert tab navigation after it
  const header = container.querySelector('header');
  if (!header) return;

  const tabNav = document.createElement('div');
  tabNav.className = 'tab-navigation';
  tabNav.innerHTML = `
    <div class="tab-buttons">
      <button id="tab-text-to-image" class="tab-button active" data-tab="text-to-image">
        <i class="fas fa-magic"></i>
        Text to Image
      </button>
      <button id="tab-image-to-image" class="tab-button" data-tab="image-to-image">
        <i class="fas fa-exchange-alt"></i>
        Image to Image
      </button>
    </div>
  `;

  header.insertAdjacentElement('afterend', tabNav);
}

/**
 * Sets up tab button event handlers
 */
function setupTabHandlers() {
  // Use setTimeout to ensure tab buttons are created
  setTimeout(() => {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        showTab(tabId);
      });
    });
  }, 50);
}

/**
 * Shows the specified tab and hides others
 * @param {string} tabId - ID of the tab to show
 */
export function showTab(tabId) {
  activeTab = tabId;
  
  // Update tab button states
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    if (button.dataset.tab === tabId) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // Show/hide tab content
  const textToImageContent = getElementById('text-to-image-content');
  const imageToImageContent = getElementById('image-to-image-content');

  if (tabId === 'text-to-image') {
    if (textToImageContent) {
      textToImageContent.style.display = 'grid';
      textToImageContent.classList.add('active');
    }
    if (imageToImageContent) {
      imageToImageContent.style.display = 'none';
      imageToImageContent.classList.remove('active');
    }
  } else if (tabId === 'image-to-image') {
    if (textToImageContent) {
      textToImageContent.style.display = 'none';
      textToImageContent.classList.remove('active');
    }
    if (imageToImageContent) {
      imageToImageContent.style.display = 'grid';
      imageToImageContent.classList.add('active');
    }
  }
}

/**
 * Gets the currently active tab
 * @returns {string} Active tab ID
 */
export function getActiveTab() {
  return activeTab;
}
