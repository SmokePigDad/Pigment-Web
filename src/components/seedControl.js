// Seed control component functionality

import { getElementById } from '../utils/helpers.js';

/**
 * Initializes the seed control component
 */
export function initializeSeedControl() {
  createSeedControlUI();
  setupSeedControlHandlers();
}

/**
 * Creates the seed control UI elements
 */
function createSeedControlUI() {
  const advancedOptions = getElementById('advanced-options');
  if (!advancedOptions) return;

  // Create seed control section
  const seedSection = document.createElement('div');
  seedSection.className = 'form-group seed-control-section';
  seedSection.innerHTML = `
    <label for="seed-input"><i class="fas fa-random"></i> Seed Control</label>
    <div class="seed-control-container">
      <div class="seed-input-group">
        <input type="number" id="seed-input" class="input-control seed-input" 
               placeholder="Random seed (leave empty for random)" 
               min="0" max="2147483647">
        <button id="random-seed-btn" class="btn btn-inspire seed-btn" 
                title="Generate random seed" type="button">
          <i class="fas fa-dice"></i>
        </button>
        <button id="copy-seed-btn" class="btn btn-inspire seed-btn" 
                title="Copy current seed" type="button">
          <i class="fas fa-copy"></i>
        </button>
      </div>
      <div class="seed-info">
        <small>Use the same seed with identical settings to reproduce images</small>
      </div>
    </div>
  `;

  // Insert before the advanced options checkboxes
  const flexContainer = advancedOptions.querySelector('.flex-gap-15-wrap-mt10');
  if (flexContainer) {
    advancedOptions.insertBefore(seedSection, flexContainer);
  }
}

/**
 * Sets up event handlers for seed control
 */
function setupSeedControlHandlers() {
  const randomSeedBtn = getElementById('random-seed-btn');
  const copySeedBtn = getElementById('copy-seed-btn');
  const seedInput = getElementById('seed-input');

  if (randomSeedBtn) {
    randomSeedBtn.addEventListener('click', () => {
      const randomSeed = Math.floor(Math.random() * 2147483647);
      if (seedInput) {
        seedInput.value = randomSeed;
      }
    });
  }

  if (copySeedBtn) {
    copySeedBtn.addEventListener('click', async () => {
      if (seedInput && seedInput.value) {
        try {
          await navigator.clipboard.writeText(seedInput.value);
          showSeedMessage('Seed copied to clipboard!');
        } catch (error) {
          console.warn('Failed to copy seed:', error);
          showSeedMessage('Failed to copy seed', true);
        }
      } else {
        showSeedMessage('No seed to copy', true);
      }
    });
  }

  // Auto-save last used seed
  if (seedInput) {
    seedInput.addEventListener('change', () => {
      if (seedInput.value) {
        localStorage.setItem('pigment_last_seed', seedInput.value);
      }
    });

    // Load last used seed
    const lastSeed = localStorage.getItem('pigment_last_seed');
    if (lastSeed) {
      seedInput.value = lastSeed;
    }
  }
}

/**
 * Gets the current seed value
 * @returns {number|null} Current seed or null if not set
 */
export function getCurrentSeed() {
  const seedInput = getElementById('seed-input');
  if (seedInput && seedInput.value) {
    const seed = parseInt(seedInput.value);
    return isNaN(seed) ? null : seed;
  }
  return null;
}

/**
 * Sets the seed value
 * @param {number} seed - Seed value to set
 */
export function setSeed(seed) {
  const seedInput = getElementById('seed-input');
  if (seedInput) {
    seedInput.value = seed;
  }
}

/**
 * Shows a temporary message for seed operations
 * @param {string} message - Message to show
 * @param {boolean} isError - Whether this is an error message
 */
function showSeedMessage(message, isError = false) {
  const seedInfo = document.querySelector('.seed-info small');
  if (seedInfo) {
    const originalText = seedInfo.textContent;
    seedInfo.textContent = message;
    seedInfo.style.color = isError ? 'var(--error)' : 'var(--success)';
    
    setTimeout(() => {
      seedInfo.textContent = originalText;
      seedInfo.style.color = '';
    }, 2000);
  }
}
