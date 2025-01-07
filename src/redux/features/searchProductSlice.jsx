import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchProductService from '../../appWrite/searchProduct.js';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ inputValue, selectedCategories, selectedBrands, pinCodes, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
        try {
            const response = await searchProductService.getProducts({
                inputValue,page, productsPerPage, sortByDesc, sortByAsc, selectedBrands, selectedCategories
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
                    totalPages: response.products.length || 0,
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

export const loadMoreProducts = createAsyncThunk(
    'products/loadMoreProducts',
    async ({ inputValue, selectedCategories, selectedBrands, pinCodes, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
        try {
            const response = await searchProductService.getProducts({
                inputValue,page, productsPerPage, selectedCategories,
                selectedBrands, sortByAsc, sortByDesc
            });

            if (response.products && response.products.length) {
                return {
                    products: response.products,
                    totalPages: response.products.length || 0,
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

const initialState = {
    products: [],
    loading: true,
    loadingMoreProducts: false,
    currentPage: 1,
    totalPages: 1,
    hasMoreProducts: true,
    error: null,
};

const productsSlice = createSlice({
    name: 'searchproducts',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        resetProducts: (state) => {
            state.products = [];
            state.currentPage = 1;
            state.totalPages = 1;
            state.hasMoreProducts = true;
            state.error = null;
        },
        sortProductReducer: (state, action) => {
            const { asc, desc } = action.payload;
            if (asc) {
                state.products.sort((a, b) => a.price - b.price);
            }
            if (desc) {
                state.products.sort((a, b) => b.price - a.price);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const { products, totalPages } = action.payload;
                if (products.length > 0) {
                    const newProducts = products.filter(
                        (product) => !state.products.some(existingProduct => existingProduct._id === product._id)
                    );
                    state.products = [...state.products, ...newProducts];
                    state.totalPages = totalPages;
                    state.hasMoreProducts = state.currentPage * 20 < totalPages;
                } else {
                    state.hasMoreProducts = false;
                }
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
                if (products.length > 0) {
                    const newProducts = products.filter(
                        (product) => !state.products.some(existingProduct => existingProduct.$id === product.$id)
                    );
                    state.products = [...state.products, ...newProducts];
                    state.totalPages = totalPages;
                    state.currentPage += 1;
                    state.hasMoreProducts = state.currentPage * 20 < totalPages;
                } else {
                    state.hasMoreProducts = false;
                }
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

// Exporting actions and reducer
export const { setCurrentPage, resetProducts, sortProductReducer } = productsSlice.actions;
export default productsSlice.reducer;
