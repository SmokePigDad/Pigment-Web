# Pigment - AI Image Generator

A modular web application for generating AI images using Pollinations.AI, built with vanilla JavaScript and deployed on Vercel.

## 🏗️ Architecture

This application has been refactored into a modular architecture for better maintainability, scalability, and code organization.

### Directory Structure

```
├── api/                    # Vercel API routes
│   └── inspire            # AI prompt inspiration endpoint
├── src/                   # Source code (modular)
│   ├── components/        # UI components
│   │   ├── artStyleSelector.js
│   │   ├── batchToggle.js
│   │   ├── countSelector.js
│   │   ├── gallery.js
│   │   ├── galleryFilter.js
│   │   ├── imageComparison.js
│   │   ├── imageGenerator.js
│   │   ├── inspireButton.js
│   │   ├── keyboardShortcuts.js
│   │   ├── modelSelector.js
│   │   ├── promptHistory.js
│   │   ├── seedControl.js
│   │   ├── settingsPanel.js
│   │   └── sizeSelector.js
│   ├── config/           # Configuration and constants
│   │   ├── artStyles.js
│   │   └── constants.js
│   ├── services/         # External service integrations
│   │   ├── inspireService.js
│   │   └── pollinationsService.js
│   ├── styles/           # Modular CSS
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── gallery.css
│   │   ├── layout.css
│   │   ├── main.css
│   │   └── variables.css
│   ├── utils/            # Utility functions
│   │   ├── downloadUtils.js
│   │   ├── helpers.js
│   │   ├── promptBuilder.js
│   │   └── stateManager.js
│   └── main.js           # Application entry point
├── index.html            # Main HTML file
├── vercel.json          # Vercel deployment configuration
└── README.md            # This file
```

## 🧩 Modular Components

### Components (`src/components/`)
- **artStyleSelector.js**: Manages art style dropdown and selection
- **batchToggle.js**: Handles batch mode toggle functionality
- **countSelector.js**: Manages image count dropdown and selection
- **gallery.js**: Image gallery display and management
- **galleryFilter.js**: Advanced filtering and search functionality
- **imageComparison.js**: Side-by-side image comparison tool
- **imageGenerator.js**: Core image generation logic
- **inspireButton.js**: AI prompt inspiration functionality
- **keyboardShortcuts.js**: Keyboard shortcuts and help system
- **modelSelector.js**: AI model selection and configuration
- **promptHistory.js**: Prompt history and templates management
- **seedControl.js**: Seed control for reproducible generation
- **settingsPanel.js**: User preferences and settings management
- **sizeSelector.js**: Manages image size dropdown and selection

### Services (`src/services/`)
- **pollinationsService.js**: Pollinations.AI API integration
- **inspireService.js**: AI prompt inspiration service

### Configuration (`src/config/`)
- **constants.js**: Application constants and configuration
- **artStyles.js**: Art style definitions and descriptions

### Utilities (`src/utils/`)
- **stateManager.js**: Application state management
- **downloadUtils.js**: Image download and ZIP creation
- **promptBuilder.js**: Prompt construction utilities
- **helpers.js**: General utility functions

### Styles (`src/styles/`)
- **variables.css**: CSS custom properties and design tokens
- **base.css**: Base styles and reset
- **layout.css**: Layout and grid styles
- **components.css**: Component-specific styles
- **gallery.css**: Gallery and image card styles
- **main.css**: Main stylesheet that imports all modules

## 🚀 Features

### Core Generation
- **20+ AI Models**: Extensive model selection organized by provider:
  - *Flux Family*: flux, zimage, kontext, klein
  - *OpenAI*: gptimage, gptimage-large, gpt-image-2 (with transparency)
  - *Google/Gemini*: nanobanana, nanobanana-2, nanobanana-pro
  - *Alibaba/Wan*: wan-image, wan-image-pro (4K), qwen-image
  - *Specialized*: seedream5, grok-imagine, nova-canvas, p-image
- **100+ Art Styles**: Extensive collection of artistic styles and techniques
- **24+ Image Sizes**: From mobile formats to 4K UHD resolutions
- **Batch Generation**: Generate images in all available art styles simultaneously
- **Seed Control**: Reproducible generation with custom or random seeds
- **Advanced Options**: Remove watermark, private generation, enhance prompt, transparency

### BYOP (Bring Your Own Pollen)
- **User Authentication**: Connect your Pollinations account for unlimited access
- **Zero Cost for Developers**: Users pay from their own Pollen balance
- **Easy Integration**: One-click connect/disconnect via redirect flow

### Enhanced Gallery
- **Image Gallery**: View, favorite, and download generated images with proper aspect ratios
- **Image Comparison**: Side-by-side comparison tool for up to 4 images
- **Advanced Filtering**: Search by prompt, filter by style/size, favorites-only view
- **Bulk Operations**: Download all images or favorites with one click
- **Image Viewing**: Open images in new tabs for larger viewing

### User Experience
- **Prompt History**: Automatic saving and recall of previous prompts
- **Keyboard Shortcuts**: Full keyboard navigation and shortcuts (Ctrl+? for help)
- **Settings Panel**: Customizable user preferences and interface options
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Free Tier Available**: Works without authentication, or connect your Pollinations account for full access

## 🛠️ Development

### Prerequisites
- Node.js (for local development)
- Vercel CLI (for deployment)

### Local Development
1. Clone the repository
2. Install dependencies: `npm install` (if using package.json)
3. Start local server: `vercel dev` or use any static file server
4. Open `http://localhost:3000`

### Environment Variables
Set the following environment variable in Vercel:
- `POLLINATIONS_API_KEY`: Your Pollinations.AI API key

### Deployment
This application is designed for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables
3. Deploy automatically on push to main branch

## 🔧 Configuration

### Adding New Art Styles
Edit `src/config/artStyles.js` to add new art styles:

```javascript
export const artStyles = {
  "New Style": "detailed description of the art style...",
  // ... existing styles
};
```

### Modifying UI Components
Each component is self-contained in `src/components/`. Components export initialization functions and utility functions for external use.

### Customizing Styles
Modify CSS variables in `src/styles/variables.css` to change the design system:

```css
:root {
  --primary: #8a2be2;
  --secondary: #ffaf40;
  /* ... other variables */
}
```

## 📱 Browser Support

- Modern browsers with ES6 module support
- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 16+

## 🔒 Security

- API keys are stored securely in Vercel environment variables
- CORS headers are configured for API endpoints
- Input validation and sanitization

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the modular architecture
4. Test thoroughly
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues
- **Module not found**: Ensure all import paths are correct and use `.js` extensions
- **API errors**: Check that `POLLINATIONS_API_KEY` is set in Vercel environment variables
- **Styling issues**: Verify CSS imports in `src/styles/main.css`

### Performance
- Images are lazy-loaded and cached
- CSS and JS files are cached with long expiration headers
- API requests include rate limiting and retry logic

## Local development server (minimal)
A tiny static file server for Pigment-Web, implemented with Node's http and fs modules.

How to run
- npm install (if you don't have node_modules yet)
- npm run start
- Open http://localhost:3000 in your browser

Usage notes
- Serves files relative to the repository root (e:\Tinker\Pigment-Web). If a directory is requested, serves index.html in that directory, or falls back to the root index.html if present.
- Determines MIME types for common extensions (html, css, js, json, png, jpg, svg, ico, txt, csv, xml, wav, mp3, webp, woff, woff2).
- If a requested file does not exist, responds with a 404 and a message.
- SPA/history API fallback: if a path is not found, will try to serve root index.html if present.

Stopping the server
- Press Ctrl+C in the terminal to stop the server.

References
- server.js: [`server.js`](server.js:0)
- package.json: [`package.json`](package.json:0)
- README.md: [`README.md`](README.md:0)
