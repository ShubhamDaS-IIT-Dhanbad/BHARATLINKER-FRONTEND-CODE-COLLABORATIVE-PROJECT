import conf from '../conf/conf.js';
import { Client, Databases, Storage, Query, Permission } from 'appwrite';

class SearchRefurbishedProductService {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteRefurbishProductProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // Method to fetch refurbished products with various filters
    async getRefurbishedProducts({
        inputValue,
        pinCodes = [],
        selectedCategories,
        selectedBrands = [],
        minPrice,
        maxPrice,
        isInStock,
        page,
        productsPerPage,
        sortByAsc = false,
        sortByDesc = false
    }) {
        try {
            const queries = [];

            // Filter by pin codes
            if (pinCodes.length > 0) {
                queries.push(Query.equal('pinCodes', pinCodes));
            }
            if (inputValue) {
                queries.push(Query.or([
                    Query.search('title', inputValue),
                    Query.search('description', inputValue)
                ]));
            }
            // Filter by selected categories
            if (selectedCategories.length > 0) {
                queries.push(Query.contains('category', selectedCategories));
            }

            // Filter by selected brands
            // if (selectedBrands.length > 0) {
            //     queries.push(Query.contains('brand', selectedBrands));
            // }

            // Price range filtering
            // if (minPrice !== undefined) {
            //     queries.push(Query.greaterThanEqual('price', minPrice));
            // }
            // if (maxPrice !== undefined) {
            //     queries.push(Query.lessThanEqual('price', maxPrice));
            // }

            // In-stock filtering
            // if (isInStock !== undefined) {
            //     queries.push(Query.equal('isInStock', isInStock));
            // }

            // Sorting options
            if (sortByAsc) {
                queries.push(Query.orderAsc('price'));
            }
            if (sortByDesc) {
                queries.push(Query.orderDesc('price'));
            }

            // Pagination logic
            const offset = (page - 1) * productsPerPage;
            if (offset >= 0) {
                queries.push(Query.limit(productsPerPage));
                queries.push(Query.offset(offset));
            }

            // Fetch refurbished products with applied queries
            const products = await this.databases.listDocuments(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedBooksCollectionId,
                queries
            );
            return products;
        } catch (error) {
            console.error('Appwrite service :: getRefurbishedProducts', error);
            return false;
        }
    }

    // Method to fetch a single refurbished product by its ID
    async getRefurbishedProductById(productId) {
        try {
            const product = await this.databases.getDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedBooksCollectionId,
                productId
            );
            return product;
        } catch (error) {
            console.error('Appwrite service :: getRefurbishedProductById', error);
            return false;
        }
    }
}

const searchRefurbishedProductService = new SearchRefurbishedProductService();
export default searchRefurbishedProductService;
