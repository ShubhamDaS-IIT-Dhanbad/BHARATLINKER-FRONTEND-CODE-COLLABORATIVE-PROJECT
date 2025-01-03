import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sortByAsc: false, // Default sort order: ascending
    sortByDesc: false, // Default sort order: descending
    products: [], // Array of products
};

const searchProductSortbySectionSlice = createSlice({
    name: 'searchproductsortbysection',
    initialState,
    reducers: {
        toggleSortOrder: (state, action) => {
            const order = action.payload;
            if (order === 'asc') {
                state.sortByAsc = !state.sortByAsc;
                state.sortByDesc = false;
            } else if (order === 'desc') {
                state.sortByDesc = !state.sortByDesc;
                state.sortByAsc = false;
            }
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        }
    },
});

export const { toggleSortOrder, setProducts} = searchProductSortbySectionSlice.actions;

export default searchProductSortbySectionSlice.reducer;
