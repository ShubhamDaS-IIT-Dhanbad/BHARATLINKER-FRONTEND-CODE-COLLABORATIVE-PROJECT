import conf from '../conf/conf.js';
import { Client, Databases, Storage, Query } from 'appwrite';
import { getBoundsOfDistance } from 'geolib';

/**
 * Service to search and manage shops.
 */
class SearchShopService {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteShopsProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    /**
     * Fetch shops with filters including pinCodes and pagination.
     * @param {Object} params - Parameters for fetching shops.
     * @param {string} params.inputValue - Value to search shop names.
     * @param {string[]} [params.pinCodes=[]] - Array of pin codes to filter shops.
     * @param {string[]} [params.selectedCategories] - Categories to filter shops.
     * @param {number} [params.page=1] - Current page number for pagination.
     * @param {number} [params.shopsPerPage=10] - Number of shops per page.
     * @returns {Promise<Object|boolean>} - List of shops or false on error.
     */
    async getShops({
        inputValue,
        shopsPerPage,
        selectedCategories,
        userLat,
        userLong,
        radius,
        page,
        shopId
    }) {
        try {
            const inputTokens = inputValue
                .split(' ')
                .filter(token => token.trim() !== '')
                .map(token => token.toLowerCase());
    
            const queries = [];
    
            // Input value query (only for shopName in this case)
            if (inputTokens.length > 0) {
                queries.push(Query.contains('shopName', inputTokens));
            }
    
            // Filter by selected categories
              // Filter by categories
              if (selectedCategories.length > 0) {
                queries.push(Query.contains('category', selectedCategories));
            }
    
            // Geolocation filtering using bounding box
            if (userLat !== undefined && userLong !== undefined && radius !== undefined) {
                const boundingBox = getBoundsOfDistance(
                    { latitude: userLat, longitude: userLong },
                    radius * 1000 // Convert radius from km to meters
                );
    
                const latMin = boundingBox[0].latitude;
                const latMax = boundingBox[1].latitude;
                const lonMin = boundingBox[0].longitude;
                const lonMax = boundingBox[1].longitude;
    
                queries.push(Query.greaterThanEqual('lat', latMin));
                queries.push(Query.lessThanEqual('lat', latMax));
                queries.push(Query.greaterThanEqual('long', lonMin));
                queries.push(Query.lessThanEqual('long', lonMax));
            }
    
            // Fetch products with pagination
            const fetchShops = async () => {
                const categoryQueries = [...queries];
    
                // Filter by shopId if provided
                if (shopId !== undefined) {
                    categoryQueries.push(Query.equal('shop', shopId));
                }
    
                // Pagination logic
                const offset = (page - 1) * shopsPerPage;
                categoryQueries.push(Query.limit(shopsPerPage));
                categoryQueries.push(Query.offset(offset));
    
                const response = await this.databases.listDocuments(
                    conf.appwriteShopsDatabaseId,
                    conf.appwriteShopsCollectionId,
                    categoryQueries
                );
    
                return response.documents || [];
            };
    
            const allShops = await fetchShops();
            if (!Array.isArray(allShops)) {
                throw new TypeError("Expected 'allShops' to be an array.");
            }
            // If no input value, return the shops directly
            if (inputValue.length === 0) {
                return { success: true, shops: allShops };
            }
    
            // Scoring and filtering based on tokens and location
            const scoredShops = allShops.map(shop => {
                let score = 0;
                let distance = null;
    
                // Score based on input tokens (match against shopName)
                inputTokens.forEach(token => {
                    if (shop.shopName.toLowerCase().includes(token)) score += 3;
                    if (shop.shopName.toLowerCase().startsWith(token)) score += 5;
                });
    
                // Calculate distance using Haversine formula if geolocation is provided
                if (radius && userLat && userLong) {
                    const toRadians = (deg) => (deg * Math.PI) / 180;
                    const dLat = toRadians(shop.latitude - userLat);
                    const dLon = toRadians(shop.longitude - userLong);
                    const lat1 = toRadians(userLat);
                    const lat2 = toRadians(shop.latitude);
    
                    const a = Math.sin(dLat / 2) ** 2 +
                        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const R = 6371;
                    distance = R * c;
    
                    // Filter out shops outside the radius
                    if (distance > radius) {
                        return null;
                    }
                }
    
                // Return shop with score and distance (if applicable)
                return { ...shop, score, distance };
            }).filter(shop => shop !== null);
    
            // Sort by score
            scoredShops.sort((a, b) => b.score - a.score);
    
            // Pagination logic
            const startIndex = (page - 1) * shopsPerPage;
            const paginatedShops = scoredShops.slice(startIndex, startIndex + shopsPerPage);
            return {
                success: true,
                shops: paginatedShops
            };
    
        } catch (error) {
            console.error('Appwrite service :: getShops', error);
            return { success: false, error: error.message };
        }
    }
    
    
    

    /**
     * Fetch a shop by ID.
     * @param {string} shopId - The ID of the shop.
     * @returns {Promise<Object|boolean>} - Shop data or false on error.
     */
    async getShopById(shopId) {
        try {
            const shop = await this.databases.getDocument(
                conf.appwriteShopsDatabaseId,
                conf.appwriteShopsCollectionId,
                shopId
            );
            return shop;
        } catch (error) {
            console.error('Appwrite service :: getShopById', error);
            return false;
        }
    }
}

const searchShopService = new SearchShopService();
export default searchShopService;
