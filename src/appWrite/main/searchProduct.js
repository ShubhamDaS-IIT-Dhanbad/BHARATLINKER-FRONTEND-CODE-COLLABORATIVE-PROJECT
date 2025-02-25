import conf from '../../conf/conf.js';
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
    async getProducts({
        shopId="",
        inputValue="",
        userLat,
        userLong,
        radius=5,
        page=1,
        productsPerPage = 4,
        sortByAsc=false,
        sortByDesc=false
    }) {
        try {
            const inputTokens = inputValue.trim().toLowerCase();
            const queries = [];
            if (inputValue.length > 0) {queries.push(Query.search("keywords", inputTokens));}
            if (shopId.length > 0) {queries.push(Query.equal("shopId", shopId));}
            queries.push(Query.equal("isActive", true));

    
            // Add sorting queries
            if (sortByAsc) queries.push(Query.orderAsc("discountedPrice"));
            if (sortByDesc) queries.push(Query.orderDesc("discountedPrice"));
    
            // Add geolocation queries if the location and radius are provided
            if (userLat !== undefined && userLong !== undefined && radius !== undefined && !shopId) {
                const center = { latitude: userLat, longitude: userLong };
                const bounds = getBoundsOfDistance(center, radius * 1000);
    
                queries.push(
                    Query.greaterThanEqual("latitude", bounds[0].latitude),
                    Query.lessThanEqual("latitude", bounds[1].latitude),
                    Query.greaterThanEqual("longitude", bounds[0].longitude),
                    Query.lessThanEqual("longitude", bounds[1].longitude)
                );
            }
            const offset = (page - 1) * productsPerPage;
            queries.push(Query.limit(productsPerPage), Query.offset(offset));
            queries.push(Query.select(["$id","shopId","title", "description", "price", "discountedPrice","isInStock","images",
                "shop.shopName","shop.$id","shop.isShopOpen","shop.shopEmail"
            ]));
            const { documents: allProducts = [] } = await this.databases.listDocuments(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                queries
            );
            if (!Array.isArray(allProducts)) throw new TypeError("Expected 'allProducts' to be an array.");
            if (inputValue.length === 0) return { success: true, products: allProducts };
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
    async getProductById(productId) {
        try {
            const queries = [];
            queries.push(Query.equal("$id",productId));
            queries.push(Query.select(["$id","shopId","title", "description", "price", "discountedPrice","isInStock","images","shops.registrationStatus",
                "shops.shopName","shops.isOpened","shops.email"
            ]));
            const { documents: product = [] } = await this.databases.listDocuments(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                queries
            );
            return product[0];
        } catch (error) {
            console.log('Appwrite service :: getProductById', error);
            return false;
        }
    } 
}

const searchProductService = new SearchProductService();
export default searchProductService;
