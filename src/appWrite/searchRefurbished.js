import conf from '../conf/conf.js';
import { Client, Databases, Query } from 'appwrite';
import { getBoundsOfDistance } from 'geolib';

class SearchRefurbishedProductService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteBlUsersProjectId);

        this.databases = new Databases(this.client);
    }
    async getRefurbishedProducts({
        inputValue = '',
        userLat,
        userLong,
        radius,
        page,
        productsPerPage,
        sortByAsc = false,
        sortByDesc = false,
    }) {
        try {
            const inputTokens = inputValue.trim().toLowerCase(); // Single string
    
            const queries = [];
            // Add search query if inputValue is provided
            if (inputValue.length > 0) {
                queries.push(Query.search("keyword", inputTokens));
            }
    
            // Add sorting queries
            if (sortByAsc) queries.push(Query.orderAsc("discountedPrice"));
            if (sortByDesc) queries.push(Query.orderDesc("discountedPrice"));
    
            // Add geolocation queries if the location and radius are provided
            if (userLat !== undefined && userLong !== undefined && radius !== undefined) {
                const center = { latitude: userLat, longitude: userLong };
                const bounds = getBoundsOfDistance(center, radius * 1000);
    
                queries.push(
                    Query.greaterThanEqual("latitude", bounds[0].latitude),
                    Query.lessThanEqual("latitude", bounds[1].latitude),
                    Query.greaterThanEqual("longitude", bounds[0].longitude),
                    Query.lessThanEqual("longitude", bounds[1].longitude)
                );
            }
    
            // Add pagination queries
            const offset = (page - 1) * productsPerPage;
            queries.push(Query.limit(productsPerPage), Query.offset(offset));
    
            // Specify fields to fetch using Query.select
            queries.push(Query.select(["$id","title","phoneNumber", "description", "price", "discountedPrice","image"
            ]));
    
            // Fetch products from the database
            const { documents: allProducts = [] } = await this.databases.listDocuments(
                conf.appwriteBlUsersDatabaseId,
                conf.appwriteBlProductsCollectionId,
                queries
            );
    
            if (!Array.isArray(allProducts)) throw new TypeError("Expected 'allProducts' to be an array.");
            if (inputValue.length === 0) return { success: true, products: allProducts };
    
            // Process and score products based on input search terms
            const scoredProducts = allProducts
                .map(product => {
                    const titleLower = product.title.toLowerCase();
                    const descLower = product.description.toLowerCase();
    
                    let score = 0;
    
                    if (titleLower.includes(inputTokens)) score += 3;
                    if (descLower.includes(inputTokens)) score += 2;
                    if (titleLower.startsWith(inputTokens)) score += 5;
                    if (descLower.startsWith(inputTokens)) score += 4;
    
                    return { ...product, score };
                }).filter((product) => product !== null);
    
            scoredProducts.sort((a, b) => b.score - a.score);
    
            return {
                success: true,
                products: scoredProducts
            };
        } catch (error) {
            console.error("Appwrite service :: getProducts", error);
            return { success: false, error: error.message };
        }
    }
    // Method to fetch a product by ID
    async getRefurbishedProductById(productId) {
        try {
            const queries = [];
            queries.push(Query.equal("$id",productId));
            queries.push(Query.select(["$id","title", "description", "price", "discountedPrice","price","image"]));
            const { documents: product = [] } = await this.databases.listDocuments(
                conf.appwriteBlUsersDatabaseId,
                conf.appwriteBlProductsCollectionId,
                queries
            );
            return product[0];
        } catch (error) {
            console.log('Appwrite service :: getRefurbishedProductById', error);
            return false;
        }
    }
}

const searchRefurbishedProductService = new SearchRefurbishedProductService();
export default searchRefurbishedProductService;
