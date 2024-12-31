import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchTerm: '',        
    selectedCategories: [],  
    selectedBrands: [],     
};

const searchProductFilterSectionSlice = createSlice({
    name: 'searchproductfiltersection',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        toggleCategory: (state, action) => {
            const category = action.payload;
            if (state.selectedCategories.includes(category)) {
                state.selectedCategories = state.selectedCategories.filter(item => item !== category);
            } else {
                state.selectedCategories.push(category);
            }
        },
        toggleBrand: (state, action) => {
            const brand = action.payload;
            if (state.selectedBrands.includes(brand)) {
                state.selectedBrands = state.selectedBrands.filter(item => item !== brand);
            } else {
                state.selectedBrands.push(brand);
            }
        },
        resetFilters: (state) => {
            state.searchTerm = '';
            state.selectedCategories = [];
            state.selectedBrands = [];
        },
    },
});

export const {
    setSearchTerm,
    toggleCategory,
    toggleBrand,
    resetFilters,
} = searchProductFilterSectionSlice.actions;

export default searchProductFilterSectionSlice.reducer;
