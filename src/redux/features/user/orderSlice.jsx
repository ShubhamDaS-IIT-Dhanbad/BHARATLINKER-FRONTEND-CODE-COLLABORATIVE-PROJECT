import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByUserId } from '../../../appWrite/order/order.js';

const ordersPerPage = 10;

const initialState = {
  loading :false,
  pendingOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 1 },
  confirmedOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 1 },
  deliveredOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 1 },
  canceledOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 1 },
};

// Fetch orders based on status and page
const fetchOrders = async (phoneNumber, status, page) => {
  let statuses = [status];
  if (status === 'confirmed') statuses = ['confirmed', 'dispatched'];
  
  const response = await getOrderByUserId(phoneNumber, statuses, page);
  return { documents: response.documents, total: response.total };
};

// Fetch orders by status
export const fetchOrdersByStatus = createAsyncThunk(
  'userorders/fetchOrdersByStatus',
  async ({ phoneNumber, status, page }, { rejectWithValue }) => {
    try {
      const { documents, total } = await fetchOrders(phoneNumber, status, page);
      return { documents, total, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// Load more orders
export const loadMoreOrders = createAsyncThunk(
  'userorders/loadMoreOrders',
  async ({ phoneNumber, status, page }, { rejectWithValue }) => {
    try {
      const { documents, total } = await fetchOrders(phoneNumber, status, page);
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
      const orderArray = state[`${orderStateArrayName}Orders`].data;
    
      const orderIndex = orderArray.findIndex((order) => order.$id === orderId);
    
      if (orderIndex !== -1) {
        orderArray[orderIndex] = { ...orderArray[orderIndex], ...updatedOrderData };
      } else {
        orderArray.push(updatedOrderData);
      }
      orderArray.sort((a, b) => {
        if (a.$id === orderId) return -1;
        if (b.$id === orderId) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    }
    
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByStatus.pending, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].loading = true;
        state[`${status}Orders`].error = null;
        state.loading=true;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        const { status, documents } = action.payload;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].data = documents;
        state[`${status}Orders`].hasMore = documents.length >= ordersPerPage;
        state.loading=false;
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].error = action.payload;
        console.log("op")
        state.loading=false;
      })

      // Load More Orders
      .addCase(loadMoreOrders.pending, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].error = null;
        state.loading=true;
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
        state.loading=false;
      })
      .addCase(loadMoreOrders.rejected, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].error = action.payload;
        state.loading=false;
      });
  },
});

export const { deleteOrder, updateOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
