import conf from '../../conf/conf.js';
import { Client, Account, ID, Databases, Query } from 'appwrite';
import CryptoJS from 'crypto-js';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteProductsProjectId);

const account = new Account(client);
const databases = new Databases(client);








const uploadImageToCloudinary = async (file) => {
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

const uploadImagesToCloudinary = async (files) => {
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



//upload module imp
const uploadProductWithImages = async (productData, files = []) => {
    if (!productData || !files || !Array.isArray(files)) {
        throw new Error('Invalid arguments: productData and files are required.');
    }
    const shopId=productData.shop;
    const countTotalProduct=await getRetailerTotalProducts({shopId});
    if(countTotalProduct.totalProducts>productData.total){
        console.log("maximum product exceed");
        throw new Error('maximum product exceed');
    }

    let uploadedImages = [];
    try {
        // Validate required fields
        const requiredFields = ['title', 'description', 'price', 'discountedPrice', 'lat', 'long', 'shop'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Upload images to Cloudinary
        uploadedImages = await uploadImagesToCloudinary(files);
        const imageUrls = uploadedImages.map((image) => image.secure_url);
console.log("P")
        // Prepare product data
        const newProductData = {
            title: productData.title.toLowerCase(),
            description: productData.description.toLowerCase(),
            price: parseFloat(productData.price),
            discountedPrice: parseFloat(productData.discountedPrice),
            lat: parseFloat(productData.lat),
            long: parseFloat(productData.long),
            shop: productData.shop,
            isInStock: productData.isInStock ?? true,
            images: imageUrls,
        };
        const document = await databases.createDocument(
            conf.appwriteProductsDatabaseId,
            conf.appwriteProductsCollectionId,
            ID.unique(),
            newProductData
        );

        return document;
    } catch (error) {
        console.error('Error uploading product:', error.message);
        if (uploadedImages.length > 0) {
            console.log('Cleaning up uploaded images...');
            await cleanupUploadedImages(uploadedImages);
        }

        throw error;
    }
};





const getRetailerTotalProducts = async ({ shopId }) => {
    if (!shopId) {
        return { success: false, error: 'Shop ID is required to fetch product count.' };
    }

    try {
        const response = await databases.listDocuments(
            conf.appwriteProductsDatabaseId,
            conf.appwriteProductsCollectionId,
            [Query.equal('shop', shopId)],
            0
        );
        return { success: true, totalProducts: response.total };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
const getRetailerProducts = async ({
    shopId,
    inputValue = '',
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    isInStock,
    page,
    productsPerPage,
    sortByAsc = false,
    sortByDesc = false
    
}) => {
    if (!shopId) {
        return { success: false, error: 'Phone number is required to fetch products.' };
    }
   
    try {
        const inputTokens = inputValue.split(' ').filter(token => token.trim() !== '').map(token => token.toLowerCase());

        const queries = [];
        queries.push(Query.equal('shop', shopId));
        if (selectedCategories.length > 0) {
            queries.push(Query.or([
                Query.contains('productType', selectedCategories),
                Query.contains('keywords', selectedCategories)
            ]));
        }
        if (inputValue.length > 0) {
            queries.push(Query.or([
                Query.contains('title', inputTokens),
                Query.contains('description', inputTokens)
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
            const response = await databases.listDocuments(
                conf.appwriteProductsDatabaseId,
                collectionId,
                categoryQueries
            );
            return response || [];
        };

         const res= await fetchProducts(conf.appwriteProductsCollectionId);
         const allProducts=res.documents;
        if (!Array.isArray(allProducts)) {
            throw new TypeError("Expected 'allProducts' to be an array.");
        }

        // Skip scoring when inputValue is empty
        if (inputValue.length === 0) {
            return {
                total:res.total,
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
            total:res.total,
            success: true,
            products: filteredProducts
        };

    } catch (error) {
        console.error('Error fetching user refurbished products:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}




/*imp*/
const updateProduct = async (productId, toDeleteImagesUrls, updatedData, newFiles = []) => {
    let uploadedImages = [];
    let allImageUrls = updatedData.images || [];
    try {
        if (toDeleteImagesUrls.length > 0) {
            await cleanupUploadedImages(toDeleteImagesUrls);
        }
        const validUrls = newFiles.filter(url => url !== null && typeof url === 'string');
        const filesToUpload = newFiles.filter(file => typeof file === 'object');

        if (filesToUpload.length > 0) {
            uploadedImages = await uploadImagesToCloudinary(filesToUpload);
            const newImageUrls = uploadedImages.map(image => image.secure_url);
            allImageUrls = [...validUrls, ...allImageUrls, ...newImageUrls];
        } else {
            allImageUrls = [...validUrls, ...allImageUrls];
        }
        const updatedProductData = {
            ...updatedData,
            title: updatedData.title.toLowerCase(),
            description: updatedData.description.toLowerCase(),
            price: Number(updatedData.price),
            discountedPrice: Number(updatedData.discountedPrice),
            keywords: updatedData.keywords,
            images: allImageUrls,
            isInStock:updatedData.isInStock,
            lat:updatedData.lat,
            long:updatedData.long
        };
        const updatedDocument = await databases.updateDocument(
            conf.appwriteProductsDatabaseId,
            conf.appwriteProductsCollectionId,
            productId,
            updatedProductData
        );

        return updatedDocument;
    } catch (error) {
        console.error('Error updating product:', error);
        if (uploadedImages.length > 0) await cleanupUploadedImages(uploadedImages);
        throw error;
    }
}






/*imp*/
const deleteProduct = async (productId, imagesToDelete) => {
    try {
        imagesToDelete = imagesToDelete.filter(url => url !== null);
        if (imagesToDelete.length > 0) {
            await cleanupUploadedImages(imagesToDelete);
            console.log(`Successfully deleted images: ${imagesToDelete.join(', ')}`);
        }
        const response = await databases.deleteDocument(
            conf.appwriteProductsDatabaseId,
            conf.appwriteProductsCollectionId,
            productId
        );
        console.log('Product deleted successfully:', response);
        return { status: "success" };
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}





export {uploadProductWithImages,getRetailerProducts,
    updateProduct,deleteProduct
};
