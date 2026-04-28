// Bring Your Own Pollen (BYOP) Service
// Handles Pollinations authentication using the redirect flow for web apps

import { API_CONFIG } from '../config/constants.js';

// Storage keys
const STORAGE_KEY_API_KEY = 'pollinations_api_key';
const STORAGE_KEY_USER_INFO = 'pollinations_user_info';

/**
 * Gets the stored Pollen API key
 * @returns {string|null} The API key or null if not authenticated
 */
export function getPollenApiKey() {
  return localStorage.getItem(STORAGE_KEY_API_KEY);
}

/**
 * Checks if the user is authenticated with Pollinations
 * @returns {boolean} True if authenticated
 */
export function isAuthenticated() {
  return !!getPollenApiKey();
}

/**
 * Gets stored user information
 * @returns {Object|null} User info object or null
 */
export function getUserInfo() {
  const stored = localStorage.getItem(STORAGE_KEY_USER_INFO);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Stores the API key and user info from successful authentication
 * @param {string} apiKey - The Pollen API key
 * @param {Object} [userInfo] - Optional user information
 */
export function storeCredentials(apiKey, userInfo = null) {
  localStorage.setItem(STORAGE_KEY_API_KEY, apiKey);
  if (userInfo) {
    localStorage.setItem(STORAGE_KEY_USER_INFO, JSON.stringify(userInfo));
  }
}

/**
 * Clears stored credentials (logout)
 */
export function clearCredentials() {
  localStorage.removeItem(STORAGE_KEY_API_KEY);
  localStorage.removeItem(STORAGE_KEY_USER_INFO);
}

/**
 * Initiates the BYOP authentication redirect flow
 * The user will be redirected to Pollinations to authorize the app,
 * then redirected back with the API key in the URL fragment
 * @param {Object} options - Authorization options
 * @param {string} [options.models] - Comma-separated list of allowed models
 * @param {number} [options.budget] - Pollen budget limit
 * @param {string} [options.expiry] - Expiry date for the key
 */
export function initiateAuthentication(options = {}) {
  const currentUrl = window.location.href.split('#')[0].split('?')[0];
  const redirectUri = encodeURIComponent(currentUrl);
  
  let authUrl = `${API_CONFIG.BYOP_AUTH_URL}?redirect_uri=${redirectUri}`;
  
  // Add optional parameters
  if (options.models) {
    authUrl += `&models=${encodeURIComponent(options.models)}`;
  }
  if (options.budget) {
    authUrl += `&budget=${options.budget}`;
  }
  if (options.expiry) {
    authUrl += `&expiry=${encodeURIComponent(options.expiry)}`;
  }
  
  // Redirect to Pollinations authorization page
  window.location.href = authUrl;
}

/**
 * Handles the callback from Pollinations authorization
 * Extracts the API key from the URL fragment
 * @returns {boolean} True if credentials were extracted successfully
 */
export function handleAuthCallback() {
  const hash = window.location.hash;

  if (!hash || hash.length < 2) {
    return false;
  }

  // Parse the URL fragment for api_key
  const params = new URLSearchParams(hash.substring(1));
  const apiKey = params.get('api_key');

  if (apiKey) {
    // Store the credentials
    storeCredentials(apiKey, {
      connectedAt: new Date().toISOString()
    });

    // Clean up the URL by removing the hash
    const cleanUrl = window.location.href.split('#')[0];
    window.history.replaceState({}, document.title, cleanUrl);
    
    return true;
  }
  
  return false;
}

/**
 * Disconnects from Pollinations (logs out)
 */
export function disconnect() {
  clearCredentials();
}
