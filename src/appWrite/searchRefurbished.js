import conf from '../conf/conf.js';
import { Client, Databases, Query } from 'appwrite';

class SearchRefurbishedProductService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteRefurbishProductProjectId);

        this.databases = new Databases(this.client);
    }

    // Method to fetch refurbished products from the Modules collection with various filters
    async getRefurbishedProducts({
        inputValue,
        pinCodes = [],
        selectedCategories = [],
        minPrice,
        maxPrice,
        isInStock,
        page = 1,
        productsPerPage = 8,
        sortByAsc = false,
        sortByDesc = false,
    }) {
        try {
             // Convert input to tokens (array of strings)
             const inputTokens = inputValue.split(' ').filter(token => token.trim() !== '').map(token => token.toLowerCase());

            const queries = [];

            // Filter by pin codes
            if (pinCodes.length > 0) {
                queries.push(Query.equal('pinCodes', pinCodes));
            }

            // Search by inputValue in title or description (will implement scoring later)
            if (inputValue) {
                queries.push(
                    Query.or([
                        Query.contains('title', inputTokens),
                        Query.contains('description', inputTokens),
                    ])
                );
            }

            // Filter by selected categories
            if (selectedCategories.length > 0) {
                queries.push(
                    Query.or([
                        Query.contains('productType', selectedCategories),
                        Query.contains('keywords', selectedCategories),
                    ])
                );
            }

            // Add price and stock filters
            if (minPrice !== undefined) {
                queries.push(Query.greaterThanEqual('price', minPrice));
            }
            if (maxPrice !== undefined) {
                queries.push(Query.lessThanEqual('price', maxPrice));
            }
            if (isInStock !== undefined) {
                queries.push(Query.equal('isInStock', isInStock));
            }

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

            // Fetch products from the Modules collection
            const productsModule = await this.databases.listDocuments(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedModulesCollectionId,
                queries
            );

            const allProducts = productsModule.documents;

            // If no input value, return the products directly
            if (inputValue.length === 0) {
                return {
                    products: allProducts,
                    total: productsModule.total,
                };
            }

           
            // Rank products based on matches in title and description
            const scoredProducts = allProducts.map(product => {
                let score = 0;

                // Rank based on matches in title and description
                inputTokens.forEach(token => {
                    if (product.title.toLowerCase().includes(token)) score += 3;  // Exact match in title
                    if (product.description.toLowerCase().includes(token)) score += 2;  // Exact match in description
                    if (product.title.toLowerCase().startsWith(token)) score += 5;  // Token starts with title
                    if (product.description.toLowerCase().startsWith(token)) score += 4;  // Token starts with description
                });

                return { ...product, score }; // Attach score to each product
            });

            // Filter out products with no score
            const filteredProducts = scoredProducts.filter(product => product.score > 0);

            // Sort products by score (descending order)
            filteredProducts.sort((a, b) => b.score - a.score);

            // Apply additional sorting by price if needed
            if (sortByAsc) {
                filteredProducts.sort((a, b) => a.price - b.price);
            }
            if (sortByDesc) {
                filteredProducts.sort((a, b) => b.price - a.price);
            }

            return {
                products: filteredProducts,
                total: productsModule.total,
            };
        } catch (error) {
            console.error('Appwrite service :: getRefurbishedProducts', error);
            return false;
        }
    }

    // Method to fetch a single refurbished product by its ID from the Modules collection
    async getRefurbishedProductById(productId) {
        try {
            const product = await this.databases.getDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedModulesCollectionId,
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
