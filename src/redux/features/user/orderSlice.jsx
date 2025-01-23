import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByUserId, updateOrderState } from '../../../appWrite/order/order.js';
import searchShopService from '../../../appWrite/searchShop.js';

// Constants
const stateOrder = {
  dispatched: 1,
  accepted: 2,
  pending: 3,
  canceled: 4,
  delivered: 5,
};

// Async Thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const orders = await getOrderByUserId(userId);

      // Sort orders by update date and state
      const sortedOrders = orders
        .sort((a, b) => new Date(b.$updatedAt) - new Date(a.$updatedAt))
        .sort((a, b) => (stateOrder[a.state] || 6) - (stateOrder[b.state] || 6));

      return sortedOrders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for updating the order state (e.g., canceling an order)
export const cancelUserOrder = createAsyncThunk(
  'userOrders/cancelUserOrder',
  async (orderId, { rejectWithValue }) => {
    console.log(orderId)
    try {
      await updateOrderState(orderId, 'canceled');
      return orderId;
    } catch (error) {
      console.error('Error canceling order:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for fetching shop details by ID
export const fetchShopDetailsById = createAsyncThunk(
  'userOrders/fetchShopDetailsById',
  async (shopId, { rejectWithValue }) => {
    try {
      const shop = await searchShopService.getShopById(shopId);
      return shop;
    } catch (error) {
      console.error('Error fetching shop:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  orders: [],
  shop: [],
  loading: { orders: false, shop: false },
  error: { orders: null, shop: null },
};

// Slice
const userOrderSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch user orders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload;
      });

    // Cancel user order
    builder
      .addCase(cancelUserOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order.$id === action.payload
            ? { ...order, state: 'canceled', $updatedAt: new Date().toISOString() }
            : order
        );
      })
      .addCase(cancelUserOrder.rejected, (state, action) => {
        state.error.orders = action.payload;
      });

    // Fetch shop by ID
    builder
      .addCase(fetchShopDetailsById.pending, (state) => {
        state.loading.shop = true;
        state.error.shop = null;
      })
      .addCase(fetchShopDetailsById.fulfilled, (state, action) => {
        state.loading.shop = false;
        const shopExists = state.shop.find((s) => s.$id === action.payload.$id);
        if (!shopExists) {
          state.shop.push(action.payload);
        }
      })
      .addCase(fetchShopDetailsById.rejected, (state, action) => {
        state.loading.shop = false;
        state.error.shop = action.payload;
      });
  },
});

export default userOrderSlice.reducer;
