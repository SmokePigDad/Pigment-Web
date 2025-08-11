// Image hosting service for Vercel-compatible deployment

/**
 * Uploads an image file to a reliable hosting service
 * @param {File|Blob} imageFile - Image file to upload
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadImageToHost(imageFile) {
  console.log('Uploading image:', imageFile.size, 'bytes');
  
  // Convert File to Blob if needed
  const blob = imageFile instanceof File ? imageFile : imageFile;
  
  // Try multiple reliable hosting services
  const services = [
    {
      name: 'catbox',
      upload: async () => {
        const formData = new FormData();
        formData.append('fileToUpload', blob, 'image.png');
        formData.append('reqtype', 'fileupload');
        
        const response = await fetch('https://catbox.moe/user/api.php', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const url = await response.text();
          if (url && url.trim().startsWith('https://')) {
            return url.trim();
          }
        }
        throw new Error('Invalid response from catbox');
      }
    },
    {
      name: 'imgbb',
      upload: async () => {
        const formData = new FormData();
        formData.append('image', blob);
        
        // Using a demo key - in production you'd want your own key
        const response = await fetch('https://api.imgbb.com/1/upload?key=d0c5d7e8c2b4a8e6f1a3b5c7d9e1f3a5', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.url) {
            return result.data.url;
          }
        }
        throw new Error('Invalid response from imgbb');
      }
    },
    {
      name: 'postimages',
      upload: async () => {
        const formData = new FormData();
        formData.append('upload', blob, 'image.png');
        formData.append('token', 'demo');
        
        const response = await fetch('https://postimages.org/json/rr', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.status === 'OK' && result.url) {
            return result.url;
          }
        }
        throw new Error('Invalid response from postimages');
      }
    }
  ];
  
  let lastError = null;
  
  // Try each service
  for (const service of services) {
    try {
      console.log(`Attempting upload to ${service.name}...`);
      const url = await service.upload();
      console.log(`Successfully uploaded to ${service.name}:`, url);
      return url;
    } catch (error) {
      console.warn(`${service.name} failed:`, error.message);
      lastError = error;
    }
  }
  
  // If all services fail, throw the last error
  throw new Error(`All image hosting services failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Converts a data URL to a blob
 * @param {string} dataUrl - Data URL to convert
 * @returns {Promise<Blob>} Blob representation of the image
 */
export async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return await response.blob();
}

/**
 * Validates if an image file is suitable for upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateImageFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB limit for better upload success
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPG, PNG, or WebP)'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 5MB for reliable upload'
    };
  }
  
  return { isValid: true };
}

/**
 * Compresses an image file if it's too large
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width for compression
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<Blob>} Compressed image blob
 */
export async function compressImage(file, maxWidth = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      // Set canvas size
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
