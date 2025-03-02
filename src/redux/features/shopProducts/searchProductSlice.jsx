import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchProductService from '../../../appWrite/main/searchProduct.js';

// Async thunk to fetch products for a specific shop
export const fetchProducts = createAsyncThunk(
    'shopProducts/fetchProducts',
    async ({ shopId, inputValue, selectedCategories, selectedBrands, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
         // Set selectedCategories to an empty array if it's not provided
        selectedCategories = selectedCategories || [];
        selectedBrands = selectedBrands || [];
    
        try {
            const response = await searchProductService.getProducts({
                inputValue,
                page,
                productsPerPage,
                sortByAsc,
                sortByDesc,
                selectedBrands,
                selectedCategories,
                shopId
            });
            if (response.products && response.success) {
                return {
                    
                    inputValue:inputValue,
                    shopId,
                    products: response.products,
                    hasMoreProducts: response.products.length >= productsPerPage,
                    totalPages: response.totalPages || 1
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
    
);

// Async thunk to load more products for a specific shop
export const loadMoreProducts = createAsyncThunk(
    'shopProducts/loadMoreProducts',
    async ({ shopId, inputValue, selectedCategories, selectedBrands, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
        try {


            selectedCategories = selectedCategories || [];
            selectedBrands = selectedBrands || [];

            const response = await searchProductService.getProducts({
                inputValue,
                page,
                productsPerPage,
                selectedCategories,
                selectedBrands,
                sortByAsc,
                sortByDesc,
                shopId
            });
            if (response.products && response.success) {
                return {
                    
                    inputValue:inputValue,
                    shopId,
                    products: response.products,
                    hasMoreProducts: response.products.length >= productsPerPage,
                    totalPages: response.totalPages || 1
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Initial state
const initialState = {
    query:"",
    shops: {}, // Keyed by shopId
    loading: false,
    loadingMoreProducts: false,
    error: null
};

// Slice
const shopProductsSlice = createSlice({
    name: 'shopproducts',
    initialState,
    reducers: {
        resetShopProducts: (state, action) => {
            const shopId = action.payload;
        
            if (shopId) {
                // Reset specific data for the shop, keeping selected categories, selected brands, and sorting settings intact
                const shop = state.shops[shopId];
        
                if (shop) {
                    state.shops[shopId] = {
                        ...shop,
                        products: [],
                        query:"",
                        selectedCategories: shop.selectedCategories,
                        selectedBrands: shop.selectedBrands,
                        sortByAsc: shop.sortByAsc,
                        sortByDesc: shop.sortByDesc,
                        currentPage: 0, // Reset current page to 1
                    };
                }
            } else {
                // Reset all shops data except for the properties we want to keep intact
                for (const shopId in state.shops) {
                    const shop = state.shops[shopId];
                    if (shop) {
                        state.shops[shopId] = {
                            ...shop,
                            products: [], // Reset products or any other data to be cleared
                            selectedCategories: shop.selectedCategories,
                            selectedBrands: shop.selectedBrands,
                            sortByAsc: shop.sortByAsc,
                            sortByDesc: shop.sortByDesc,
                            currentPage: 0, // Reset current page to 1
                        };
                    }
                }
            }
        },        

        toggleShopSortOrder: (state, action) => {
            const { shopId, order } = action.payload;
            const shop = state.shops[shopId];

            if (shop) {
                if (order === 'asc') {
                    shop.sortByAsc = !shop.sortByAsc;
                    if (shop.sortByAsc) shop.sortByDesc = false;
                } else if (order === 'desc') {
                    shop.sortByDesc = !shop.sortByDesc;
                    if (shop.sortByDesc) shop.sortByAsc = false;
                }

                if (shop.products && shop.products.length > 0) {
                    const sortedProducts = [...shop.products];

                    if (shop.sortByAsc) {
                        sortedProducts.sort((a, b) => a.price - b.price);
                    } else if (shop.sortByDesc) {
                        sortedProducts.sort((a, b) => b.price - a.price);
                    }
                    shop.products = sortedProducts;
                }
            }
        },
        setShopPriceRange: (state, action) => {
            const { shopId, min, max } = action.payload;
            const shop = state.shops[shopId];
            if (shop) {
                shop.priceRange = { min, max };
            }
        },
        toggleCategory: (state, action) => {
            const { shopId, category } = action.payload;
            const shop = state.shops[shopId];
            if (shop) {
                const index = shop.selectedCategories.indexOf(category);
                if (index === -1) {
                    shop.selectedCategories.push(category);  // Add category
                } else {
                    shop.selectedCategories.splice(index, 1);  // Remove category
                }
            }
        },

        // Toggle a brand in selectedBrands
        toggleBrand: (state, action) => {
            const { shopId, brand } = action.payload;
            const shop = state.shops[shopId];
            if (shop) {
                const index = shop.selectedBrands.indexOf(brand);
                if (index === -1) {
                    shop.selectedBrands.push(brand);  // Add brand
                } else {
                    shop.selectedBrands.splice(index, 1);  // Remove brand
                }
            }
        },

    },
    extraReducers: (builder) => {

        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const { shopId, products,inputValue, hasMoreProducts, totalPages } = action.payload;
                state.query=inputValue;
                if (!state.shops[shopId]) {
                    state.shops[shopId] = {
                        products: [],
                        currentPage: 1,  // Initialize currentPage
                        hasMoreProducts: true,
                        sortByAsc: false,
                        sortByDesc: false,
                        priceRange: { min: 0, max: Number.MAX_SAFE_INTEGER },
                        selectedCategories: [],
                        selectedBrands: []
                    };
                }
                state.shops[shopId].products = products;
                state.shops[shopId].hasMoreProducts = hasMoreProducts;
                state.shops[shopId].totalPages = totalPages;
                state.shops[shopId].currentPage = 1;
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            })





            .addCase(loadMoreProducts.pending, (state) => {
                state.loadingMoreProducts = true;
                state.error = null;
            })
            .addCase(loadMoreProducts.fulfilled, (state, action) => {
                const { shopId, products, hasMoreProducts } = action.payload;
                if (state.shops[shopId]) {
                    const newProducts = products.filter(
                        (product) => !state.shops[shopId].products.some(existingProduct => existingProduct.$id === product.$id)
                    );

                    state.shops[shopId].products = [...state.shops[shopId].products, ...newProducts];
                    state.shops[shopId].hasMoreProducts = hasMoreProducts;
                    state.shops[shopId].currentPage += 1;  // Increment currentPage after loading more products
                }
                state.loadingMoreProducts = false;
            })
            .addCase(loadMoreProducts.rejected, (state, action) => {
                state.loadingMoreProducts = false;
                state.error = action.payload || 'Something went wrong';
            });
    }
});

// Selectors
export const selectShopProducts = (state, shopId) => state.shopproducts.shops[shopId]?.products || [];
export const selectShopLoading = (state) => state.shopproducts.loading;
export const selectShopError = (state) => state.shopproducts.error;
export const selectShopDetails = (state, shopId) => state.shopproducts.shops[shopId] || {};

// Exporting actions and reducer
export const {
    resetShopProducts,
    toggleShopSortOrder,
    setShopPriceRange,
    toggleBrand,
    toggleCategory
} = shopProductsSlice.actions;

export default shopProductsSlice.reducer;
