import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByUserId, updateOrderState } from '../../../appWrite/order/order.js';

const ordersPerPage = 10;

const initialState = {
  pendingOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 1 },
  confirmedOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 1 },
  deliveredOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 1 },
  canceledOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 1 },
};

// Fetch orders based on status and page
const fetchOrders = async (userId, status, page) => {
  let statuses = [status];
  if (status === 'confirmed') statuses = ['confirmed', 'dispatched'];
  
  const response = await getOrderByUserId(userId, statuses, page);
  return { documents: response.documents, total: response.total };
};

// Fetch orders by status
export const fetchOrdersByStatus = createAsyncThunk(
  'retailerorders/fetchOrdersByStatus',
  async ({ userId, status, page }, { rejectWithValue }) => {
    try {
      const { documents, total } = await fetchOrders(userId, status, page);
      return { documents, total, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// Load more orders
export const loadMoreOrders = createAsyncThunk(
  'retailerorders/loadMoreOrders',
  async ({ userId, status, page }, { rejectWithValue }) => {
    try {
      const { documents, total } = await fetchOrders(userId, status, page);
      return { documents, total, status, page };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to load more orders');
    }
  }
);

// Orders Slice
const ordersSlice = createSlice({
  name: 'userorders',
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
      const orderIndex = state[`${orderStateArrayName}Orders`].data.findIndex(
        (order) => order.$id === orderId
      );

      if (orderIndex !== -1) {
        state[`${orderStateArrayName}Orders`].data[orderIndex] = {
          ...state[`${orderStateArrayName}Orders`].data[orderIndex],
          ...updatedOrderData,
        };
      } else {
        state[`${orderStateArrayName}Orders`].data.push(updatedOrderData);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByStatus.pending, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].loading = true;
        state[`${status}Orders`].error = null;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        const { status, documents } = action.payload;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].data = documents;
        state[`${status}Orders`].hasMore = documents.length >= ordersPerPage;
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].error = action.payload;
      })

      // Load More Orders
      .addCase(loadMoreOrders.pending, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].error = null;
      })
      .addCase(loadMoreOrders.fulfilled, (state, action) => {
        const { status, documents, page } = action.payload;
        const existingOrders = state[`${status}Orders`].data;
        const newOrders = documents.filter(
          (doc) => !existingOrders.some((order) => order.$id === doc.$id)
        );

        state[`${status}Orders`].data = [...existingOrders, ...newOrders];
        state[`${status}Orders`].currentPage = page;
        state[`${status}Orders`].hasMore = documents.length >= ordersPerPage;
      })
      .addCase(loadMoreOrders.rejected, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].error = action.payload;
      });
  },
});

export const { deleteOrder, updateOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
