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
        page
    }) {
        try {
            const inputTokens = inputValue.trim().toLowerCase().split(" ");
            const queries = [];
            queries.push(Query.select(["$id", "shopName","shopImages", "address","lat","long", "description", "isOpened", "registrationStatus", "customerCare", "email", "category"]));

            if (inputValue.length > 0) {
                queries.push(Query.search('keyword', inputValue.trim().toLowerCase()));
            }

            // Filter by categories
            if (selectedCategories.length > 0) {
                queries.push(Query.contains('category', selectedCategories));
            }

            // Geolocation filtering
            if (userLat !== undefined && userLong !== undefined && radius !== undefined) {
                const boundingBox = getBoundsOfDistance(
                    { latitude: userLat, longitude: userLong },
                    radius * 1000 // Convert radius from km to meters
                );

                queries.push(Query.between('lat', boundingBox[0].latitude, boundingBox[1].latitude));
                queries.push(Query.between('long', boundingBox[0].longitude, boundingBox[1].longitude));
            }


            const offset = (page - 1) * shopsPerPage;
            queries.push(Query.limit(shopsPerPage));
            queries.push(Query.offset(offset));

            // Fetch data from Appwrite
            const { documents: allShops = [] } = await this.databases.listDocuments(
                conf.appwriteShopsDatabaseId,
                conf.appwriteShopsCollectionId,
                queries
            );
            if (!Array.isArray(allShops)) {
                throw new TypeError("Expected 'allShops' to be an array.");
            }

            if (inputValue.length === 0) {
                return { success: true, shops: allShops };
            }

            // Scoring and filtering
            const scoredShops = allShops
                .map(shop => {
                    let score = 0;
                    let distance = null;

                    inputTokens.forEach(token => {
                        const shopName = shop.shopName.toLowerCase();
                        if (shopName.includes(token)) score += 3;
                        if (shopName.startsWith(token)) score += 5;
                    });

                    // Distance calculation
                    if (radius && userLat && userLong && shop.latitude && shop.longitude) {
                        const toRadians = deg => (deg * Math.PI) / 180;
                        const dLat = toRadians(shop.latitude - userLat);
                        const dLon = toRadians(shop.longitude - userLong);
                        const lat1 = toRadians(userLat);
                        const lat2 = toRadians(shop.latitude);

                        const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const R = 6371; // Earth radius in km
                        distance = R * c;

                        if (distance > radius) {
                            return null;
                        }
                    }

                    return { ...shop, score, distance };
                })
                .filter(shop => shop !== null)
                .sort((a, b) => b.score - a.score);

            // Pagination
            const paginatedShops = scoredShops.slice(0, shopsPerPage);

            return { success: true, shops: paginatedShops };
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
            const queries = [
                Query.equal("$id", shopId),
                Query.select(["$id", "shopName","shopImages","lat","long", "address", "description", "isOpened", "registrationStatus", "customerCare", "email", "category"])
            ];
    
            const response = await this.databases.listDocuments(
                conf.appwriteShopsDatabaseId,
                conf.appwriteShopsCollectionId,
                queries
            );
            if (response.documents.length === 0)return null;
            return response.documents[0];
        } catch (error) {
            console.error('Appwrite service :: getShopById', error);
            return false;
        }
    }
    
}

const searchShopService = new SearchShopService();
export default searchShopService;
