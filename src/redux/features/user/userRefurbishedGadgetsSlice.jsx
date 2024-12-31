import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchingUserRefurbishedService from '../../../appWrite/userProducts/userRefurbishedProducts.js';
import { addRefurbishedProduct } from '../../../redux/features/user/userAllRefurbishedProductsSlice.jsx';

// Async thunk to fetch refurbished gadgets
export const fetchRefurbishedGadgets = createAsyncThunk(
    'gadgets/fetchRefurbishedGadgets',
    async ({ inputValue, phn, productsPerPage, currentPage }, { rejectWithValue, dispatch }) => {
        try {
            const response = await searchingUserRefurbishedService.getGadgets({ inputValue, phn, productsPerPage, page: currentPage });
            if (response.documents && response.total) {
                dispatch(addRefurbishedProduct(response.documents));
                return {
                    refurbishedProducts: response.documents,
                    totalPages: Math.ceil(response.total / productsPerPage),
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to load more refurbished gadgets
export const loadMoreRefurbishedGadgets = createAsyncThunk(
    'gadgets/loadMoreRefurbishedGadgets',
    async ({ inputValue, phn, productsPerPage, currentPage }, { rejectWithValue, dispatch }) => {
        try {
            const response = await searchingUserRefurbishedService.getGadgets({ inputValue, phn, productsPerPage, page: currentPage });
            if (response.documents && response.total) {
                dispatch(addRefurbishedProduct(response.documents));
                return {
                    refurbishedProducts: response.documents,
                    totalProducts: response.total,
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to delete a gadget
export const deleteGadget = createAsyncThunk(
    'gadgets/deleteGadget',
    async (gadgetId, { rejectWithValue }) => {
        try {
            await searchingUserRefurbishedService.deleteProduct(gadgetId);
            return { gadgetId };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice for gadgets
const gadgetsSlice = createSlice({
    name: 'userRefurbishedGadgets',
    initialState: {
        refurbishedProducts: [],
        loadingMoreGadgets: false,
        hasMoreGadgets: true,
        loading: true,
        currentPage: 1,
        error: null,
    },
    reducers: {
        resetGadgets: (state) => {
            state.refurbishedProducts = [];
            state.currentPage = 1;
            state.hasMoreGadgets = true;
            state.error = null;
        },
        removeGadget: (state, action) => {
            state.refurbishedProducts = state.refurbishedProducts.filter(
                (product) => product.$id !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRefurbishedGadgets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRefurbishedGadgets.fulfilled, (state, action) => {
                const { refurbishedProducts, totalPages } = action.payload;
                const newProducts = refurbishedProducts.filter(
                    (product) => !state.refurbishedProducts.some((existingProduct) => existingProduct.$id === product.$id)
                );

                state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
                state.hasMoreGadgets = state.currentPage < totalPages;
                state.loading = false;
            })
            .addCase(fetchRefurbishedGadgets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreGadgets = false;
            })
            .addCase(loadMoreRefurbishedGadgets.pending, (state) => {
                state.loadingMoreGadgets = true;
                state.error = null;
            })
            .addCase(loadMoreRefurbishedGadgets.fulfilled, (state, action) => {
                const { refurbishedProducts, totalProducts } = action.payload;
                const newProducts = refurbishedProducts.filter(
                    (product) => !state.refurbishedProducts.some((existingProduct) => existingProduct.$id === product.$id)
                );

                state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
                state.currentPage += 1;
                state.hasMoreGadgets = state.refurbishedProducts.length < totalProducts;
                state.loadingMoreGadgets = false;
            })
            .addCase(loadMoreRefurbishedGadgets.rejected, (state, action) => {
                state.loadingMoreGadgets = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreGadgets = false;
            })
            .addCase(deleteGadget.fulfilled, (state, action) => {
                const { gadgetId } = action.payload;
                state.refurbishedProducts = state.refurbishedProducts.filter(
                    (product) => product.$id !== gadgetId
                );
            })
            .addCase(deleteGadget.rejected, (state, action) => {
                state.error = action.payload || 'Failed to delete the gadget';
            });
    },
});

// Exporting actions and reducer
export const { resetGadgets, removeGadget } = gadgetsSlice.actions;
export const selectGadgets = (state) => state.gadgets.refurbishedProducts;
export const selectGadgetsLoading = (state) => state.gadgets.loading;
export const selectGadgetsError = (state) => state.gadgets.error;
export default gadgetsSlice.reducer;
