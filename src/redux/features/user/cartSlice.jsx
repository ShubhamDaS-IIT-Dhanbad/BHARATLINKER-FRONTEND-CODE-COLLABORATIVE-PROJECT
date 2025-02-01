import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { placeOrderProvider } from '../../../appWrite/order/order.js';
import { addToCart, getCartItems, removeFromCart, updateCartQuantity } from '../../../appWrite/cart/cart.js';
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";

// Async Thunk for fetching the user cart data by phone number
export const fetchUserCart = createAsyncThunk(
    "usercart/fetchUserCart",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getCartItems(userId);
            return response;
        } catch (error) {
            console.error("Error fetching user cart:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
// Throttled fetch function to limit frequent requests
export const throttledFetchUserCart = throttle(async (dispatch, phoneNumber) => {
    try {
        await dispatch(fetchUserCart(phoneNumber));
    } catch (error) {
        console.error("Throttled fetch error:", error);
    }
}, 1000); // 1-second interval








// Async Thunk for adding an item to the cart
export const addToUserCart = createAsyncThunk(
    "usercart/addToUserCart",
    async (cartItem, { rejectWithValue, dispatch }) => {
        try {
            const updatedCart = {
                userId: cartItem.userId,
                productId: cartItem.productId,
                shopId: cartItem.shopId,
                productImage:cartItem.productImage,
                price: cartItem.price,
                discountedPrice: cartItem.discountedPrice || cartItem.price,
                quantity: 1,
            }
            dispatch(updateCartStateLocal({ productId: cartItem.productId, updatedCart }));
            const response = await addToCart(cartItem);
            return response;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
// Async Thunk for removing an item from the cart
export const removeFromUserCart = createAsyncThunk(
    "usercart/removeFromUserCart",
    async ({ cartId, productId }, { rejectWithValue, dispatch }) => {
        try {
            const updatedCart = { quantity: 0 }
            dispatch(updateCartStateLocal({ productId, updatedCart }));
            await removeFromCart(cartId);
            return productId;
        } catch (error) {
            console.error("Error removing from cart:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




// Async Thunk for updating the cart after changes
export const updateUserCart = createAsyncThunk(
    "usercart/updateUserCart",
    async ({ cartId, updatedCart }, { rejectWithValue, dispatch }) => {
        try {
            dispatch(updateCartStateLocal({ productId: updatedCart.productId, updatedCart }));
            await updateCartQuantity(cartId, updatedCart);
            return { cartId, updatedCart };
        } catch (error) {
            console.error("Error updating user cart:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
const debouncedUpdateUserCart = debounce(async (dispatch, cartId, updatedCart) => {
    await dispatch(updateUserCart({ cartId, updatedCart }));
}, 50);
export const updateCartStateAsync = (cartId, updatedCart) => async (dispatch, getState) => {
    debouncedUpdateUserCart(dispatch, cartId, updatedCart);
};




// Async Thunk for placing an order
export const placeOrder = createAsyncThunk(
    "usercart/placeOrder",
    async (
        { userId, shopId, productId, count, price, discountedPrice, address, userLat, userLong, name, img },
        { rejectWithValue }
    ) => {
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
        orderSuccess: false,
        orderLoading: false,
    },
    reducers: {
        updateCartStateLocal: (state, action) => {
            const { productId, updatedCart } = action.payload;
            const existingItemIndex = state.cart.findIndex(item => item.productId === productId);
        
            if (updatedCart.quantity === 0) {
                state.cart = state.cart.filter(item => item.productId !== productId);
            } else if (existingItemIndex !== -1) {
                state.cart = state.cart.map(item =>
                    item.productId === productId ? { ...item, ...updatedCart } : item
                );
            } else {
                state.cart = [...state.cart, updatedCart];
            }
        
            state.totalQuantity = state.cart.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = state.cart.reduce((total, item) => total + item.quantity * item.price, 0);
        },
        
        resetCart: (state) => {
            state.cart = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            state.orderSuccess = false;
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

            .addCase(addToUserCart.fulfilled, (state, action) => {
                const existingItemIndex = state.cart.findIndex(item => item.productId === action.payload.productId);
                if (existingItemIndex !== -1) {
                    state.cart[existingItemIndex] =action.payload;
                } else {
                    state.cart.push(updatedCart);
                }
            })
            .addCase(updateUserCart.fulfilled, (state) => {
                state.cartLoading = false;
            })
            .addCase(updateUserCart.rejected, (state, action) => {
                state.cartLoading = false;
                console.error("Failed to update user cart:", action.payload);
            })



            .addCase(placeOrder.pending, (state) => {
                state.orderLoading = true;
            })
            .addCase(placeOrder.fulfilled, (state) => {
                state.orderLoading = false;
                state.orderSuccess = true;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.orderLoading = false;
                console.error("Failed to place order:", action.payload);
            });
    },
});

export const { updateCartStateLocal, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
