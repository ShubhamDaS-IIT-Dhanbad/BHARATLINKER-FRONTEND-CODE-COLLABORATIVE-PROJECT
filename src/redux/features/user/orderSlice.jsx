import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByUserId, updateOrderState } from '../../../appWrite/order/order.js';

// Async Thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const orders = await getOrderByUserId(userId);

      // Sort orders by update date (most recent first)
      const sortedOrders = orders.sort(
        (a, b) => new Date(b.$updatedAt) - new Date(a.$updatedAt)
      );

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
    try {
      await updateOrderState(orderId, 'canceled');
      return orderId;
    } catch (error) {
      console.error('Error canceling order:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  orders: [],
  loading: false,
  error: null,
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
    
        const stateOrder = {
            dispatched: 1,
            accepted:2,
            pending: 3,
            canceled: 4,
            delivered:5,
        };
        const sortedOrders = action.payload.sort((a, b) => {
            return (stateOrder[a.state] || 6) - (stateOrder[b.state] || 6);
        });
        state.orders = sortedOrders;
    })
    
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
        state.error = action.payload;
      });
  },
});

export default userOrderSlice.reducer;
