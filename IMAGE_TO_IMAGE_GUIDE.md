# Image-to-Image Transformation Guide

## Overview

The new Image-to-Image transformation feature allows users to upload an existing image and transform it using AI with the Kontext model. This feature is implemented as a new tab in the Pigment application.

## Features

### 1. Tab System
- **Text to Image**: Original functionality for generating images from text prompts
- **Image to Image**: New functionality for transforming existing images

### 2. Image Upload Component
- **Supported Formats**: JPG, PNG, WebP
- **File Size Limit**: 10MB maximum
- **Upload Methods**: 
  - Click to browse files
  - Drag and drop
- **Validation**: Automatic file type and size validation
- **Preview**: Shows uploaded image preview with file information

### 3. Transformation Features
- **Prompt Input**: Text area for describing the desired transformation
- **Example Prompts**: Quick-select buttons with common transformation styles
- **Real-time Processing**: Shows progress during transformation
- **Result Comparison**: Side-by-side view of original and transformed images
- **Download**: One-click download of transformed images

## Usage Instructions

### Basic Workflow
1. **Switch to Image-to-Image Tab**: Click the "Image to Image" tab at the top
2. **Upload Image**: Click the upload area or drag & drop an image file
3. **Enter Prompt**: Describe how you want to transform the image
4. **Transform**: Click the "Transform Image" button
5. **Download**: Use the download button to save the result

### Example Prompts
- "make it look like a watercolor painting"
- "add cyberpunk neon lighting effects"
- "convert to black and white pencil sketch"
- "make it look like an oil painting"
- "add fantasy elements and magical lighting"
- "transform into a cartoon style"

## Technical Implementation

### Components Created
- **`src/components/tabSystem.js`**: Tab navigation and switching logic
- **`src/components/imageUpload.js`**: File upload, validation, and preview
- **`src/components/imageToImage.js`**: Main transformation logic and UI
- **`src/services/kontextService.js`**: Kontext API integration

### API Integration
- **Endpoint**: `https://image.pollinations.ai/prompt/{encoded_prompt}?model=kontext&image={image_url}`
- **Method**: GET request
- **Response**: Image blob
- **Image URL**: Supports both public URLs and data URLs

### File Structure
```
src/
├── components/
│   ├── tabSystem.js          # Tab navigation system
│   ├── imageUpload.js        # Image upload and validation
│   └── imageToImage.js       # Transformation logic
└── services/
    └── kontextService.js     # Kontext API service
```

## Error Handling

### Upload Errors
- Invalid file format
- File size too large
- File read errors

### Transformation Errors
- Missing image or prompt
- API rate limiting
- Network errors
- Invalid API responses

## Limitations

### Current Implementation
- **Image Hosting**: Uses temporary hosting services for data URLs
- **File Size**: 10MB limit for uploaded images
- **Rate Limiting**: Subject to Pollinations.AI rate limits
- **CORS**: May have limitations with certain image URLs

### Production Considerations
- Consider implementing your own image hosting backend
- Add user authentication for higher rate limits
- Implement image optimization and compression
- Add more sophisticated error recovery

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Required Features**: 
  - File API
  - Fetch API
  - Blob URLs
  - ES6 Modules

## Testing

### Test Files Included
- **`api-test.html`**: Direct API testing with public URLs
- **`full-test.html`**: Complete component testing
- **`minimal-test.html`**: Basic tab system testing

### Manual Testing Steps
1. Open the application in a modern browser
2. Switch to the "Image to Image" tab
3. Upload a test image (JPG, PNG, or WebP)
4. Enter a transformation prompt
5. Click "Transform Image"
6. Verify the result appears
7. Test the download functionality

## Troubleshooting

### Common Issues
1. **Tab not switching**: Check browser console for JavaScript errors
2. **Upload not working**: Verify file format and size
3. **Transformation fails**: Check network connection and API availability
4. **No result displayed**: Check browser console for API errors

### Debug Mode
Enable browser developer tools console to see detailed logging during development.
