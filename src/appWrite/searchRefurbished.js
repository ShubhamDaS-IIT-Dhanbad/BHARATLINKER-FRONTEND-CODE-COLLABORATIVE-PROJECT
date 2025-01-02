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
        isbook = true,
        ismodule = true,
        isgadgets = true,
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
                queries.push(Query.or([Query.search('title', inputValue), Query.search('description', inputValue)]));
            }
            // Filter by selected categories
            if (selectedCategories.length > 0) {
                queries.push(Query.contains('category', selectedCategories));
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

            let productsBook = { documents: [] };
            let productsModule = { documents: [] };
            let productsGadgets = { documents: [] };

            // Fetch products for Books, if isbook is true
            if (isbook) {
                const bookQueries = [...queries];
                // Add book-specific filters here
                if (minPrice !== undefined) {
                    bookQueries.push(Query.greaterThanEqual('price', minPrice));
                }
                if (maxPrice !== undefined) {
                    bookQueries.push(Query.lessThanEqual('price', maxPrice));
                }
                if (isInStock !== undefined) {
                    bookQueries.push(Query.equal('isInStock', isInStock));
                }
                productsBook = await this.databases.listDocuments(
                    conf.appwriteRefurbishProductDatabaseId,
                    conf.appwriteRefurbishedBooksCollectionId,
                    bookQueries
                );
            }

            // Fetch products for Modules, if ismodule is true
            if (ismodule) {
                const moduleQueries = [...queries];
                productsModule = await this.databases.listDocuments(
                    conf.appwriteRefurbishProductDatabaseId,
                    conf.appwriteRefurbishedModulesCollectionId,
                    moduleQueries
                );
            }

            // Fetch products for Gadgets, if isgadgets is true, but exclude inputValue for gadgets
            if (isgadgets) {
                const gadgetsQueries = [...queries];
                // Remove inputValue search from gadgets query
                const index = gadgetsQueries.findIndex(q => q.$or);
                if (index !== -1) {
                    gadgetsQueries.splice(index, 1); // Remove inputValue search query
                }
                productsGadgets = await this.databases.listDocuments(
                    conf.appwriteRefurbishProductDatabaseId,
                    conf.appwriteRefurbishedGadgetsCollectionId,
                    gadgetsQueries
                );
            }

            // Combine products from all collections
            const products = [
                ...productsBook.documents,
                ...productsModule.documents,
                ...productsGadgets.documents
            ];

            // Return the combined result with the count of documents in each category
            return {
                products,
                nbook: isbook ? productsBook.documents.length : 0,
                nmodule: ismodule ? productsModule.documents.length : 0,
                ngadgets: isgadgets ? productsGadgets.documents.length : 0
            };

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

