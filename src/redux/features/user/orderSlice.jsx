import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByUserId } from '../../../appWrite/order/order.js';

const ORDERS_PER_PAGE = 10;

const initialState = {
  loading: false,
  orders: [],
  error: null,
  hasMore: true,
  currentPage: 0,
  lastFetchTimestamp: null,
};

export const fetchUserOrders = createAsyncThunk(
  'userorders/fetchUserOrders',
  async ({ phoneNumber, page }, { rejectWithValue, signal }) => {
    try {
      const response = await getOrderByUserId(phoneNumber, page, ORDERS_PER_PAGE);
      return { ...response, page };
    } catch (error) {
      if (signal.aborted) {
        return rejectWithValue('Request aborted');
      }
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const loadMoreOrders = createAsyncThunk(
  'userorders/loadMoreOrders',
  async ({ phoneNumber, page }, { rejectWithValue, signal }) => {
    try {
      const response = await getOrderByUserId(phoneNumber, page, ORDERS_PER_PAGE);
      return { ...response, page };
    } catch (error) {
      if (signal.aborted) {
        return rejectWithValue('Request aborted');
      }
      return rejectWithValue(error.message || 'Failed to load more orders');
    }
  }
);

const ordersSlice = createSlice({
  name: 'userorders',
  initialState,
  reducers: {
    deleteOrder: (state, action) => {
      const orderId = action.payload;
      state.orders = state.orders.filter((order) => order.$id !== orderId);
      state.total = state.orders.length;
    },
    updateOrder: (state, action) => {
      const { orderId, updatedOrderData } = action.payload;
      const orderIndex = state.orders.findIndex((order) => order.$id === orderId);
      
      if (orderIndex !== -1) {
        state.orders[orderIndex] = { 
          ...state.orders[orderIndex], 
          ...updatedOrderData,
          $updatedAt: new Date().toISOString()
        };
      } else {
        state.orders.push({ 
          ...updatedOrderData, 
          $id: orderId,
          $updatedAt: new Date().toISOString()
        });
      }
      state.orders.sort((a, b) => new Date(b.$updatedAt || 0) - new Date(a.$updatedAt || 0));
    },
    resetOrders: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        const { documents, total, page } = action.payload;
        state.loading = false;
        state.orders = documents;
        state.currentPage = page;
        state.hasMore = documents.length === ORDERS_PER_PAGE && 
          documents.length < total;
        state.lastFetchTimestamp = Date.now();
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
        state.hasMore = false;
      })
      .addCase(loadMoreOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreOrders.fulfilled, (state, action) => {
        const { documents, total, page } = action.payload;
        state.loading = false;
        const existingOrderIds = new Set(state.orders.map(order => order.$id));
        const newOrders = documents.filter(doc => !existingOrderIds.has(doc.$id));
        state.orders = [...state.orders, ...newOrders];
        state.currentPage = page;
        state.hasMore = documents.length === ORDERS_PER_PAGE && 
          state.orders.length < total;
        state.lastFetchTimestamp = Date.now();
      })
      .addCase(loadMoreOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { deleteOrder, updateOrder, resetOrders } = ordersSlice.actions;
export default ordersSlice.reducer;