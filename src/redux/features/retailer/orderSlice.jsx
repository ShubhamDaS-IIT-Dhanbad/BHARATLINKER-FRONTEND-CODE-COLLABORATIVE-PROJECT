import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByShopId } from '../../../appWrite/order/order.js';

const ordersPerPage = 10;

const initialState = {
  pendingOrders: {
    data: [],
    loading: false,
    error: null,
    hasMore: true,
    fetched:false,
    currentPage: 1,
  },
  confirmedOrders: {
    data: [],
    loading: false,
    error: null,
    fetched:false,
    hasMore: true,
    currentPage: 1,
  },
  dispatchedOrders: {
    data: [],
    loading: false,
    fetched:false,
    error: null,
    hasMore: true,
    currentPage: 1,
  },
  deliveredOrders: {
    data: [],
    loading: false,
    error: null,
    fetched:false,
    hasMore: true,
    currentPage: 1,
  },
  canceledOrders: {
    data: [],
    loading: false,
    error: null,
    fetched:false,
    hasMore: true,
    currentPage: 1,
  },
};

// Fetch orders with pagination
const fetchOrders = async (shopId, status, page) => {
  const statuses = [status];
  const response = await getOrderByShopId(shopId, statuses, page, ordersPerPage);
  return { documents: response.documents, total: response.total };
};

// Async thunk for initial fetch
export const fetchOrdersByStatus = createAsyncThunk(
  'retailerorders/fetchOrdersByStatus',
  async ({ shopId, status, page }, { rejectWithValue }) => {
   console.log("here")
    try {
      const { documents, total } = await fetchOrders(shopId, status, page);
      return { documents, total, status };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

// Async thunk for loading more orders
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

const validStatuses = ['pending', 'confirmed', 'dispatched', 'delivered', 'canceled'];

const ordersSlice = createSlice({
  name: 'retailerorders',
  initialState,
  reducers: {
    deleteOrder: (state, action) => {
      const { orderId, orderStateArrayName } = action.payload;
      const statusKey = `${orderStateArrayName}Orders`;
      if (validStatuses.includes(orderStateArrayName) && state[statusKey]) {
        state[statusKey].data = state[statusKey].data.filter(
          (order) => order.$id !== orderId
        );
      }
    },
    updateOrder: (state, action) => {
      const { orderId, updatedOrderData, orderStateArrayName } = action.payload;
      const statusKey = `${orderStateArrayName}Orders`;
      if (validStatuses.includes(orderStateArrayName) && state[statusKey]) {
        const orderArray = state[statusKey].data;
        const orderIndex = orderArray.findIndex((order) => order.$id === orderId);

        if (orderIndex !== -1) {
          orderArray[orderIndex] = { ...orderArray[orderIndex], ...updatedOrderData };
        } else {
          orderArray.push(updatedOrderData);
        }
        orderArray.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }
    },
    resetShopOrders: (state) => {
      state.pendingOrders = {
        data: [],
        loading: false,
        error: null,
        hasMore: true,
        currentPage: 1,
      };
      state.confirmedOrders = {
        data: [],
        loading: false,
        error: null,
        hasMore: true,
        currentPage: 1,
      };
      state.dispatchedOrders = {
        data: [],
        loading: false,
        error: null,
        hasMore: true,
        currentPage: 1,
      };
      state.deliveredOrders = {
        data: [],
        loading: false,
        error: null,
        hasMore: true,
        currentPage: 1,
      };
      state.canceledOrders = {
        data: [],
        loading: false,
        error: null,
        hasMore: true,
        currentPage: 1,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrdersByStatus.pending, (state, action) => {
        const { status } = action.meta.arg;
        const statusKey = `${status}Orders`;
        if (validStatuses.includes(status) && state[statusKey]) {
          state[statusKey].loading = true;
          state[statusKey].error = null;
        } else {
          console.warn(`Invalid or undefined status in fetchOrdersByStatus.pending: ${status}`);
        }
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        const { status, documents, total } = action.payload;
        const statusKey = `${status}Orders`;
        if (validStatuses.includes(status) && state[statusKey]) {
          state[statusKey].loading = false;
          state[statusKey].data = documents;
          state[statusKey].hasMore = documents.length === ordersPerPage && documents.length < total;
          state[statusKey].currentPage = 1;
          state[statusKey].fetched=true;
        } else {
          console.warn(`Invalid or undefined status in fetchOrdersByStatus.fulfilled: ${status}`);
        }
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        const { status } = action.meta.arg;
        const statusKey = `${status}Orders`;
        if (validStatuses.includes(status) && state[statusKey]) {
          state[statusKey].loading = false;
          state[statusKey].error = action.payload;
        } else {
          console.warn(`Invalid or undefined status in fetchOrdersByStatus.rejected: ${status}`);
        }
      })
      // Load More Orders
      .addCase(loadMoreOrders.pending, (state, action) => {
        const { status } = action.meta.arg;
        const statusKey = `${status}Orders`;
        if (validStatuses.includes(status) && state[statusKey]) {
          state[statusKey].loading = true;
        } else {
          console.warn(`Invalid or undefined status in loadMoreOrders.pending: ${status}`);
        }
      })
      .addCase(loadMoreOrders.fulfilled, (state, action) => {
        const { status, documents, total, page } = action.payload;
        const statusKey = `${status}Orders`;
        if (validStatuses.includes(status) && state[statusKey]) {
          state[statusKey].loading = false;
          const newOrders = documents.filter(
            (doc) => !state[statusKey].data.some((existing) => existing.$id === doc.$id)
          );
          state[statusKey].data = [...state[statusKey].data, ...newOrders];
          state[statusKey].currentPage = page;
          state[statusKey].hasMore = newOrders.length === ordersPerPage && state[statusKey].data.length < total;
        } else {
          console.warn(`Invalid or undefined status in loadMoreOrders.fulfilled: ${status}`);
        }
      })
      .addCase(loadMoreOrders.rejected, (state, action) => {
        const { status } = action.meta.arg;
        const statusKey = `${status}Orders`;
        if (validStatuses.includes(status) && state[statusKey]) {
          state[statusKey].loading = false;
          state[statusKey].error = action.payload;
        } else {
          console.warn(`Invalid or undefined status in loadMoreOrders.rejected: ${status}`);
        }
      });
  },
});

export const { deleteOrder, updateOrder, resetShopOrders } = ordersSlice.actions;
export default ordersSlice.reducer;