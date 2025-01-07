import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchProductService from '../../../appWrite/searchProduct.js';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ inputValue, selectedCategories, selectedBrands, pinCodes, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
        try {
            const response = await searchProductService.getProducts({
                inputValue, page, productsPerPage, sortByAsc, sortByDesc, selectedBrands, selectedCategories
            });

            if (response?.products?.length === 0) {
                return {
                    products: [],
                    totalPages: 0,
                };
            }

            if (response.products && response.success) {
                return {
                    products: response.products,
                    totalPages: Math.ceil(response.totalCount / productsPerPage) || 1,
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
    async ({ inputValue, selectedCategories, selectedBrands, pinCodes, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
        try {
            const response = await searchProductService.getProducts({
                inputValue, page, productsPerPage, selectedCategories, selectedBrands, sortByAsc, sortByDesc
            });

            if (response.products && response.success) {
                return {
                    products: response.products,
                    totalPages: Math.ceil(response.totalCount / productsPerPage) || 1,
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
    products: [],
    loading: false,
    loadingMoreProducts: false,
    currentPage: 1,
    selectedCategories: [],
    selectedBrands: [],
    totalPages: 1,
    sortByAsc: false,
    sortByDesc: false,
    priceRange: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
    hasMoreProducts: true,
    error: null,
    productsPerPage: 10, // Added productsPerPage to state
};

// Slice
const productsSlice = createSlice({
    name: 'searchproducts',
    initialState:{
        products: [],
        loading: false,
        loadingMoreProducts: false,
        currentPage: 1,
        selectedCategories: [],
        selectedBrands: [],
        totalPages: 1,
        sortByAsc: false,
        sortByDesc: false,
        priceRange: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
        hasMoreProducts: true,
        error: null,
        productsPerPage: 10,
    },
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        resetProducts: (state) => {
            Object.assign(state, initialState);
        },
        sortProductReducer: (state, action) => {
            const { asc, desc } = action.payload;
            if (asc) {
                state.products.sort((a, b) => a.price - b.price);
            } else if (desc) {
                state.products.sort((a, b) => b.price - a.price);
            }
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
            console.log(category, "lp", state.selectedCategories);
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
                const { products, totalPages } = action.payload;
                state.products = [...state.products, ...products];
                state.totalPages = totalPages;
                state.hasMoreProducts = products.length >= state.productsPerPage && state.currentPage < totalPages;
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
                const { products, totalPages } = action.payload;
                const newProducts = products.filter(
                    (product) => !state.products.some(existingProduct => existingProduct._id === product._id)
                );
                state.products = [...state.products, ...newProducts];
                state.totalPages = totalPages;
                state.currentPage += 1;
                state.hasMoreProducts = newProducts.length >= state.productsPerPage && state.currentPage < totalPages;
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
export const selectProducts = (state) => state.searchproducts.products;
export const selectLoading = (state) => state.searchproducts.loading;
export const selectCurrentPage = (state) => state.searchproducts.currentPage;
export const selectError = (state) => state.searchproducts.error;
export const selectSelectedCategories = (state) => state.searchproducts.selectedCategories; // New selector for selectedCategories

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
