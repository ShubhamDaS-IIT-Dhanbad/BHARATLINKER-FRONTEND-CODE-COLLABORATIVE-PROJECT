import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchProductService from '../../../appWrite/main/searchProduct.js';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ inputValue,userLat,userLong,radius, selectedCategories, selectedBrands,page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {

        try {
            const response = await searchProductService.getProducts({
                userLat,userLong,radius,
                inputValue,
                page,
                productsPerPage,
                sortByAsc,
                sortByDesc,
                selectedBrands,
                selectedCategories
            });
            
            if (response?.products?.length === 0) {
                return {
                    products: [],
                    totalPages: 0,
                };
            }

            if (response.products && response.success) {
                return {
                    inputValue:inputValue,
                    products: response.products,
                    hasMoreProducts: response.products.length >= productsPerPage,
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

// Async thunk to load more products
export const loadMoreProducts = createAsyncThunk(
    'products/loadMoreProducts',
    async ({ inputValue,userLat,userLong,radius, selectedCategories, selectedBrands,page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
      
        try {
            const response = await searchProductService.getProducts({
                userLat,userLong,radius,
                inputValue,
                page,
                productsPerPage,
                selectedCategories,
                selectedBrands,
                sortByAsc,
                sortByDesc
            });
            if (response.products && response.success) {
                return {
                    products: response.products,
                    hasMoreProducts: response.products.length >= productsPerPage,
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
    query:'',
    products: [],

    loading: false,
    loadingMoreProducts: false,

    currentPage: 1,
    updated:0,
    selectedCategories: [],
    selectedBrands: [],

    totalPages: 1,
    sortByAsc: false,
    sortByDesc: false,
    priceRange: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
    hasMoreProducts: true,
    error: null,
    productsPerPage: 10,
};

// Slice
const productsSlice = createSlice({
    name: 'searchproducts',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        resetProducts: (state) => {
            state.products = [];
            state.loading = false;
            state.loadingMoreProducts = false;
            state.currentPage = 1;
            state.totalPages = 1;
            state.hasMoreProducts = true;
            state.error = null;
            state.productsPerPage = 10;
            state.updated=state.updated+1;
            state.query='';
        },        
        toggleSortOrder: (state, action) => {
            const order = action.payload;
            if (order === 'asc') {
                state.sortByAsc = !state.sortByAsc;
                if (state.sortByAsc) state.sortByDesc = false;
            } else if (order === 'desc') {
                state.sortByDesc = !state.sortByDesc;
                if (state.sortByDesc) state.sortByAsc = false;
            }
        },
        sortProductReducer: (state) => {
            const { sortByAsc, sortByDesc } = state;
            if (sortByAsc) {
                state.products = state.products.sort((a, b) => a.price - b.price);
            } else if (sortByDesc) {
                state.products = state.products.sort((a, b) => b.price - a.price);
            }
        },

        setPriceRange: (state, action) => {
            const { min, max } = action.payload;
            state.priceRange = { min, max };
        },
        resetSortFilters: (state) => {
            state.sortByAsc = false;
            state.sortByDesc = false;
            state.priceRange = { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER };
           
        },
        toggleCategory: (state, action) => {
            const category = action.payload;
            if (state.selectedCategories.includes(category)) {
                state.selectedCategories = state.selectedCategories.filter(item => item !== category);
            } else {
                state.selectedCategories.push(category);
            }
        },
        toggleBrand: (state, action) => {
            const brand = action.payload;
            if (state.selectedBrands.includes(brand)) {
                state.selectedBrands = state.selectedBrands.filter(item => item !== brand);
            } else {
                state.selectedBrands.push(brand);
            }
        },
        resetFilters: (state) => {
            state.selectedCategories = [];
            state.selectedBrands = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const {inputValue, products, hasMoreProducts } = action.payload;
                state.query=inputValue;
                state.products = products;
                state.hasMoreProducts = hasMoreProducts;
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreProducts = false;
            })



            .addCase(loadMoreProducts.pending, (state) => {
                state.loadingMoreProducts = true;
                state.error = null;
            })
            .addCase(loadMoreProducts.fulfilled, (state, action) => {
                const { products, hasMoreProducts } = action.payload;

                if (products.length > 0) {
                    // Filter out duplicate products
                    const newProducts = products.filter(
                        (product) => !state.products.some(existingProduct => existingProduct.$id === product.$id)
                    );

                    // Merge the new products with the existing ones
                    state.products = [...state.products, ...newProducts];

                    // Sort products based on sortByAsc or sortByDesc
                    if (state.sortByAsc) {
                        state.products.sort((a, b) => a.price - b.price);
                    } else if (state.sortByDesc) {
                        state.products.sort((a, b) => b.price - a.price);
                    }
                }
                // Update other state properties
                state.currentPage += 1;
                state.hasMoreProducts = hasMoreProducts;
                state.loadingMoreProducts = false;
            })
            .addCase(loadMoreProducts.rejected, (state, action) => {
                state.loadingMoreProducts = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreProducts = false;
            });
    },
});

// Selectors
export const selectUpdated = (state) => state.searchproducts.updated;
export const selectProducts = (state) => state.searchproducts.products;
export const selectLoading = (state) => state.searchproducts.loading;
export const selectCurrentPage = (state) => state.searchproducts.currentPage;
export const selectError = (state) => state.searchproducts.error;
export const selectedCategories = (state) => state.searchproducts.selectedCategories; // New selector for selectedCategories

// Exporting actions and reducer
export const {
    setCurrentPage,
    resetProducts,
    sortProductReducer,
    toggleSortOrder,
    toggleBrand,
    setPriceRange,
    resetSortFilters,
    resetFilters,
    toggleCategory
} = productsSlice.actions;

export default productsSlice.reducer;
