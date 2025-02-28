import PublitioAPI from 'publitio_js_sdk';

const conf = {
  publitioApiKey: '7S1b6Z4RzdovuPf5Wt7H',
  publitioApiSecret: 'Px2fabSNjQWS1Sv68gSdM1Zq9rDqVTbb',
  presetId: 'ASPBDlGr',
};

// Initialize Publitio API
const publitio = new PublitioAPI(conf.publitioApiKey, conf.publitioApiSecret);

// ✅ Upload Image using Preset
const uploadImageToPublitio = async (file) => {
  try {
    const response = await publitio.uploadFile(file, 'file');
    if (!response.success || !response.url_preview) {
      throw new Error(`Image upload failed: ${response.error || 'Unknown error'}`);
    }

    const urlParts = response.url_preview.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    return { secure_url: `https://bharatlinker.publit.io/file/${response.id}@X@XX@X@${publicIdWithExtension }`, public_id: response.public_id };
  } catch (error) {
    console.error('❌ Error uploading image to Publitio:', error);
    throw error;
  }
};

// ✅ Delete Image
const deleteImageFromPublitio = async (id) => {
  try {
    // Extract public ID from URL
    const urlParts = id.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    // Fixed: Corrected split syntax and added extraction of first element
    const publicId = publicIdWithExtension.split('@X@XX@X@')[0];

    // Use the extracted publicId in the API call
    const response = await publitio.call(`/files/delete/${publicId}`, 'DELETE');
    
    if (!response.success) {
      throw new Error(`Failed to delete image: ${response.error || 'Unknown error'}`);
    }
    
    console.log('✅ Image deleted successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error deleting image from Publitio:', error);
    throw error;
  }
};

// ✅ Upload Multiple Images
const uploadImagesToPublitio = async (files) => {
  return await Promise.all(files.map(file => uploadImageToPublitio(file)));
};

// ✅ Cleanup Uploaded Images
const cleanupUploadedImages = async (uploadedImages) => {
  try {
    await Promise.all(uploadedImages.map(url => deleteImageFromPublitio(url)));
    console.log('✅ Successfully cleaned up uploaded images');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
};

export {
  uploadImageToPublitio,
  uploadImagesToPublitio,
  deleteImageFromPublitio,
  cleanupUploadedImages,
};
