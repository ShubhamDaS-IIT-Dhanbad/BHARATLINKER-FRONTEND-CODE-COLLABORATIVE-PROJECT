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
        inputValue = '',
        pinCodes = [],
        selectedCategories,
        page = 1,
        shopsPerPage = 10,
    }) {
        try {
            const queries = [];

            // Add filters based on input
            if (pinCodes.length > 0) {
                queries.push(Query.contains('pinCodes', pinCodes));  // Use Query.equal with an array of pinCodes
            }
            if (inputValue) {
                queries.push(Query.search('shopName', inputValue));
            }
            if (selectedCategories.length>0) {
                queries.push(Query.contains('category', selectedCategories));
            }

            // Pagination logic
            const offset = (page - 1) * shopsPerPage;
            if (offset >= 0) {
                queries.push(Query.limit(shopsPerPage));
                queries.push(Query.offset(offset));
            }

            // Fetch shops with applied queries
            const shops = await this.databases.listDocuments(
                conf.appwriteShopsDatabaseId,
                conf.appwriteShopsCollectionId,
                queries
            );

            return shops;
        } catch (error) {
            console.error('Appwrite service :: getShops', error);
            return false;
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
