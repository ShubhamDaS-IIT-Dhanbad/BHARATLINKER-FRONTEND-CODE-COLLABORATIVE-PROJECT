import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchShopService from '../../../appWrite/main/searchShop.js';

// Async thunk to fetch shops
export const fetchShops = createAsyncThunk(
    'shops/fetchShops',
    async ({ inputValue, userLat, userLong, radius, selectedCategories, page, shopsPerPage }, { rejectWithValue }) => {
        try {
            const response = await searchShopService.getShops({
                inputValue, page, shopsPerPage, selectedCategories,
                userLat, userLong, radius,
            });
            // Check if response has shops
            if (response.shops) {
                return {
                    inputValue:inputValue,
                    shops: response.shops,
                    hasMoreShops: response.shops.length >= shopsPerPage,
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to load more shops
export const loadMoreShops = createAsyncThunk(
    'shops/loadMoreShops',
    async ({ inputValue, userLat, userLong, radius, selectedCategories, page, shopsPerPage }, { rejectWithValue }) => {
        try {
            const response = await searchShopService.getShops({
                inputValue, page, shopsPerPage, selectedCategories,
                userLat, userLong, radius,
            });

            // Check if response has shops
            if (response.shops) {
                return {
                    shops: response.shops,
                    hasMoreShops: response.shops.length >= shopsPerPage,
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    shops: [],
    query:'',
    updated:0,
    loading: false,
    loadingMoreShops: false,
    currentPage: 1,
    hasMoreShops: true,
    error: null,
};

const shopsSlice = createSlice({
    name: 'searchshops',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        resetShops: (state) => {
            state.shops = [];
            state.updated =state.updated+1;
            state.currentPage = 1;
            state.hasMoreShops = true;
            state.error = null;
            state.loading= false;
            state.loadingMoreShops= false;
            state.query='';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShops.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShops.fulfilled, (state, action) => {
                const { shops, hasMoreShops ,inputValue} = action.payload;
                state.query=inputValue;
                if (shops.length > 0) {
                    const newShops = shops.filter(
                        (shop) => !state.shops.some(existingShop => existingShop.$id === shop.$id)
                    );
                    state.shops = [...state.shops, ...newShops];
                    state.hasMoreShops = hasMoreShops;  
                }
                state.loading = false;
            })
            .addCase(fetchShops.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreShops = false;
            })


            // Load more shops
            .addCase(loadMoreShops.pending, (state) => {
                state.loadingMoreShops = true;
                state.error = null;
            })
            .addCase(loadMoreShops.fulfilled, (state, action) => {
                const { shops, hasMoreShops } = action.payload;
                if (shops.length > 0) {
                    const newShops = shops.filter(
                        (shop) => !state.shops.some(existingShop => existingShop.$id === shop.$id)
                    );
                    state.shops = [...state.shops, ...newShops];
                    state.currentPage += 1; // Increment current page by 1
                    state.hasMoreShops = hasMoreShops;
                } else {
                    state.hasMoreShops = false;
                }
                state.loadingMoreShops = false;
            })
            .addCase(loadMoreShops.rejected, (state, action) => {
                state.loadingMoreShops = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreShops = false;
            });
    },
});

// Selectors
export const selectShops = (state) => state.searchShops.shops;
export const selectLoading = (state) => state.searchShops.loading;
export const selectCurrentPage = (state) => state.searchShops.currentPage;
export const selectError = (state) => state.searchShops.error;

// Exporting actions and reducer
export const { setCurrentPage, resetShops } = shopsSlice.actions;
export default shopsSlice.reducer;
