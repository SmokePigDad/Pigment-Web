// Prompt history component functionality

import { getElementById } from '../utils/helpers.js';

const STORAGE_KEY = 'pigment_prompt_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Initializes the prompt history component
 */
export function initializePromptHistory() {
  createPromptHistoryUI();
  setupPromptHistoryHandlers();
  loadPromptHistory();
}

/**
 * Creates the prompt history UI elements
 */
function createPromptHistoryUI() {
  const promptGroup = getElementById('prompt-group');
  if (!promptGroup) return;

  // Create history button
  const historyBtn = document.createElement('button');
  historyBtn.id = 'prompt-history-btn';
  historyBtn.className = 'btn btn-inspire';
  historyBtn.innerHTML = '<i class="fas fa-history"></i>';
  historyBtn.title = 'View prompt history';
  historyBtn.type = 'button';

  // Create history dropdown
  const historyDropdown = document.createElement('div');
  historyDropdown.id = 'prompt-history-dropdown';
  historyDropdown.className = 'prompt-history-dropdown';
  historyDropdown.style.display = 'none';

  // Insert after inspire button
  const promptContainer = promptGroup.querySelector('.prompt-container');
  if (promptContainer) {
    promptContainer.appendChild(historyBtn);
    promptContainer.appendChild(historyDropdown);
  }
}

/**
 * Sets up event handlers for prompt history
 */
function setupPromptHistoryHandlers() {
  const historyBtn = getElementById('prompt-history-btn');
  const historyDropdown = getElementById('prompt-history-dropdown');
  const promptTextarea = getElementById('prompt');

  if (!historyBtn || !historyDropdown || !promptTextarea) return;

  // Toggle dropdown
  historyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = historyDropdown.style.display !== 'none';
    historyDropdown.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      updateHistoryDropdown();
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!historyDropdown.contains(e.target) && e.target !== historyBtn) {
      historyDropdown.style.display = 'none';
    }
  });

  // Save prompt when generating
  const generateBtn = getElementById('generate-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const prompt = promptTextarea.value.trim();
      if (prompt) {
        savePromptToHistory(prompt);
      }
    });
  }
}

/**
 * Loads prompt history from localStorage
 * @returns {Array} Array of prompt history items
 */
function loadPromptHistory() {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.warn('Failed to load prompt history:', error);
    return [];
  }
}

/**
 * Saves a prompt to history
 * @param {string} prompt - Prompt to save
 */
function savePromptToHistory(prompt) {
  try {
    let history = loadPromptHistory();
    
    // Remove if already exists
    history = history.filter(item => item.prompt !== prompt);
    
    // Add to beginning
    history.unshift({
      prompt,
      timestamp: Date.now(),
      id: generateHistoryId()
    });

    // Limit history size
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn('Failed to save prompt to history:', error);
  }
}

/**
 * Updates the history dropdown content
 */
function updateHistoryDropdown() {
  const dropdown = getElementById('prompt-history-dropdown');
  if (!dropdown) return;

  const history = loadPromptHistory();
  
  if (history.length === 0) {
    dropdown.innerHTML = '<div class="history-empty">No prompt history yet</div>';
    return;
  }

  let html = '<div class="history-header">Recent Prompts</div>';
  
  history.forEach(item => {
    const date = new Date(item.timestamp).toLocaleDateString();
    const truncated = item.prompt.length > 60 ? 
      item.prompt.substring(0, 60) + '...' : item.prompt;
    
    html += `
      <div class="history-item" data-prompt="${encodeURIComponent(item.prompt)}">
        <div class="history-prompt">${truncated}</div>
        <div class="history-date">${date}</div>
      </div>
    `;
  });

  html += '<div class="history-footer"><button id="clear-history-btn" class="btn-clear-history">Clear History</button></div>';
  
  dropdown.innerHTML = html;

  // Add event listeners
  dropdown.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      const prompt = decodeURIComponent(item.dataset.prompt);
      const promptTextarea = getElementById('prompt');
      if (promptTextarea) {
        promptTextarea.value = prompt;
        promptTextarea.focus();
      }
      dropdown.style.display = 'none';
    });
  });

  const clearBtn = dropdown.querySelector('#clear-history-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      updateHistoryDropdown();
    });
  }
}

/**
 * Generates a unique ID for history items
 * @returns {string} Unique ID
 */
function generateHistoryId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
