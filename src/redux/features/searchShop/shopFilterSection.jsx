import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBrands: [],
  selectedCategories: [],
};

const shopFilterSectionSlice = createSlice({
  name: 'shopfiltersection',
  initialState,
  reducers: {
    // Set selected categories
    setShopFilterCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },

    // Set selected brands
    setShopFilterBrands: (state, action) => {
      state.selectedBrands = action.payload;
    },

    // Reset the filters (clear selected categories and brands)
    resetShopFilters: (state) => {
      state.selectedBrands = [];
      state.selectedCategories = [];
    },
  },
});

export const {
  setShopFilterCategories,
  setShopFilterBrands,
  resetShopFilters,
} = shopFilterSectionSlice.actions;

export default shopFilterSectionSlice.reducer;
