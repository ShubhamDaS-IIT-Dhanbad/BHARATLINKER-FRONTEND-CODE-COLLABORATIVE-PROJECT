import conf from '../../conf/conf.js';
import { Client, Account, ID, Databases, Query } from 'appwrite';
import CryptoJS from 'crypto-js';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteShopsProjectId);

const account = new Account(client);
const databases = new Databases(client);




const uploadImageToCloudinary= async (file)=> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', conf.refurbishBooksCloudinaryPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${conf.refurbishProductCloudinaryCloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (!data.secure_url) throw new Error('Image upload failed');
        return { secure_url: data.secure_url, public_id: data.public_id };
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
}

const uploadImagesToCloudinary=async (files)=> {
    const validFiles = files.filter(file => file && typeof file === 'object');
    const uploadPromises = validFiles.map(file => uploadImageToCloudinary(file));
    return await Promise.all(uploadPromises);
}





const isValidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
};
const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl || !isValidUrl(imageUrl)) {
        console.error('Invalid URL:', imageUrl);
        return; // Skip invalid URLs
    }

    try {
        // Extract public_id from the URL
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0]; // Remove file extension
        const timestamp = Math.floor(Date.now() / 1000); // Current timestamp

        const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${conf.refurbishProductCloudinaryApiSecret}`;
        const signature = CryptoJS.SHA1(stringToSign).toString(); // Signature generation

        // Prepare form data for the API request
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('signature', signature);
        formData.append('api_key', conf.refurbishProductCloudinaryApiKey);
        formData.append('timestamp', timestamp);

        // Make the API request to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${conf.refurbishProductCloudinaryCloudName}/image/destroy`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        if (data.result !== 'ok') {
            throw new Error('Image deletion failed');
        }
        console.log('Image deleted successfully:', imageUrl);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

const cleanupUploadedImages = async (uploadedImages) => {
    if (!Array.isArray(uploadedImages)) {
        console.error('Invalid images array:', uploadedImages);
        return;
    }

    try {
        const deletionPromises = uploadedImages
            .filter(isValidUrl) // Filter valid URLs only
            .map(url => deleteImageFromCloudinary(String(url))); // Convert URL to string and delete valid images

        await Promise.all(deletionPromises);
        console.log('Successfully cleaned up uploaded images');
    } catch (error) {
        console.error('Error during cleanup:', error);
        throw error;
    }
};







const sendOtp = async (phoneNumber) => {
    try {
        const token = await account.createPhoneToken(ID.unique(), `+91${phoneNumber}`);
        return token.userId;
    } catch (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};

const createSession = async (userId, otpCode) => {
    try {
        const session = await account.createSession(userId, otpCode);
        return session;
    } catch (error) {
        throw new Error(`Failed to create session: ${error.message}`);
    }
};

const deleteSession = async (userId) => {
    try {
      await account.deleteSessions(userId);
      console.log('All sessions deleted successfully.');
    } catch (error) {
      console.error(`Failed to delete sessions: ${error.message}`);
    }
  };
  
const logout = async (sessionId) => {
    try {
        await deleteSession(sessionId);
        console.log('Logged out successfully.');
    } catch (error) {
        console.error(`Failed to log out: ${error.message}`);
    }
};

const registerShop = async (shopName, phone) => {
    try {
        const response = await databases.listDocuments(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            [Query.equal('phoneNumber', `+91${phone}`)]
        );

        if (response.total > 0) {
            throw new Error(`Shop with phone number ${phone} already exists.`);
        }
        const result = await databases.createDocument(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            'unique()',
            {
                shopName: shopName,
                phoneNumber: `+91${phone}`
            }
        );

        return result;
    } catch (error) {
        throw error;
    }
};

const getShopData = async (phoneNumber) => {
    try {
        const response = await databases.listDocuments(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            [Query.equal('phoneNumber', phoneNumber)]
        );
        if (response.total > 0) {
            return response.documents[0];
        } else {
            throw new Error('Shop not found for the given phone number.');
        }
    } catch (error) {
        console.error(`Failed to fetch shop data: ${error.message}`);
        throw error;
    }
};



const updateShopData = async (shopId, toDeleteImagesUrls, updatedData, newFiles) => {
    let uploadedImages = [];
    let allImageUrls = updatedData.images || [];
    try {
      // Step 1: Delete specified images if provided
      if (toDeleteImagesUrls.length > 0) {
        await cleanupUploadedImages([toDeleteImagesUrls]);
      }
  
      // Step 2: Separate valid URLs and new file objects
      const validUrls = newFiles.filter((url) => url !== null && typeof url === 'string');
      const filesToUpload = newFiles.filter((file) => file !== null && typeof file === 'object');
  
      // Step 3: Upload new files to Cloudinary
      if (filesToUpload.length > 0) {
        uploadedImages = await uploadImagesToCloudinary(filesToUpload);
        const newImageUrls = uploadedImages.map((image) => image.secure_url);
        allImageUrls = [...validUrls, ...allImageUrls, ...newImageUrls];
      } else {
        allImageUrls = [...validUrls, ...allImageUrls];
      }
      // Step 4: Sort the image URLs to move null or empty values to the end
      allImageUrls.sort((a, b) => {
        if (!a) return 1; // Move null or empty values to the end
        if (!b) return -1;
        return 0; // Keep the rest in the original order
      });
  
      // Step 5: Convert lat and long to double (float in JavaScript) and customerCare to number
      const updatedShopData = {
        shopImages: allImageUrls,
        shopName: updatedData?.shopName?.toLowerCase() || '',
        address: updatedData?.address?.toLowerCase() || '',
        description: updatedData?.description?.toLowerCase() || '',
        customerCare: updatedData?.customerCare ? Number(updatedData.customerCare) : null, // Convert to number
        email: updatedData?.email?.toLowerCase() || '',
        lat: updatedData?.lat ? parseFloat(updatedData.lat) : null,
        long: updatedData?.long ? parseFloat(updatedData.long) : null,
      };
  
  
      // Step 6: Update the shop document in the database
      const updatedDocument = await databases.updateDocument(
        conf.appwriteShopsDatabaseId,
        conf.appwriteShopsCollectionId,
        shopId,
        updatedShopData
      );
  
      return updatedDocument;
    } catch (error) {
      console.error('Error updating shop:', error);
  
      // Cleanup any uploaded images if an error occurs
      if (uploadedImages.length > 0) {
        await cleanupUploadedImages(uploadedImages.map((img) => img.secure_url));
      }
  
      throw error;
    }
  };
  
  


//upload module imp
const uploadProductWithImages=async(productData, files = [])=> {
    let uploadedImages = [];

    try {
        uploadedImages = await this.uploadImagesToCloudinary(files);
        const imageUrls = uploadedImages.map((image) => image.secure_url);
        const newProductData = {
            class: productData.class,
            language: productData.language.toLowerCase(),
            subject: productData.subject.toLowerCase(),
            title: productData.title.toLowerCase(),
            description: productData.description.toLowerCase(),
            price: Number(productData.price),
            discountedPrice: Number(productData.discountedPrice),
            keywords: productData.keywords.split(','),
            phn: productData.phn,
            category: productData.category.toLowerCase(),
            brand: productData.brand.toLowerCase(),
            productType: productData.productType,
            lat:productData.lat,
            long:productData.long
        };
        // Create a document in the Appwrite database with the uploaded images
        const document = await this.databases.createDocument(
            conf.appwriteRefurbishProductDatabaseId,
            conf.appwriteRefurbishedModulesCollectionId,
            ID.unique(),
            {
                ...newProductData,
                images: imageUrls
            }
        );
        return document;
    } catch (error) {
        console.error('Error uploading product:', error);
        await this.cleanupUploadedImages(uploadedImages);
        throw error;
    }
}
/*imp*/
const updateUserRefurbishedProduct=async(productId, toDeleteImagesUrls, updatedData, newFiles = [])=> {
    let uploadedImages = [];
    let allImageUrls = updatedData.images || [];
    try {
        if (toDeleteImagesUrls.length > 0) {
            await this.cleanupUploadedImages(toDeleteImagesUrls);
        }
        const validUrls = newFiles.filter(url => url !== null && typeof url === 'string');
        const filesToUpload = newFiles.filter(file => typeof file === 'object');

        if (filesToUpload.length > 0) {
            uploadedImages = await this.uploadImagesToCloudinary(filesToUpload);
            const newImageUrls = uploadedImages.map(image => image.secure_url);
            allImageUrls = [...validUrls, ...allImageUrls, ...newImageUrls];
        } else {
            allImageUrls = [...validUrls, ...allImageUrls];
        }
        const updatedProductData = {
            ...updatedData,
            language: updatedData.language.toLowerCase(),
            subject: updatedData.subject.toLowerCase(),
            title: updatedData.title.toLowerCase(),
            description: updatedData.description.toLowerCase(),
            price: Number(updatedData.price),
            discountedPrice: Number(updatedData.discountedPrice),
            category: updatedData?.category?.toLowerCase() || '',
            brand: updatedData?.brand?.toLowerCase() || '',
            keywords: updatedData.keywords.split(','),
            images: allImageUrls,
            lat:updatedData.lat,
            long:updatedData.long
        };
        const updatedDocument = await this.databases.updateDocument(
            conf.appwriteRefurbishProductDatabaseId,
            conf.appwriteRefurbishedModulesCollectionId,
            productId.id,
            updatedProductData
        );

        return updatedDocument;
    } catch (error) {
        console.error('Error updating product:', error);
        if (uploadedImages.length > 0) await this.cleanupUploadedImages(uploadedImages);
        throw error;
    }
}

/*imp*/
const deleteProduct=async(productId, imagesToDelete)=> {
    try {
        imagesToDelete = imagesToDelete.filter(url => url !== null);
        if (imagesToDelete.length > 0) {
            await this.cleanupUploadedImages(imagesToDelete);
            console.log(`Successfully deleted images: ${imagesToDelete.join(', ')}`);
        }
        const response = await this.databases.deleteDocument(
            conf.appwriteRefurbishProductDatabaseId,
            conf.appwriteRefurbishedModulesCollectionId,
            productId.id
        );
        console.log('Product deleted successfully:', response);
        return { status: "success" };
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}








const getUserRefurbishedProducts=async({
    inputValue = '',
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    isInStock,
    page,
    productsPerPage,
    sortByAsc = false,
    sortByDesc = false,
    phn
})=> {
    if (!phn) {
        return { success: false, error: 'Phone number is required to fetch products.' };
    }

    try {
        // Convert inputValue to an array of tokens
        const inputTokens = inputValue.split(' ').filter(token => token.trim() !== '').map(token => token.toLowerCase());

        const queries = [];
        queries.push(Query.equal('phn', phn));
        if (selectedCategories.length > 0) {
            queries.push(Query.or([
                Query.contains('productType', selectedCategories),
                Query.contains('keywords', selectedCategories)
            ]));
        }
        if (inputValue.length > 0) {
            queries.push(Query.or([
                Query.contains('title', inputTokens),
                Query.contains('description', inputTokens),
                Query.contains('keywords', inputTokens),
            ]));
        }

        if (sortByAsc) {
            queries.push(Query.orderAsc('price'));
        }
        if (sortByDesc) {
            queries.push(Query.orderDesc('price'));
        }

        const offset = (page - 1) * productsPerPage;
        queries.push(Query.limit(productsPerPage), Query.offset(offset));

        const fetchProducts = async (collectionId, applyPriceFilter = false) => {
            const categoryQueries = [...queries];
            if (applyPriceFilter) {
                if (minPrice !== undefined) {
                    categoryQueries.push(Query.greaterThanEqual('price', minPrice));
                }
                if (maxPrice !== undefined) {
                    categoryQueries.push(Query.lessThanEqual('price', maxPrice));
                }
            }
            if (isInStock !== undefined) {
                categoryQueries.push(Query.equal('isInStock', isInStock));
            }
            const response = await this.databases.listDocuments(
                conf.appwriteRefurbishProductDatabaseId,
                collectionId,
                categoryQueries
            );
            return response.documents || []; // Ensure an array is returned
        };

        const allProducts = await fetchProducts(conf.appwriteRefurbishedModulesCollectionId);
        if (!Array.isArray(allProducts)) {
            throw new TypeError("Expected 'allProducts' to be an array.");
        }

        // Skip scoring when inputValue is empty
        if (inputValue.length === 0) {
            return {
                success: true,
                products: allProducts
            };
        }

        // Scoring and filtering
        const scoredProducts = allProducts.map(product => {
            let score = 0;

            // Check matches in title and description
            inputTokens.forEach(token => {
                if (product.title.toLowerCase().includes(token)) score += 3; // Exact match in title
                if (product.description.toLowerCase().includes(token)) score += 2; // Exact match in description
                if (product.title.toLowerCase().startsWith(token)) score += 5; // Title starts with token
                if (product.description.toLowerCase().startsWith(token)) score += 4; // Description starts with token
            });

            return { ...product, score }; // Attach score to each product
        });

        // Filter out products with no score (if necessary)
        const filteredProducts = scoredProducts.filter(product => product.score > 0);

        // Sort by score in descending order
        filteredProducts.sort((a, b) => b.score - a.score);

        // Apply additional sorting by price if needed
        if (sortByAsc) {
            filteredProducts.sort((a, b) => a.price - b.price);
        }
        if (sortByDesc) {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        return {
            success: true,
            products: filteredProducts
        };

    } catch (error) {
        console.error('Error fetching user refurbished products:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}




export { registerShop, sendOtp, createSession, deleteSession, getShopData,  logout ,

    updateShopData
};
