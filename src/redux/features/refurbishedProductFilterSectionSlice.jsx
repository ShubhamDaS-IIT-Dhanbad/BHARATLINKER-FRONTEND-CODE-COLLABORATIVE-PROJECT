import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchTerm: '',         // Stores the search term for refurbished products
    selectedCategories: [], // Stores selected categories for filtering
};

const refurbishedFilterSectionSlice = createSlice({
    name: 'refurbishedproductfiltersection',
    initialState,
    reducers: {
        setRefurbishedSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        toggleRefurbishedCategory: (state, action) => {
            const category = action.payload.toUpperCase();
            if (state.selectedCategories.includes(category)) {
                state.selectedCategories = state.selectedCategories.filter(item => item !== category);
            } else {
                state.selectedCategories.push(category.toUpperCase());
            }
        },
        resetRefurbishedFilters: (state) => {
            state.searchTerm = '';
            state.selectedCategories = [];
        },
    },
});

export const {
    setRefurbishedSearchTerm,
    toggleRefurbishedCategory,
    resetRefurbishedFilters,
} = refurbishedFilterSectionSlice.actions;

export default refurbishedFilterSectionSlice.reducer;
