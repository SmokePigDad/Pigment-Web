// General utility helper functions

/**
 * Creates a delay for the specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>} Promise that resolves after the delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a unique ID for elements
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export function generateUniqueId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/**
 * Safely revokes object URLs
 * @param {string[]} urls - Array of URLs to revoke
 */
export function revokeObjectURLs(urls) {
  if (!urls || !Array.isArray(urls)) return;
  
  for (const url of urls) {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.warn('Failed to revoke URL:', url, error);
    }
  }
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
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

/**
 * Throttles a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Safely gets an element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null if not found
 */
export function getElementById(id) {
  return document.getElementById(id);
}

/**
 * Safely queries for an element
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (defaults to document)
 * @returns {Element|null} Element or null if not found
 */
export function querySelector(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Safely queries for multiple elements
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (defaults to document)
 * @returns {NodeList} NodeList of elements
 */
export function querySelectorAll(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Formats a number with proper pluralization
 * @param {number} count - The count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, defaults to singular + 's')
 * @returns {string} Formatted string
 */
export function pluralize(count, singular, plural = null) {
  if (plural === null) {
    plural = singular + 's';
  }
  return `${count} ${count === 1 ? singular : plural}`;
}
