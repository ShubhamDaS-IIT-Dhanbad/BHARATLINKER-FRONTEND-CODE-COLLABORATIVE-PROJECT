import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getRetailerProducts} from '../../../appWrite/uploadProduct/upload.js';



export const fetchProducts = createAsyncThunk(
    'retailerproducts/fetchProducts',
    async ({ inputValue, shopId, selectedCategories, selectedBrands, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
        try {
            const response = await getRetailerProducts({
                shopId,
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

// Exported Thunk
export const loadMoreProducts = createAsyncThunk(
    'retailerProducts/loadMoreProducts',
    async ({ inputValue, shopId, selectedCategories, selectedBrands, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
        try {
            const response = await getRetailerProducts({
                shopId,
                inputValue,
                page,
                productsPerPage,
                selectedCategories,
                selectedBrands,
                sortByAsc,
                sortByDesc,
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
};

// Slice
const retailerProductsSlice = createSlice({
    name: 'retailerProducts',
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
                state.selectedCategories = state.selectedCategories.filter((item) => item !== category);
            } else {
                state.selectedCategories.push(category);
            }
        },
        toggleBrand: (state, action) => {
            const brand = action.payload;
            if (state.selectedBrands.includes(brand)) {
                state.selectedBrands = state.selectedBrands.filter((item) => item !== brand);
            } else {
                state.selectedBrands.push(brand);
            }
        },
        resetFilters: (state) => {
            state.selectedCategories = [];
            state.selectedBrands = [];
        },
        deleteProductSlice: (state, action) => {
            const productId = action.payload;
            state.products = state.products.filter((product) => product.$id !== productId.id);
        },
        updateProductSlice: (state, action) => {
            const { productId, updatedData } = action.payload;
            
            state.products = state.products.map((product) =>
                product.$id === productId ? { ...product, ...updatedData } : product
            );
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const { products, hasMoreProducts } = action.payload;
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
                    const newProducts = products.filter(
                        (product) => !state.products.some((existingProduct) => existingProduct.$id === product.$id)
                    );

                    state.products = [...state.products, ...newProducts];

                    if (state.sortByAsc) {
                        state.products.sort((a, b) => a.price - b.price);
                    } else if (state.sortByDesc) {
                        state.products.sort((a, b) => b.price - a.price);
                    }
                }

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
export const selectRetailerProducts = (state) => state.retailerProducts.products;
export const selectLoading = (state) => state.retailerProducts.loading;
export const selectCurrentPage = (state) => state.retailerProducts.currentPage;
export const selectError = (state) => state.retailerProducts.error;
export const selectSelectedCategories = (state) => state.retailerProducts.selectedCategories;

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
    toggleCategory,
    deleteProductSlice,
    updateProductSlice,
} = retailerProductsSlice.actions;

export default retailerProductsSlice.reducer;
