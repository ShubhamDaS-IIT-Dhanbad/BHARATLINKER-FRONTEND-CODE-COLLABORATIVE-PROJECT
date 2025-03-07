import conf from '../../conf/conf.js';
import {
  uploadImagesToPublitio,
  cleanupUploadedImages,
} from './publitio.js';
import { Client, Databases, ID, Query } from 'appwrite';

class ShopProduct {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteShopsProjectId);
    this.databases = new Databases(this.client);
  }

  // Upload a new shop product
  async uploadShopProduct(productData, files = [], maxShopProduct) {
    if (!productData?.coordinates?.latitude || !productData?.coordinates?.longitude) {
      throw new Error('Coordinates (latitude and longitude) are required');
    }
    if (!productData.shopId) {
      throw new Error('Shop ID is required');
    }

    const MAX_IMAGES = 10;
    if (!Array.isArray(files)) {
      throw new Error('Files must be an array');
    }
    if (files.some(file => !(file instanceof File))) {
      throw new Error('Invalid file objects provided');
    }
    if (files.length > MAX_IMAGES) {
      throw new Error(`Maximum ${MAX_IMAGES} images allowed`);
    }

    let uploadedImages = [];

    try {
      if (typeof maxShopProduct !== 'number' || maxShopProduct < 0) {
        throw new Error('Invalid maxShopProduct limit');
      }

      const { total } = await this.databases.listDocuments(
        conf.appwriteShopsDatabaseId,
        conf.appwriteShopsProductsCollectionId,
        [Query.equal('shopId', productData.shopId), Query.limit(1)]
      );
      if (total >= maxShopProduct) {
        throw new Error('You have reached the maximum product limit for your plan');
      }

      if (files.length > 0) {
        uploadedImages = await uploadImagesToPublitio(files); // Use Publitio
      }

      const imageUrls = uploadedImages.map(image => {
        if (!image?.secure_url) throw new Error('Invalid image upload response');
        return image.secure_url;
      });

      const newProductData = {
        shopId: productData.shopId,
        shop:productData.shopId,
        images: imageUrls,
        title: String(productData.title || '').toLowerCase().trim(),
        description: String(productData.description || '').toLowerCase().trim(),
        price: Number(productData.price),
        discountedPrice: Number(productData.discountedPrice || productData.price),
        keywords: String(productData.keyword || '').toLowerCase().trim(), // Plural
        latitude: Number(productData.coordinates.latitude),
        longitude: Number(productData.coordinates.longitude),
      };

      if (isNaN(newProductData.price) || newProductData.price < 0) {
        throw new Error('Invalid price value');
      }
      if (isNaN(newProductData.discountedPrice) || newProductData.discountedPrice < 0) {
        throw new Error('Invalid discounted price value');
      }
      if (newProductData.discountedPrice >= newProductData.price) {
        throw new Error('Discounted price must be less than original price');
      }

      const document = await this.databases.createDocument(
        conf.appwriteShopsDatabaseId,
        conf.appwriteShopsProductsCollectionId,
        ID.unique(),
        newProductData
      );

      return document;
    } catch (error) {
      console.error('Error uploading product:', {
        message: error.message,
        stack: error.stack,
        productData: { ...productData, coordinates: undefined },
        fileCount: files.length,
      });

      if (uploadedImages.length > 0) {
        await cleanupUploadedImages(uploadedImages.map(img => img.secure_url)).catch(cleanupError => {
          console.error('Failed to cleanup images:', cleanupError);
        });
      }

      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  }





  // Update an existing shop product
  async updateShopProduct(productId, toDeleteImagesUrls = [], updatedData = {}, newFiles = []) {
    let uploadedImages = [];
    let allImageUrls = Array.isArray(updatedData.images) ? [...updatedData.images] : [];

    try {
      if (!productId) throw new Error('Product ID is required');

      if (!Array.isArray(toDeleteImagesUrls)) {
        throw new Error('toDeleteImagesUrls must be an array');
      }
      if (!Array.isArray(newFiles)) {
        throw new Error('newFiles must be an array');
      }
      if (toDeleteImagesUrls.length > 0) {
        await cleanupUploadedImages(toDeleteImagesUrls);
        allImageUrls = allImageUrls.filter(url => url && !toDeleteImagesUrls.includes(url));
      }

      const validUrls = newFiles.filter(url => typeof url === 'string' && url?.trim());
      const filesToUpload = newFiles.filter(file => file && file instanceof File);

      if (filesToUpload.length > 0) {
        uploadedImages = await uploadImagesToPublitio(filesToUpload); // Use Publitio
        const newImageUrls = uploadedImages.map(image => image?.secure_url).filter(Boolean);
        allImageUrls = [...allImageUrls, ...validUrls, ...newImageUrls];
      } else if (validUrls.length > 0) {
        allImageUrls = [...allImageUrls, ...validUrls];
      }

      const finalData = {
        ...updatedData,
        images: allImageUrls.filter(Boolean),
      };

      // Normalize string fields
      for (const [key, value] of Object.entries(finalData)) {
        if (typeof value === 'string') finalData[key] = value.toLowerCase().trim();
      }

      const product = await this.databases.updateDocument(
        conf.appwriteShopsDatabaseId,
        conf.appwriteShopsProductsCollectionId,
        productId,
        finalData
      );

      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      if (uploadedImages.length > 0) {
        await cleanupUploadedImages(uploadedImages.map(img => img?.secure_url)).catch(cleanupError => {
          console.error('Error during cleanup:', cleanupError);
        });
      }
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  // Delete a shop product
  async deleteShopProduct(productId, imagesToDelete = []) {
    try {
      if (!productId) throw new Error('Product ID is required');
      if (!Array.isArray(imagesToDelete)) throw new Error('imagesToDelete must be an array');

      if (imagesToDelete.length > 0) {
        await cleanupUploadedImages(imagesToDelete);
        console.log(`Successfully deleted images: ${imagesToDelete.join(', ')}`);
      }

      await this.databases.deleteDocument(
        conf.appwriteShopsDatabaseId,
        conf.appwriteShopsProductsCollectionId,
        productId
      );

      return { status: 'success' };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Fetch shop products with filters
  async getShopProducts({
    inputValue = '',
    minPrice,
    maxPrice,
    isInStock,
    page = 1,
    productsPerPage = 10,
    sortByAsc = false,
    sortByDesc = false,
    shopId,
  }) {
    if (!shopId) {
      return { success: false, error: 'Shop ID is required to fetch products.' };
    }
    if (!Number.isInteger(page) || page < 1) {
      return { success: false, error: 'Invalid page number' };
    }
    if (!Number.isInteger(productsPerPage) || productsPerPage < 1) {
      return { success: false, error: 'Invalid products per page' };
    }

    try {
      const queries = [Query.equal('shopId', shopId)];

      if (inputValue.length > 0) {
        queries.push(Query.search('keywords', inputValue)); // Use search for keywords
      }
      if (minPrice !== undefined && !isNaN(minPrice)) {
        queries.push(Query.greaterThanEqual('price', Number(minPrice)));
      }
      if (maxPrice !== undefined && !isNaN(maxPrice)) {
        queries.push(Query.lessThanEqual('price', Number(maxPrice)));
      }
      if (typeof isInStock === 'boolean') {
        queries.push(Query.equal('isInStock', isInStock));
      }
      if (sortByAsc) queries.push(Query.orderAsc('price'));
      if (sortByDesc) queries.push(Query.orderDesc('price'));

      const offset = (page - 1) * productsPerPage;
      queries.push(Query.limit(productsPerPage), Query.offset(offset));
      queries.push(
        Query.select([
          '$id',
          'shopId',
          'title',
          'description',
          'price',
          'discountedPrice',
          'isInStock',
          'images',
          'keywords',
          'isActive',
        ])
      );

      const response = await this.databases.listDocuments(
        conf.appwriteShopsDatabaseId,
        conf.appwriteShopsProductsCollectionId,
        queries
      );

      return {
        success: true,
        products: response.documents,
        total: response.total,
      };
    } catch (error) {
      console.error('Error fetching shop products:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
}

const shopProduct = new ShopProduct();
export default shopProduct;