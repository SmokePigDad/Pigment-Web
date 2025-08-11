// Settings panel component functionality

import { getElementById } from '../utils/helpers.js';

const SETTINGS_KEY = 'pigment_user_settings';

const defaultSettings = {
  autoSaveImages: true,
  showImageInfo: true,
  gridSize: 'medium',
  theme: 'dark',
  autoDownloadFavorites: false,
  showGenerationTime: true,
  enableKeyboardShortcuts: true
};

/**
 * Initializes the settings panel component
 */
export function initializeSettingsPanel() {
  createSettingsUI();
  setupSettingsHandlers();
  loadSettings();
}

/**
 * Creates the settings UI elements
 */
function createSettingsUI() {
  const galleryControls = document.querySelector('.gallery-controls');
  if (!galleryControls) return;

  // Create settings button
  const settingsBtn = document.createElement('button');
  settingsBtn.id = 'settings-btn';
  settingsBtn.className = 'btn';
  settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
  settingsBtn.title = 'Open settings';
  settingsBtn.setAttribute('aria-label', 'Open application settings');

  galleryControls.appendChild(settingsBtn);

  // Create settings modal
  createSettingsModal();
}

/**
 * Creates the settings modal
 */
function createSettingsModal() {
  const modal = document.createElement('div');
  modal.id = 'settings-modal';
  modal.className = 'settings-modal';
  modal.innerHTML = `
    <div class="settings-modal-content">
      <div class="settings-header">
        <h3><i class="fas fa-cog"></i> Settings</h3>
        <button id="close-settings" class="btn-close">&times;</button>
      </div>
      <div class="settings-container">
        <div class="settings-section">
          <h4>Gallery</h4>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="setting-auto-save" class="setting-checkbox">
              Auto-save generated images to browser storage
            </label>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="setting-show-info" class="setting-checkbox">
              Show image information on hover
            </label>
          </div>
          <div class="setting-item">
            <label for="setting-grid-size">Gallery grid size:</label>
            <select id="setting-grid-size" class="setting-select">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
        
        <div class="settings-section">
          <h4>Generation</h4>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="setting-show-time" class="setting-checkbox">
              Show generation time
            </label>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="setting-auto-download-fav" class="setting-checkbox">
              Auto-download favorites when marked
            </label>
          </div>
        </div>
        
        <div class="settings-section">
          <h4>Interface</h4>
          <div class="setting-item">
            <label for="setting-theme">Theme:</label>
            <select id="setting-theme" class="setting-select">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="setting-keyboard-shortcuts" class="setting-checkbox">
              Enable keyboard shortcuts
            </label>
          </div>
        </div>
      </div>
      <div class="settings-footer">
        <button id="reset-settings" class="btn btn-clear">Reset to Defaults</button>
        <button id="save-settings" class="btn">Save Settings</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

/**
 * Sets up event handlers for settings
 */
function setupSettingsHandlers() {
  const settingsBtn = getElementById('settings-btn');
  const modal = getElementById('settings-modal');
  const closeBtn = getElementById('close-settings');
  const saveBtn = getElementById('save-settings');
  const resetBtn = getElementById('reset-settings');

  if (settingsBtn) {
    settingsBtn.addEventListener('click', showSettingsModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', hideSettingsModal);
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', saveSettings);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetSettings);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideSettingsModal();
      }
    });
  }

  // Auto-save on change
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('setting-checkbox') || e.target.classList.contains('setting-select')) {
      saveSettings();
    }
  });
}

/**
 * Shows the settings modal
 */
function showSettingsModal() {
  const modal = getElementById('settings-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Hides the settings modal
 */
function hideSettingsModal() {
  const modal = getElementById('settings-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

/**
 * Loads settings from localStorage
 */
function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    const settings = saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    
    // Apply settings to UI
    Object.keys(settings).forEach(key => {
      const element = getElementById(`setting-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = settings[key];
        } else {
          element.value = settings[key];
        }
      }
    });

    // Apply settings to application
    applySettings(settings);
    
  } catch (error) {
    console.warn('Failed to load settings:', error);
    applySettings(defaultSettings);
  }
}

/**
 * Saves current settings
 */
function saveSettings() {
  try {
    const settings = {};
    
    // Collect settings from UI
    Object.keys(defaultSettings).forEach(key => {
      const element = getElementById(`setting-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
      if (element) {
        if (element.type === 'checkbox') {
          settings[key] = element.checked;
        } else {
          settings[key] = element.value;
        }
      }
    });

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applySettings(settings);
    
    showSettingsMessage('Settings saved successfully!');
    
  } catch (error) {
    console.warn('Failed to save settings:', error);
    showSettingsMessage('Failed to save settings', true);
  }
}

/**
 * Resets settings to defaults
 */
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    localStorage.removeItem(SETTINGS_KEY);
    loadSettings();
    showSettingsMessage('Settings reset to defaults');
  }
}

/**
 * Applies settings to the application
 * @param {Object} settings - Settings object
 */
function applySettings(settings) {
  // Apply grid size
  const gallery = getElementById('gallery');
  if (gallery) {
    gallery.className = gallery.className.replace(/grid-size-\w+/g, '');
    gallery.classList.add(`grid-size-${settings.gridSize}`);
  }

  // Apply theme
  document.documentElement.setAttribute('data-theme', settings.theme);

  // Store settings globally for other components to use
  window.pigmentSettings = settings;
}

/**
 * Gets current settings
 * @returns {Object} Current settings
 */
export function getSettings() {
  return window.pigmentSettings || defaultSettings;
}

/**
 * Shows a temporary message for settings operations
 * @param {string} message - Message to show
 * @param {boolean} isError - Whether this is an error message
 */
function showSettingsMessage(message, isError = false) {
  const footer = document.querySelector('.settings-footer');
  if (footer) {
    let messageEl = footer.querySelector('.settings-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.className = 'settings-message';
      footer.insertBefore(messageEl, footer.firstChild);
    }
    
    messageEl.textContent = message;
    messageEl.style.color = isError ? 'var(--error)' : 'var(--success)';
    
    setTimeout(() => {
      messageEl.textContent = '';
    }, 3000);
  }
}
