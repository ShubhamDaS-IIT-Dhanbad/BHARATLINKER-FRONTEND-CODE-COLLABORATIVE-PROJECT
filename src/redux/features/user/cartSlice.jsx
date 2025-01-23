import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserCartByPhoneNumber, updateCartByPhoneNumber } from "../../../appWrite/userData/userData.js";
import { placeOrderProvider } from '../../../appWrite/order/order.js'


// Async Thunk for fetching the user cart data by phone number
export const fetchUserCart = createAsyncThunk(
    "usercart/fetchUserCart",
    async (phoneNumber, { rejectWithValue }) => {
        try {
            const cart = await fetchUserCartByPhoneNumber(phoneNumber);
            return JSON.parse(cart);
        } catch (error) {
            console.error("Error fetching cart data:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async Thunk for updating the cart after changes
export const updateUserCart = createAsyncThunk(
    "usercart/updateUserCart",
    async ({phoneNumber,cart}, { rejectWithValue }) => {
        try {
           const cartData= await updateCartByPhoneNumber({phoneNumber,cart});
            return cartData;
        } catch (error) {
            console.error("Error updating cart:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async action for updating cart state and syncing with the backend
export const updateCartStateAsync = (newItem) => async (dispatch, getState) => {
    try {
        dispatch(cartSlice.actions.updateCartStateLocal(newItem));
    
        const state = getState();
    
        const phoneNumber = newItem.phoneNumber;
        const cart = state.userCart.cart.length > 0 
            ? JSON.stringify(state.userCart.cart) 
            : JSON.stringify([]);
        await dispatch(updateUserCart({ phoneNumber, cart }));
    } catch (error) {
        console.error("Error in updateCartStateAsync:", error);
    }
    
};
// Async Thunk for placing an order
export const placeOrder = createAsyncThunk(
    "usercart/placeOrder",
    async ({
        userId, shopId, productId, count, price, discountedPrice, address,
        userLat, userLong, name, img
    }, { rejectWithValue }) => {
        try {
            await placeOrderProvider(
                userId, shopId, productId, count, price, discountedPrice,
                address, userLat, userLong, name, img
            );
            return { success: true };
        } catch (error) {
            console.error("Error placing order:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
const cartSlice = createSlice({
    name: "usercart",
    initialState: {
        cart: [],
        totalQuantity: 0,
        totalPrice: 0,
        cartLoading: false,
        orderSuccess: false, // Track order success
        orderLoading: false, // Track order loading state
    },
    reducers: {
        updateCartStateLocal: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.cart.find(item => item.productId === newItem.productId);
        
            if (newItem.quantity === 0) {
                state.cart = state.cart.filter(item => item.productId !== newItem.productId);
            } else if (existingItem) {
                existingItem.quantity = newItem.quantity;
                existingItem.discountedPrice = existingItem.discountedPrice;
            } else {
                state.cart.push({
                    ...newItem
                });
            }
        
            // If the cart length is 0, make it an empty array
            if (state.cart.length === 0) {
                state.cart = [];
            }
        
            state.totalQuantity = state.cart.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = state.cart.reduce((total, item) => total + item.discountedPrice * item.quantity, 0);
        } 
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserCart.pending, (state) => {
                state.cartLoading = true;
            })
            .addCase(fetchUserCart.fulfilled, (state, action) => {
                state.cartLoading = false;
                state.cart = action.payload;

                state.totalQuantity = state.cart.reduce((total, item) => total + item.quantity, 0);
                state.totalPrice = state.cart.reduce((total, item) => total + item.discountedPrice * item.quantity, 0);
            })
            .addCase(fetchUserCart.rejected, (state, action) => {
                state.cartLoading = false;
                console.error("Failed to fetch user cart:", action.payload);
            })





            .addCase(updateUserCart.pending, (state) => {
                state.cartLoading = true;
            })
            .addCase(updateUserCart.fulfilled, (state) => {
                state.cartLoading = false;
            })
            .addCase(updateUserCart.rejected, (state, action) => {
                state.cartLoading = false;
                console.error("Failed to update user cart:", action.payload);
            })




            // Handle placing the order
            .addCase(placeOrder.pending, (state) => {
                state.orderLoading = true;
            })
            .addCase(placeOrder.fulfilled, (state) => {
                state.orderLoading = false;
                state.orderSuccess = true; // Set success flag when the order is placed
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.orderLoading = false;
                console.error("Failed to place order:", action.payload);
            });
    },
});

export const { updateCartStateLocal } = cartSlice.actions;
export default cartSlice.reducer;
