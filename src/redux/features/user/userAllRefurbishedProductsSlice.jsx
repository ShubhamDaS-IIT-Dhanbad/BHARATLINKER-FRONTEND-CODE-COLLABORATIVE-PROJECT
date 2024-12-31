import { createSlice } from '@reduxjs/toolkit';

const userAllRefurbishedProductsSlice = createSlice({
    name: 'userAllRefurbishedProducts',
    initialState: {
        allRefurbishedProducts: [],
        loading: true,
    },
    reducers: {
        addRefurbishedProduct: (state, action) => {
            try {
                action.payload.map((product) => {
                    if (!state.allRefurbishedProducts.includes(product)) {
                        state.allRefurbishedProducts.push(product);
                    }
                });

            } catch (error) {
                console.error("Error adding product:", error);
            }
        },
        removeProductById: (state, action) => {
            state.allRefurbishedProducts = state.allRefurbishedProducts.filter(
                product => product.id !== action.payload
            );
        },
        clearRefurbishedProducts: (state) => {
            state.allRefurbishedProducts = [];
        },
        resetProducts: (state) => {
            state.allRefurbishedProducts = [];
            state.loading = true;
        },
    },
});

// Export the actions
export const {
    addRefurbishedProduct,
    removeProductById,
    clearRefurbishedProducts,
    resetProducts,
} = userAllRefurbishedProductsSlice.actions;

// Export the reducer
export default userAllRefurbishedProductsSlice.reducer;





