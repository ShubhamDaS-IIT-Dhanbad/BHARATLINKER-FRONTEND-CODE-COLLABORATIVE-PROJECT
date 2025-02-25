import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopProduct from '../../../appWrite/shop/shopProduct.js';

export const fetchProducts = createAsyncThunk(
    'retailerproducts/fetchProducts',
    async ({ inputValue, shopId, selectedCategories, selectedBrands, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue, signal }) => {
        try {
            const response = await shopProduct.getShopProducts({
                shopId,
                inputValue,
                page,
                productsPerPage,
                sortByAsc,
                sortByDesc,
                selectedBrands,
                selectedCategories
            }, { signal });
            
            if (!response?.success) {
                return rejectWithValue('Invalid response from server');
            }

            return {
                total: response.total || 0,
                products: response.products || [],
                hasMoreProducts: (response.products?.length || 0) >= productsPerPage,
            };
        } catch (error) {
            if (error.name === 'AbortError') return;
            return rejectWithValue(error.message || 'Failed to fetch products');
        }
    }
);

export const loadMoreProducts = createAsyncThunk(
    'retailerProducts/loadMoreProducts',
    async ({ inputValue, shopId, selectedCategories, selectedBrands, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue, signal }) => {
        try {
            const response = await shopProduct.getShopProducts({
                shopId,
                inputValue,
                page,
                productsPerPage,
                selectedCategories,
                selectedBrands,
                sortByAsc,
                sortByDesc,
            }, { signal });
            
            if (!response?.success) {
                return rejectWithValue('Invalid response from server');
            }

            return {
                products: response.products || [],
                hasMoreProducts: (response.products?.length || 0) >= productsPerPage,
            };
        } catch (error) {
            if (error.name === 'AbortError') return;
            return rejectWithValue(error.message || 'Failed to load more products');
        }
    }
);

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
    total: 0,
    loaded:false
};

const retailerProductsSlice = createSlice({
    name: 'retailerProducts',
    initialState,
    reducers: {
        resetShopProducts: () => initialState,
        toggleSortOrder: (state, action) => {
            const order = action.payload;
            state.sortByAsc = order === 'asc' ? !state.sortByAsc : false;
            state.sortByDesc = order === 'desc' ? !state.sortByDesc : false;
        },
        toggleCategory: (state, action) => {
            const category = action.payload;
            state.selectedCategories = state.selectedCategories.includes(category)
                ? state.selectedCategories.filter(item => item !== category)
                : [...state.selectedCategories, category];
        },
        toggleBrand: (state, action) => {
            const brand = action.payload;
            state.selectedBrands = state.selectedBrands.includes(brand)
                ? state.selectedBrands.filter(item => item !== brand)
                : [...state.selectedBrands, brand];
        },
        updateProduct: (state, action) => {
            const { productId, updatedData } = action.payload;
            const index = state.products.findIndex(p => p.$id === productId);
            if (index !== -1) {
                state.products[index] = { ...state.products[index], ...updatedData };
            }
        },
        deleteProduct: (state, action) => {
            const productId = action.payload;
            state.products = state.products.filter((product) => product.$id !== productId);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.loaded=true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.products = action.payload.products;
                    state.total = action.payload.total;
                    state.hasMoreProducts = action.payload.hasMoreProducts;
                    state.currentPage = 1;
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.hasMoreProducts = false;
            })



            .addCase(loadMoreProducts.pending, (state) => {
                state.loadingMoreProducts = true;
                state.error = null;
            })
            .addCase(loadMoreProducts.fulfilled, (state, action) => {
                state.loadingMoreProducts = false;
                if (action.payload) {
                    const newProducts = action.payload.products.filter(
                        product => !state.products.some(p => p.$id === product.$id)
                    );
                    state.products = [...state.products, ...newProducts];
                    state.hasMoreProducts = action.payload.hasMoreProducts;
                    state.currentPage += 1;
                }
            })
            .addCase(loadMoreProducts.rejected, (state, action) => {
                state.loadingMoreProducts = false;
                state.error = action.payload;
            });
    },
});

export const {
    resetShopProducts,
    toggleSortOrder,
    toggleCategory,
    toggleBrand,
    updateProduct,
    deleteProduct,
} = retailerProductsSlice.actions;

export default retailerProductsSlice.reducer;