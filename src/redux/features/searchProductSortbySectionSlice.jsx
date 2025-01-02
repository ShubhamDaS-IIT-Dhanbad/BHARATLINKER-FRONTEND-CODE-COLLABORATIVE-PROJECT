// src/features/searchProductSortBySectionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sortByAsc: false, // Default sort order: ascending
    sortByDesc: false, // Default sort order: descending
    priceRange: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }, // Default price range
};

const searchProductSortBySectionSlice = createSlice({
    name: 'searchproductsortbysection',
    initialState,
    reducers: {
        toggleSortOrder: (state, action) => {
            const order = action.payload;
            console.log(order)
            if (order === 'asc') {
                if (state.sortByAsc) {
                    state.sortByAsc = false;

                } else {
                    state.sortByAsc = true;
                }
                if(state.sortByDesc) state.sortByAsc = false;
            } else if (order === 'desc') {
                if (state.sortByDesc) {
                    state.sortByDesc = false;

                } else {
                    state.sortByDesc = true;
                    
                    
                }
                if(state.sortByAsc) state.sortByAsc = false;
            }
            console.log( state.sortByDesc, state.sortByAsc)
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
