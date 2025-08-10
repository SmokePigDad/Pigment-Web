// Service for getting inspiration prompts

import { INSPIRE_PROMPTS } from '../config/constants.js';

/**
 * Fetches an AI-generated inspiration prompt from the API
 * @returns {Promise<string>} Generated prompt text
 * @throws {Error} If API request fails
 */
export async function fetchAIPrompt() {
  const response = await fetch('/api/inspire');
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Request failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  if (data.prompt && data.prompt.trim().length > 0) {
    return data.prompt.trim();
  }
  
  throw new Error('API returned an empty prompt');
}

/**
 * Gets a random inspiration prompt from the local collection
 * @param {string} [excludePrompt] - Prompt to exclude from selection
 * @returns {string} Random inspiration prompt
 */
export function getRandomLocalPrompt(excludePrompt = null) {
  if (INSPIRE_PROMPTS.length === 0) {
    return "A beautiful landscape at sunset";
  }
  
  if (INSPIRE_PROMPTS.length === 1) {
    return INSPIRE_PROMPTS[0];
  }
  
  let availablePrompts = INSPIRE_PROMPTS;
  if (excludePrompt) {
    availablePrompts = INSPIRE_PROMPTS.filter(prompt => prompt !== excludePrompt);
  }
  
  const randomIndex = Math.floor(Math.random() * availablePrompts.length);
  return availablePrompts[randomIndex];
}

/**
 * Gets an inspiration prompt, trying AI first, falling back to local prompts
 * @param {string} [currentPrompt] - Current prompt to avoid duplicating
 * @returns {Promise<string>} Inspiration prompt
 */
export async function getInspirationPrompt(currentPrompt = null) {
  try {
    const aiPrompt = await fetchAIPrompt();
    
    // If AI prompt is the same as current, try to get a different local one
    if (aiPrompt === currentPrompt && INSPIRE_PROMPTS.length > 1) {
      return getRandomLocalPrompt(currentPrompt);
    }
    
    return aiPrompt;
  } catch (error) {
    console.error("Error fetching AI inspiration prompt:", error);
    return getRandomLocalPrompt(currentPrompt);
  }
}
