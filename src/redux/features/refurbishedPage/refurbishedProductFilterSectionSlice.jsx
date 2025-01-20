import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedRefurbishedBrands: [],
  selectedRefurbishedCategories: [],
};

const refurbishedProductsFilterSectionSlice = createSlice({
  name: 'refurbishedproductsfiltersection',
  initialState,
  reducers: {
    // Set selected refurbished categories
    setRefurbishedProductsCategories: (state, action) => {
      state.selectedRefurbishedCategories = action.payload;
    },

    // Set selected refurbished brands
    setRefurbishedProductsBrands: (state, action) => {
      state.selectedRefurbishedBrands = action.payload;
    },

    // Reset the filters (clear selected refurbished categories and brands)
    resetRefurbishedProductsFilters: (state) => {
      state.selectedRefurbishedBrands = [];
      state.selectedRefurbishedCategories = [];
    },
  },
});

export const {
  setRefurbishedProductsCategories,
  setRefurbishedProductsBrands,
  resetRefurbishedProductsFilters,
} = refurbishedProductsFilterSectionSlice.actions;

export default refurbishedProductsFilterSectionSlice.reducer;
