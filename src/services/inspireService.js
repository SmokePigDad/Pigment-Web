// Service for getting inspiration prompts

import { INSPIRE_PROMPTS, API_CONFIG } from '../config/constants.js';
import { getPollenApiKey } from './byopService.js';

/**
 * Fetches an AI-generated inspiration prompt from the API
 * Uses BYOP key if available, otherwise uses server-side API
 * @returns {Promise<string>} Generated prompt text
 * @throws {Error} If API request fails
 */
export async function fetchAIPrompt() {
  const apiKey = getPollenApiKey();

  // If user has BYOP key, call Pollinations directly from the client
  if (apiKey) {
    return fetchAIPromptWithBYOP(apiKey);
  }

  // Fall back to server-side API (uses server's API key)
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
 * Fetches an AI prompt directly using the user's BYOP API key
 * @param {string} apiKey - The user's Pollinations API key
 * @returns {Promise<string>} Generated prompt text
 */
async function fetchAIPromptWithBYOP(apiKey) {
  const instruction = "Generate a highly artistic and imaginative image prompt. Ensure the description is vivid, creative, and detailed enough to inspire unique artwork. Provide only the image prompt without any introductory or concluding comments.";
  const encodedInstruction = encodeURIComponent(instruction);

  const url = `${API_CONFIG.TEXT_API_URL}/${encodedInstruction}?model=openai-large&temperature=0.9`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Pollinations API error: ${response.status}`);
  }

  const promptText = await response.text();
  if (promptText && promptText.trim().length > 0) {
    return promptText.trim();
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
