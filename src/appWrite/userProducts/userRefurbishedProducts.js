import conf from '../../conf/conf.js';
import { Client, Databases, Storage, Query } from 'appwrite';

class SearchingUserRefurbishedService {
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

    // get refurbiahed product
    async getRefurbishedBooks({
        phn,
        inputValue,
        page, // default to page 1 if not provided
        productsPerPage,
    }) {
        try {
            const queries = [];
    
            if (!phn) {
                console.error("something went wrong: user not found");
                return false;
            }
    
            queries.push(Query.search('phn', phn));
    
            if (inputValue) {
                const searchTerms = inputValue.trim().split(' ');
    
                if (searchTerms.length > 1) {
                    const searchQueries = searchTerms.map(term => 
                        Query.or([
                            Query.search('title', term),
                            Query.search('description', term)
                        ])
                    );
                    queries.push(Query.and(searchQueries));
                } else {
                    const term = searchTerms[0];
                    queries.push(Query.or([
                        Query.search('title', term),
                        Query.search('description', term)
                    ]));
                }
            }
            // Pagination logic
            const offset = (page - 1) * productsPerPage;
            if (offset >= 0) {
                queries.push(Query.limit(productsPerPage));
                queries.push(Query.offset(offset));
            }
    
            // Fetch refurbished products with applied queries
            const refurbishedProducts = await this.databases.listDocuments(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedBooksCollectionId,
                queries
            );
    
            return refurbishedProducts;
        } catch (error) {
            console.error('Appwrite service :: getRefurbishedProducts', error);
            return false;
        }
    }
    
    // Method to fetch a refurbished product by ID
    async getRefurbishedBookById(productId) {
        try {
            const refurbishedProduct = await this.databases.getDocument(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                productId
            );
            return refurbishedProduct;
        } catch (error) {
            console.log('Appwrite service :: getRefurbishedProductById', error);
            return false;
        }
    }
    




    //get module
    async getModule({
        phn,
        inputValue,
        page,
        productsPerPage,
    }) {
        try {
            const queries = [];
    
            if (!phn) {
                console.error("something went wrong: user not found");
                return false;
            }
            
            // Search by 'phn'
            queries.push(Query.search('phn', phn));
    
            if (inputValue) {
                const searchTerms = inputValue.trim().split(' ');
    
                if (searchTerms.length > 1) {
                    const searchQueries = searchTerms.map(term => 
                        Query.or([
                            Query.search('title', term),
                            Query.search('description', term),
                            Query.search('exam', term),
                            Query.search('coachingInstitute', term),
                            Query.search('subject', term),
                            Query.search('author', term)
                        ])
                    );
                    queries.push(Query.and(searchQueries));
                } else {
                    const term = searchTerms[0];
                    const singleTermQuery = Query.or([
                        Query.search('title', term),
                        Query.search('description', term),
                        Query.search('exam', term),
                        Query.search('coachingInstitute', term),
                        Query.search('subject', term),
                        Query.search('author', term)
                    ]);
                    queries.push(singleTermQuery);
                    const singleTermProducts = await this.databases.listDocuments(
                        conf.appwriteRefurbishProductDatabaseId,
                        conf.appwriteRefurbishedModulesCollectionId,
                        [singleTermQuery]
                    );
    
                    // Check if any product matches the single term and return immediately if found
                    if (singleTermProducts.documents.length > 0) {
                        return singleTermProducts;
                    }
                }
            }
    
            const offset = (page - 1) * productsPerPage;
            if (offset >= 0) {
                queries.push(Query.limit(productsPerPage));
                queries.push(Query.offset(offset));
            }
    
            const refurbishedProducts = await this.databases.listDocuments(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedModulesCollectionId,
                queries
            );
    
            return refurbishedProducts;
        } catch (error) {
            console.error('Appwrite service :: getRefurbishedProducts', error);
            return false;
        }
    }
    
    
    

    // Method to fetch a refurbished product by ID
    async getModuleById(productId) {
        console.log(productId, conf.appwriteProductsProjectId, conf.appwriteProductsDatabaseId, conf.appwriteProductsCollectionId);
        try {
            const refurbishedProduct = await this.databases.getDocument(
                conf.appwriteProductsDatabaseId,
                conf.appwriteRefurbishedModulesCollectionId,
                productId
            );
            return refurbishedProduct;
        } catch (error) {
            console.log('Appwrite service :: getRefurbishedProductById', error);
            return false;
        }
    }





    async getGadgets({
        phn,
        inputValue,
        page,
        productsPerPage,
    }) {
        try {
            const queries = [];
    
            if (!phn) {
                console.error("something went wrong: user not found");
                return false;
            }
            
            // Search by 'phn'
            queries.push(Query.search('phn', phn));
    
            
    
            const offset = (page - 1) * productsPerPage;
            if (offset >= 0) {
                queries.push(Query.limit(productsPerPage));
                queries.push(Query.offset(offset));
            }
    
            const refurbishedProducts = await this.databases.listDocuments(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedGadgetsCollectionId,
                queries
            );
            return refurbishedProducts;
        } catch (error) {
            console.error('Appwrite service :: getRefurbishedProducts', error);
            return false;
        }
    }
    
    
    

    // Method to fetch a refurbished product by ID
    async getGadgetsById(productId) {
        console.log(productId, conf.appwriteProductsProjectId, conf.appwriteProductsDatabaseId, conf.appwriteProductsCollectionId);
        try {
            const refurbishedProduct = await this.databases.getDocument(
                conf.appwriteProductsDatabaseId,
                conf.appwriteRefurbishedGadgetsCollectionId,
                productId
            );
            return refurbishedProduct;
        } catch (error) {
            console.log('Appwrite service :: getRefurbishedProductById', error);
            return false;
        }
    }
}

const searchingUserRefurbishedService = new SearchingUserRefurbishedService();
export default searchingUserRefurbishedService;
