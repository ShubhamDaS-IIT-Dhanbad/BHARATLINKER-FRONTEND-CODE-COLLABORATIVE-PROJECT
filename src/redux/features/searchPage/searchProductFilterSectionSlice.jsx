import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBrands: [],
  selectedCategories: [],
};

const searchProductsFilterSectionSlice = createSlice({
  name: 'searchproductsfiltersection',
  initialState,
  reducers: {
    toggleSearchProductsCategory: (state, action) => {
        const category = action.payload.toLowerCase(); 
        if (state.selectedCategories.includes(category)) {
            state.selectedCategories = state.selectedCategories.filter(item => item !== category);
        } else {
            state.selectedCategories.push(category);
        }
    },
    toggleSearchProductsBrand: (state, action) => {
      const brand = action.payload;
      if (state.selectedBrands.includes(brand)) {
        state.selectedBrands = state.selectedBrands.filter(
          (item) => item !== brand
        );
      } else {
        state.selectedBrands.push(brand);
      }
    },
    resetSearchProductsFilters: (state) => {
      state.selectedBrands = [];
      state.selectedCategories = [];
    },
  },
});

export const {
  toggleSearchProductsCategory,
  toggleSearchProductsBrand,
  resetSearchProductsFilters,
} = searchProductsFilterSectionSlice.actions;

export default searchProductsFilterSectionSlice.reducer;
