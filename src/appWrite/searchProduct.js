import conf from '../conf/conf.js';
import { Client, Databases, Storage, Query } from 'appwrite';

class SearchProductService {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProductsProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // Method to fetch products with filters including price range (minPrice, maxPrice)
    async getProducts({
        inputValue,
        pinCodes = [],
        selectedCategories,
        selectedBrands,
        minPrice,
        maxPrice,
        isInStock,
        page = 1,
        productsPerPage = 10,
        sortByAsc,
        sortByDesc
    }) {
        try {
            const queries = [];

            // Add filters based on input
            if (pinCodes.length > 0) {
                queries.push(Query.equal('pinCodes', pinCodes));
            }
            if (inputValue) {
                queries.push(Query.or([
                    Query.search('title', inputValue),
                    Query.search('description', inputValue)
                ]));
            }

            // Check if any category in the selectedCategories array exists in the category field
            if (selectedCategories && selectedCategories.length > 0) {
                queries.push(Query.contains('category', selectedCategories));
            }

            // Check if any brand in the selectedBrands array exists in the brand field
            if (selectedBrands && selectedBrands.length > 0) {
                queries.push(Query.contains('brand', selectedBrands));
            }

            // Price range filtering
            if (minPrice !== undefined) {
                queries.push(Query.greaterThanEqual('price', minPrice));
            }
            if (maxPrice !== undefined) {
                queries.push(Query.lessThanEqual('price', maxPrice));
            }

            // In-stock filtering
            if (isInStock !== undefined) {
                queries.push(Query.equal('isInStock', isInStock));
            }

            // Sorting
            if (sortByAsc) {
                queries.push(Query.orderAsc('price')); // Sorting by price in ascending order
            }
            if (sortByDesc) {
                queries.push(Query.orderDesc('price')); // Sorting by price in descending order
            }

            // Pagination logic (ensure offset is greater than or equal to 0)
            const offset = (page - 1) * productsPerPage;
            if (offset >= 0) {
                queries.push(Query.limit(productsPerPage));
                queries.push(Query.offset(offset));
            }

            // Fetch products with applied queries
            const products = await this.databases.listDocuments(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                queries
            );
            return products;
        } catch (error) {
            console.error('Appwrite service :: getProducts', error);
            return false;
        }
    }

    // Method to fetch a product by ID
    async getProductById(productId) {
        try {
            const product = await this.databases.getDocument(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                productId
            );
            return product;
        } catch (error) {
            console.log('Appwrite service :: getProductById', error);
            return false;
        }
    }
}

const searchProductService = new SearchProductService();
export default searchProductService;
