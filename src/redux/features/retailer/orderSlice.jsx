import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByShopId } from '../../../appWrite/order/order.js';

const ordersPerPage = 10;

const initialState = {
  pendingOrders: {
    data: [],
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1,
  },
  confirmedOrders: {
    data: [],
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1,
  },
  deliveredOrders: {
    data: [],
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1,
  },
  canceledOrders: {
    data: [],
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1,
  },
};

const fetchOrders = async (shopId, status, page) => {
  let statuses = [status];
  if (status === 'confirmed') {
    statuses = ['confirmed', 'dispatched']; // Keep combined logic
  }
  const response = await getOrderByShopId(shopId, statuses, page);
  return { documents: response.documents, total: response.total };
};

// Async thunks for fetching orders
export const fetchOrdersByStatus = createAsyncThunk(
  'retailerorders/fetchOrdersByStatus',
  async ({ shopId, status, page }, { rejectWithValue }) => {
    try {
      const { documents, total } = await fetchOrders(shopId, status, page);
      return { documents, total, status };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const loadMoreOrders = createAsyncThunk(
  'retailerorders/loadMoreOrders',
  async ({ shopId, status, page }, { rejectWithValue }) => {
    try {
      const { documents, total } = await fetchOrders(shopId, status, page);
      return { documents, total, status, page };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load more orders');
    }
  }
);

const ordersSlice = createSlice({
  name: 'retailerorders',
  initialState,
  reducers: {
    deleteOrder: (state, action) => {
      const { orderId, orderStateArrayName } = action.payload;
      state[`${orderStateArrayName}Orders`].data = state[`${orderStateArrayName}Orders`].data.filter(
        (order) => order.$id !== orderId
      );
    },
    updateOrder: (state, action) => {
      const { orderId, updatedOrderData, orderStateArrayName } = action.payload;
      const orderArray = state[`${orderStateArrayName}Orders`].data;
      const orderIndex = orderArray.findIndex((order) => order.$id === orderId);

      if (orderIndex !== -1) {
        orderArray[orderIndex] = { ...orderArray[orderIndex], ...updatedOrderData };
      } else {
        orderArray.push(updatedOrderData);
      }
      orderArray.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrdersByStatus.pending, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].loading = true;
        state[`${status}Orders`].error = null;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        const { status, documents, total } = action.payload;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].data = documents;
        state[`${status}Orders`].hasMore = documents.length === ordersPerPage && state[`${status}Orders`].data.length < total;
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].error = action.payload;
      })

      // Load More Orders
      .addCase(loadMoreOrders.pending, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].loading = true;
      })
      .addCase(loadMoreOrders.fulfilled, (state, action) => {
        const { status, documents, total, page } = action.payload;
        state[`${status}Orders`].loading = false;

        // Prevent duplicates
        const newOrders = documents.filter(
          (doc) => !state[`${status}Orders`].data.some((existing) => existing.$id === doc.$id)
        );

        state[`${status}Orders`].data = [...state[`${status}Orders`].data, ...newOrders];
        state[`${status}Orders`].currentPage = page;
        state[`${status}Orders`].hasMore = newOrders.length === ordersPerPage && state[`${status}Orders`].data.length < total;
      })
      .addCase(loadMoreOrders.rejected, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].error = action.payload;
      });
  },
});

export const { deleteOrder, updateOrder } = ordersSlice.actions;
export default ordersSlice.reducer;