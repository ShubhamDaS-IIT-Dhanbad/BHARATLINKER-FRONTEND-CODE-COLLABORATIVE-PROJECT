import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchTerm: '',        
    selectedCategories: [],      
};

const searchShopFilterSectionSlice  = createSlice({
    name: 'searchshopfiltersection',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        toggleCategory: (state, action) => {
            const category = action.payload.toUpperCase();
            if (state.selectedCategories.includes(category)) {
                state.selectedCategories = state.selectedCategories.filter(item => item !== category);
            } else {
                state.selectedCategories.push(category.toUpperCase());
            }
        },
        resetFilters: (state) => {
            state.searchTerm = '';
            state.selectedCategories = [];
        },
    },
});

export const {
    setSearchTerm,
    toggleCategory,
    resetFilters,
} = searchShopFilterSectionSlice .actions;

export default searchShopFilterSectionSlice .reducer;
