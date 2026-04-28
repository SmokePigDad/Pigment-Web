// BYOP (Bring Your Own Pollen) Authentication UI Component

import { 
  isAuthenticated, 
  getUserInfo, 
  initiateAuthentication, 
  handleAuthCallback, 
  disconnect 
} from '../services/byopService.js';
import { getElementById } from '../utils/helpers.js';

/**
 * Initializes the BYOP authentication component
 */
export function initializeBYOPAuth() {
  // First, check if we're handling a callback from Pollinations
  const wasCallback = handleAuthCallback();
  
  if (wasCallback) {
    console.log('Successfully authenticated with Pollinations BYOP');
  }
  
  // Create and inject the BYOP UI
  createBYOPUI();
  
  // Update UI based on current auth state
  updateAuthUI();
}

/**
 * Creates the BYOP authentication UI elements
 */
function createBYOPUI() {
  const header = document.querySelector('header');
  if (!header) {
    console.warn('Header not found for BYOP UI injection');
    return;
  }
  
  // Create the BYOP container
  const byopContainer = document.createElement('div');
  byopContainer.id = 'byop-container';
  byopContainer.className = 'byop-container';
  byopContainer.innerHTML = `
    <div class="byop-status" id="byop-status">
      <span class="byop-indicator" id="byop-indicator"></span>
      <span class="byop-text" id="byop-text"></span>
    </div>
    <button id="byop-connect-btn" class="btn btn-byop" title="Connect your Pollinations account">
      <i class="fas fa-link"></i> <span id="byop-btn-text">Connect Pollen</span>
    </button>
  `;
  
  // Insert after the subtitle
  const subtitle = header.querySelector('.subtitle');
  if (subtitle) {
    subtitle.after(byopContainer);
  } else {
    header.appendChild(byopContainer);
  }
  
  // Set up event handlers
  const connectBtn = getElementById('byop-connect-btn');
  if (connectBtn) {
    connectBtn.addEventListener('click', handleByopButtonClick);
  }
}

/**
 * Handles the connect/disconnect button click
 */
function handleByopButtonClick() {
  if (isAuthenticated()) {
    // Show confirmation before disconnecting
    if (confirm('Disconnect from Pollinations? You will need to reconnect to use your Pollen balance.')) {
      disconnect();
      updateAuthUI();
    }
  } else {
    // Initiate authentication
    initiateAuthentication();
  }
}

/**
 * Updates the authentication UI based on current state
 */
export function updateAuthUI() {
  const indicator = getElementById('byop-indicator');
  const text = getElementById('byop-text');
  const btnText = getElementById('byop-btn-text');
  const connectBtn = getElementById('byop-connect-btn');
  
  if (!indicator || !text || !btnText || !connectBtn) {
    return;
  }
  
  if (isAuthenticated()) {
    const userInfo = getUserInfo();
    const connectedDate = userInfo?.connectedAt 
      ? new Date(userInfo.connectedAt).toLocaleDateString() 
      : 'Unknown';
    
    indicator.className = 'byop-indicator connected';
    indicator.title = 'Connected to Pollinations';
    text.textContent = 'Using your Pollen';
    text.title = `Connected since ${connectedDate}`;
    btnText.textContent = 'Disconnect';
    connectBtn.classList.add('connected');
    connectBtn.querySelector('i').className = 'fas fa-unlink';
  } else {
    indicator.className = 'byop-indicator disconnected';
    indicator.title = 'Not connected';
    text.textContent = 'Free tier (limited)';
    text.title = 'Connect your Pollinations account for full access';
    btnText.textContent = 'Connect Pollen';
    connectBtn.classList.remove('connected');
    connectBtn.querySelector('i').className = 'fas fa-link';
  }
}
