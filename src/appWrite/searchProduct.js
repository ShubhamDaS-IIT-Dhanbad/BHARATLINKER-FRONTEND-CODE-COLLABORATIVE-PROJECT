import conf from '../conf/conf.js';
import { Client, Databases, Storage, Query } from 'appwrite';
import { getBoundsOfDistance } from 'geolib';

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
        inputValue = '',
        selectedCategories,
        selectedBrands,
        minPrice,
        maxPrice,
        isInStock,
        userLat,
        userLong,
        radius,
        page,
        productsPerPage = 4,
        sortByAsc = false,
        sortByDesc = false,
        shopId
    }) {
        try {
            const inputTokens = inputValue
                .split(' ')
                .filter(token => token.trim() !== '')
                .map(token => token.toLowerCase());

            const queries = [];
            if (inputValue.length > 0) {
                queries.push(Query.or([
                    Query.contains('title', inputTokens),
                    Query.contains('description', inputTokens),
                    Query.contains('keywords', inputTokens),
                ]));
            }

            // Filter by categories
            if (selectedCategories.length > 0) {
                queries.push(Query.contains('category', selectedCategories));
            }
            // Filter by categories
            if (selectedBrands.length > 0) {
                queries.push(Query.contains('brand', selectedBrands));
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

            // Fetch products with optional price filtering and pagination
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
                if (shopId!==undefined) {
                    categoryQueries.push(Query.equal('shop', shopId));
                }



                // Pagination applied here using limit and offset
                const offset = (page - 1) * productsPerPage;
                categoryQueries.push(Query.limit(productsPerPage));
                categoryQueries.push(Query.offset(offset));
                const response = await this.databases.listDocuments(
                    conf.appwriteProductsDatabaseId,
                    collectionId,
                    categoryQueries
                );
              
                return response.documents || [];
            };

            const allProducts = await fetchProducts(conf.appwriteProductsCollectionId);

            if (!Array.isArray(allProducts)) {
                throw new TypeError("Expected 'allProducts' to be an array.");
            }

            // If no input value, return the products directly
            if (inputValue.length === 0) {
                return { success: true, products: allProducts };
            }

            // Perform scoring using the provided score card
            const scoredProducts = allProducts.map(product => {
                let score = 0;
                let distance = null;

                // Always calculate the score based on input tokens
                inputTokens.forEach(token => {
                    if (product.title.toLowerCase().includes(token)) score += 3;
                    if (product.description.toLowerCase().includes(token)) score += 2;
                    if (product.title.toLowerCase().startsWith(token)) score += 5;
                    if (product.description.toLowerCase().startsWith(token)) score += 4;
                });

                // Only calculate the distance if the radius, userLat, and userLong are provided
                if (radius && userLat && userLong) {
                    // Haversine formula for distance
                    const toRadians = (deg) => (deg * Math.PI) / 180;
                    const dLat = toRadians(product.latitude - userLat);
                    const dLon = toRadians(product.longitude - userLong);
                    const lat1 = toRadians(userLat);
                    const lat2 = toRadians(product.latitude);

                    const a = Math.sin(dLat / 2) ** 2 +
                        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const R = 6371;
                    distance = R * c;

                    // Only include products within the radius
                    if (distance > radius) {
                        return null;
                    }
                }

                // Return the product with score and distance (if applicable)
                return { ...product, score, distance };
            }).filter(product => product !== null);

            // After calculating scores and distance, sort by score
            scoredProducts.sort((a, b) => b.score - a.score);
            // Additional price sorting (optional)
            if (sortByAsc) {
                scoredProducts.sort((a, b) => a.price - b.price);
            }
            if (sortByDesc) {
                scoredProducts.sort((a, b) => b.price - a.price);
            }

            // Pagination logic
            const startIndex = (page - 1) * productsPerPage;
            const paginatedProducts = scoredProducts.slice(startIndex, startIndex + productsPerPage);

            return {
                success: true,
                products: paginatedProducts
            };

        } catch (error) {
            console.error('Appwrite service :: getRefurbishedProducts', error);
            return { success: false, error: error.message };
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
