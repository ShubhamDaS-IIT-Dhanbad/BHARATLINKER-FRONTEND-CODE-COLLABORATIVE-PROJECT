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
    statuses = ['confirmed', 'dispatched'];
  }
  const response = await getOrderByShopId(shopId, statuses, page);
  const totalDocument = response.total;
  return { documents: response.documents, total: totalDocument };
};

// Async thunks for fetching orders
export const fetchOrdersByStatus = createAsyncThunk(
  'retailerorders/fetchOrdersByStatus',
  async ({ shopId, status, page }, { rejectWithValue }) => {
    try {
      const { documents, total } = await fetchOrders(shopId, status, page);

      return { documents, total, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
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
      return rejectWithValue(error.response?.data || 'Failed to load more orders');
    }
  }
);

const ordersSlice = createSlice({
  name: 'retailerorders',
  initialState,
  reducers: {
    //orderStateArrayName this is the namr of the initialState 
    deleteOrder: (state, action) => {
      const { orderId, orderStateArrayName } = action.payload;
      // Find the state slice corresponding to the orderStateArrayName and filter out the order with the given orderId
      state[`${orderStateArrayName}Orders`].data = state[`${orderStateArrayName}Orders`].data.filter(
        (order) => order.$id !== orderId
      );
    },
    updateOrder: (state, action) => {
      const { orderId, updatedOrderData, orderStateArrayName } = action.payload;
      const orderIndex = state[`${orderStateArrayName}Orders`].data.findIndex(
        (order) => order.$id === orderId
      );

      // If the order is found, update it with the new data
      if (orderIndex !== -1) {
        state[`${orderStateArrayName}Orders`].data[orderIndex] = {
          ...state[`${orderStateArrayName}Orders`].data[orderIndex],
          ...updatedOrderData,
        };
      } else {
        // If the order is not found, add the new order to the list
        state[`${orderStateArrayName}Orders`].data.push(updatedOrderData);
      }
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByStatus.pending, (state, action) => {
        const { status } = action.meta.arg;
        state[`${status}Orders`].loading = true;
        state[`${status}Orders`].error = null;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        const { status, documents} = action.payload;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].data = documents;

        if (documents.length < ordersPerPage ) {
          state[`${status}Orders`].hasMore = false;
        }
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
        const { status, documents, page } = action.payload;
        state[`${status}Orders`].loading = false;

        // Filter out any duplicates based on a unique order identifier (e.g., order ID)
        const newOrders = documents.filter(doc =>
          !state[`${status}Orders`].data.some(existingOrder => existingOrder.$id === doc.$id)
        );

        state[`${status}Orders`].data = [
          ...state[`${status}Orders`].data,
          ...newOrders,
        ];
        state[`${status}Orders`].currentPage = page;

        if (documents.length < ordersPerPage ) {
          state[`${status}Orders`].hasMore = false;
        }
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
