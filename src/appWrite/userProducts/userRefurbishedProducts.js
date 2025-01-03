import conf from '../../conf/conf.js';
import { Client, Databases, Storage, Query } from 'appwrite';

class UserRefurbishedProductsService {
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

    async getUserRefurbishedProducts({
        inputValue,
        pinCodes = [],
        selectedCategories,
        selectedBrands,
        minPrice,
        maxPrice,
        isInStock,
        isbook = true,
        ismodule = true,
        isgadgets = true,
        page,
        productsPerPage,
        sortByAsc = false,
        sortByDesc = false,
        phn // Add phn to parameters
    }) {
        // Check if phn is present
        if (!phn) {
            return { success: false, error: 'Phone number is required to fetch products.' };
        }

        try {
            const queries = [];
            queries.push(Query.equal('phn',phn));
            // Filter by pin codes
            if (pinCodes.length > 0) {
                queries.push(Query.equal('pinCodes', pinCodes));
            }

            // Search by inputValue in title or description
            if (inputValue) {
                queries.push(Query.or([
                    Query.search('title', inputValue),
                    Query.search('description', inputValue)
                ]));
            }

            // Filter by selected categories and keywords
            if (selectedCategories.length > 0) {
                queries.push(Query.or([
                    Query.contains('productType', selectedCategories),
                    Query.contains('keywords', selectedCategories)
                ]));
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
            queries.push(Query.limit(productsPerPage), Query.offset(offset));

            // Fetch products for each category
            const fetchCategoryProducts = async (collectionId, applyPriceFilter = false) => {
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
                return await this.databases.listDocuments(
                    conf.appwriteRefurbishProductDatabaseId,
                    collectionId,
                    categoryQueries
                );
            };

            const productsBook = isbook
                ? await fetchCategoryProducts(conf.appwriteRefurbishedBooksCollectionId, true)
                : { documents: [] };
            const productsModule = ismodule
                ? await fetchCategoryProducts(conf.appwriteRefurbishedModulesCollectionId)
                : { documents: [] };
            const productsGadgets = isgadgets
                ? await fetchCategoryProducts(conf.appwriteRefurbishedGadgetsCollectionId)
                : { documents: [] };

            // Combine products
            const allProducts = [
                ...productsBook.documents,
                ...productsModule.documents,
                ...productsGadgets.documents
            ];

            // Filter and sort products
            const filteredProducts = allProducts.filter(product => {
                const matchesQuery = inputValue
                    ? product.title.includes(inputValue) || product.description.includes(inputValue)
                    : true;
                const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(category =>
                    product.productType.includes(category) || product.keywords.includes(category)
                );
                return matchesQuery && matchesCategory;
            });

            if (sortByAsc) {
                filteredProducts.sort((a, b) => a.price - b.price);
            }
            if (sortByDesc) {
                filteredProducts.sort((a, b) => b.price - a.price);
            }

            // Return results
            return {
                products: filteredProducts,
                nbook: isbook ? productsBook.documents.length : 0,
                nmodule: ismodule ? productsModule.documents.length : 0,
                ngadgets: isgadgets ? productsGadgets.documents.length : 0,
            };

        } catch (error) {
            console.error('Error fetching user refurbished products:', error);
            return { success: false, error: error.message || 'Unknown error' };
        }
    }
}

const userRefurbishedProductsService = new UserRefurbishedProductsService();
export default userRefurbishedProductsService;
