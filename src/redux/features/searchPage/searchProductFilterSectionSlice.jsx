import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBrands: [],
  selectedCategories: [],
};

const searchProductsFilterSectionSlice = createSlice({
  name: 'searchproductsfiltersection',
  initialState,
  reducers: {
    // Set selected categories
    setSearchProductsCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },

    // Set selected brands
    setSearchProductsBrands: (state, action) => {
      state.selectedBrands = action.payload;
    },

    // Reset the filters (clear selected categories and brands)
    resetSearchProductsFilters: (state) => {
      state.selectedBrands = [];
      state.selectedCategories = [];
    },
  },
});

export const {
  setSearchProductsCategories,
  setSearchProductsBrands,
  resetSearchProductsFilters,
} = searchProductsFilterSectionSlice.actions;

export default searchProductsFilterSectionSlice.reducer;
