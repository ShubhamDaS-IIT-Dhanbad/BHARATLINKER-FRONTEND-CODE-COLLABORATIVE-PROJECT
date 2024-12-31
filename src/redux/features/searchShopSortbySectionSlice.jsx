// src/features/searchProductSortBySectionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sortByAsc: false, // Default sort order: ascending
    sortByDesc: false, // Default sort order: descending
    priceRange: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }, // Default price range
};

const searchProductSortBySectionSlice = createSlice({
    name: 'searchshopsortbysection',
    initialState,
    reducers: {
        toggleSortOrder: (state, action) => {
            const order = action.payload;

            if (order === 'asc') {
                if (state.sortByAsc) {
                    state.sortByAsc = false;

                } else {
                    state.sortByAsc = true;
                    state.sortByDesc = false; // Reset descending
                }
            } else if (order === 'desc') {
                if (state.sortByDesc) {
                    state.sortByDesc = false;

                } else {
                    state.sortByAsc = false; // Reset ascending
                    state.sortByDesc = true;
                }
            }
        },
        setPriceRange: (state, action) => {
            const { min, max } = action.payload;
            state.priceRange.min = min;
            state.priceRange.max = max;
        },
        resetSortFilters: (state) => {
            return initialState; // Reset to initial state
        },
    },
});

// Export actions
export const {
    toggleSortOrder,
    setPriceRange,
    resetSortFilters,
} = searchProductSortBySectionSlice.actions;

// Export reducer
export default searchProductSortBySectionSlice.reducer;
