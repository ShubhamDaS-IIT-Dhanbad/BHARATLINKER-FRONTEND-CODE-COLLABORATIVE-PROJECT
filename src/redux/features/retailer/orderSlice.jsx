import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByShopId } from '../../../appWrite/order/order.js';

const ordersPerPage = 4;

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

// Generic fetch function
const fetchOrders = async (shopId, status, page) => {
  const response = await getOrderByShopId(shopId, status, page);
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
  reducers: {},
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
        const totalPages = Math.ceil(total / ordersPerPage);
        if (state[`${status}Orders`].currentPage >= totalPages) {
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
        const { status, documents, total, page } = action.payload;
        state[`${status}Orders`].loading = false;
        state[`${status}Orders`].data = [
          ...state[`${status}Orders`].data,
          ...documents,
        ];
        state[`${status}Orders`].currentPage = page;
        const totalPages = Math.ceil(total / ordersPerPage);
        if (page >= totalPages) {
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

export default ordersSlice.reducer;
