// Model selector component functionality

import { DEFAULT_MODELS } from '../config/constants.js';
import { setAvailableModels, setActiveModel } from '../utils/stateManager.js';
import { getElementById } from '../utils/helpers.js';

/**
 * Initializes the model selector dropdown
 */
export function initializeModelSelector() {
  const dropdown = getElementById('model');
  const modelInfo = getElementById('model-info');
  
  if (!dropdown) {
    console.warn('Model dropdown not found');
    return;
  }

  populateModelDropdown(dropdown, modelInfo);
  setupModelChangeHandler(dropdown, modelInfo);
}

/**
 * Populates the model dropdown with available models
 * @param {HTMLSelectElement} dropdown - Model dropdown element
 * @param {HTMLElement} modelInfo - Model info display element
 */
function populateModelDropdown(dropdown, modelInfo) {
  const models = DEFAULT_MODELS;
  
  try {
    let optionsHTML = "";
    const defaultModel = models.find(m => m.is_default) || models[0];
    
    for (const model of models) {
      const isSelected = model === defaultModel ? ' selected' : '';
      optionsHTML += `<option value="${model.name}"${isSelected}>${model.name}</option>`;
    }
    
    dropdown.innerHTML = optionsHTML;
    
    // Update global state
    setAvailableModels(models);
    
    // Update model info display
    if (modelInfo && defaultModel) {
      updateModelInfo(modelInfo, defaultModel.name, defaultModel.description);
    }
    
    // Update advanced features based on default model
    updateAdvancedFeatureGating();
    
  } catch (error) {
    console.error('Error populating model dropdown:', error);
    dropdown.innerHTML = '<option value="flux">flux</option>';
  }
}

/**
 * Sets up the model change event handler
 * @param {HTMLSelectElement} dropdown - Model dropdown element
 * @param {HTMLElement} modelInfo - Model info display element
 */
function setupModelChangeHandler(dropdown, modelInfo) {
  dropdown.addEventListener('change', function() {
    const selectedModel = dropdown.value;
    setActiveModel(selectedModel);
    updateAdvancedFeatureGating();
    
    if (modelInfo) {
      const models = DEFAULT_MODELS;
      const model = models.find(m => m.name === selectedModel);
      const description = model?.description || '';
      updateModelInfo(modelInfo, selectedModel, description);
    }
  });
}

/**
 * Updates the model information display
 * @param {HTMLElement} modelInfo - Model info element
 * @param {string} modelName - Name of the selected model
 * @param {string} description - Model description
 */
function updateModelInfo(modelInfo, modelName, description) {
  if (description) {
    modelInfo.innerHTML = `<p><strong>${modelName}</strong><br>${description}</p>`;
  } else {
    modelInfo.innerHTML = `<p>Select a model to see its description</p>`;
  }
}

/**
 * Updates advanced feature availability based on selected model
 */
export function updateAdvancedFeatureGating() {
  const transparentCheckbox = getElementById('transparent');
  const transparentLabel = getElementById('transparent-label');
  const modelSelect = getElementById('model');

  if (!transparentCheckbox || !transparentLabel || !modelSelect) {
    return;
  }

  const isGptImageSelected = modelSelect.value === "gptimage";
  transparentLabel.style.display = isGptImageSelected ? "flex" : "none";
  
  if (!isGptImageSelected) {
    transparentCheckbox.checked = false;
  }
}
