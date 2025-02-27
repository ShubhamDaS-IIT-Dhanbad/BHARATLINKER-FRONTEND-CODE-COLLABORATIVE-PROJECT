import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchShopService from '../../../appWrite/main/searchShop.js'; // Adjust the path if necessary

// Async thunk to fetch shop details by ID
export const fetchShopById = createAsyncThunk(
  'shops/fetchShopById',
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await searchShopService.getShopById(shopId);
      return response; // Assuming response contains the shop details
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  singleShops: [], // Holds the array of single shops
  loading: false,
  error: null,
};

// Create the shop slice
const singleShopSlice = createSlice({
  name: 'singleshops',
  initialState,
  reducers: {
    // Action to clear all shops from the array
    clearShops(state) {
      state.singleShops = []; // Clear the array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleShops.push(action.payload); // Add the fetched shop to the array
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearShops } = singleShopSlice.actions;

// Export the reducer
export default singleShopSlice.reducer;
