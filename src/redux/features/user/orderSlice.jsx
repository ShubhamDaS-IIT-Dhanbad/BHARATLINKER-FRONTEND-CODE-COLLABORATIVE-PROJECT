// orderSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByUserId } from '../../../appWrite/order/order.js';

const ORDERS_PER_PAGE = 10;

const initialState = {
  loading: false,
  pendingOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 0 },  // Changed to 0
  confirmedOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 0 }, // Changed to 0
  dispatchedOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 0 }, // Changed to 0
  deliveredOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 0 }, // Changed to 0
  canceledOrders: { data: [], loading: false, error: null, hasMore: true, currentPage: 0 },  // Changed to 0
};

const fetchOrders = async (phoneNumber, status, page) => {
  const response = await getOrderByUserId(phoneNumber, status, page);
  return { documents: response.documents || [], total: response.total || 0 };  // Added fallbacks
};

export const fetchOrdersByStatus = createAsyncThunk(
  'userorders/fetchOrdersByStatus',
  async ({ phoneNumber, status, page }, { rejectWithValue }) => {
    try {
      const response = await fetchOrders(phoneNumber, status, page);
      return { ...response, status, page };  // Include page in return
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const loadMoreOrders = createAsyncThunk(
  'userorders/loadMoreOrders',
  async ({ phoneNumber, status, page }, { rejectWithValue }) => {
    try {
      const response = await fetchOrders(phoneNumber, status, page);
      return { ...response, status, page };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load more orders');
    }
  }
);

const ordersSlice = createSlice({
  name: 'userorders',
  initialState,
  reducers: {
    deleteOrder: (state, action) => {
      const { orderId, orderStateArrayName } = action.payload;
      const orderState = state[`${orderStateArrayName}Orders`];
      if (orderState) {
        orderState.data = orderState.data.filter(
          (order) => order.$id !== orderId
        );
      }
    },
    updateOrder: (state, action) => {
      const { orderId, updatedOrderData, orderStateArrayName } = action.payload;
      const orderState = state[`${orderStateArrayName}Orders`];
      if (!orderState) return;

      const orderArray = orderState.data;
      const orderIndex = orderArray.findIndex((order) => order.$id === orderId);
      
      if (orderIndex !== -1) {
        orderArray[orderIndex] = { ...orderArray[orderIndex], ...updatedOrderData };
      } else {
        orderArray.push({ ...updatedOrderData, $id: orderId });  // Ensure $id is included
      }
      orderArray.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));  // Added fallback
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByStatus.pending, (state, action) => {
        const { status } = action.meta.arg;
        state.loading = true;
        state[`${status}Orders`].loading = true;
        state[`${status}Orders`].error = null;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        const { status, documents, total, page } = action.payload;
        const orderState = state[`${status}Orders`];
        state.loading = false;
        orderState.loading = false;
        orderState.data = documents;
        orderState.currentPage = page;
        orderState.hasMore = documents.length === ORDERS_PER_PAGE && 
          documents.length < total;
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        const { status } = action.meta.arg;
        state.loading = false;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].error = action.payload;
      })
      .addCase(loadMoreOrders.pending, (state, action) => {
        const { status } = action.meta.arg;
        state.loading = true;
        state[`${status}Orders`].loading = true;
        state[`${status}Orders`].error = null;
      })
      .addCase(loadMoreOrders.fulfilled, (state, action) => {
        const { status, documents, total, page } = action.payload;
        const orderState = state[`${status}Orders`];
        state.loading = false;
        orderState.loading = false;
        const existingOrderIds = new Set(orderState.data.map(order => order.$id));
        const newOrders = documents.filter(doc => !existingOrderIds.has(doc.$id));
        orderState.data = [...orderState.data, ...newOrders];
        orderState.currentPage = page;
        orderState.hasMore = documents.length === ORDERS_PER_PAGE && 
          orderState.data.length < total;
      })
      .addCase(loadMoreOrders.rejected, (state, action) => {
        const { status } = action.meta.arg;
        state.loading = false;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].error = action.payload;
      });
  },
});

export const { deleteOrder, updateOrder } = ordersSlice.actions;
export default ordersSlice.reducer;