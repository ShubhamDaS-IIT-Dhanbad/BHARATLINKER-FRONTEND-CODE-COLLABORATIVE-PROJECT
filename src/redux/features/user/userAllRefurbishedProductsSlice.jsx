import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userRefurbishedProductsService from '../../../appWrite/userProducts/userRefurbishedProducts.js';

// Async thunk for fetching refurbished products
export const fetchUserRefurbishedProducts = createAsyncThunk(
  'userRefurbishedProducts/fetchUserRefurbishedProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userRefurbishedProductsService.getUserRefurbishedProducts(params);

      if (response?.products?.length === 0) {
        return {
          refurbishedProducts: [],
          totalPages: 0,
          productsPerPage: params.productsPerPage,
        };
      }

      if (response.products) {
        return {
          refurbishedProducts: response.products,
          nbook: response.nbook,
          nmodule: response.nmodule,
          ngadgets: response.ngadgets,
          productsPerPage: params.productsPerPage,
          totalPages: Math.ceil(response.products.length / params.productsPerPage),
        };
      } else {
        return rejectWithValue('Invalid data structure in response');
      }
    } catch (error) {
      console.error("Error fetching user refurbished products:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for loading more refurbished products
export const loadMoreUserRefurbishedProducts = createAsyncThunk(
  'userRefurbishedProducts/loadMoreUserRefurbishedProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userRefurbishedProductsService.getUserRefurbishedProducts(params);

      if (response?.products) {
        return {
          refurbishedProducts: response.products,
          productsPerPage: params.productsPerPage,
          totalPages: Math.ceil(response.products.length / params.productsPerPage),
          nbook: response.nbook || 0,
          nmodule: response.nmodule || 0,
          ngadgets: response.ngadgets || 0,
        };
      } else {
        return rejectWithValue('Invalid data structure in response');
      }
    } catch (error) {
      console.error("Error loading more user refurbished products:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create slice for user refurbished products
const userRefurbishedProductsSlice = createSlice({
  name: 'userRefurbishedProducts',
  initialState: {
    refurbishedProducts: [],
    loading: true,
    currentPage: 1,
    totalPages: 1,
    hasMoreProducts: true,
    hasMoreProductsBook: true,
    hasMoreProductsModule: true,
    hasMoreProductsGadgets: true,
    error: null,
    loadingMoreProducts: false, // Added this state for load more functionality
  },
  reducers: {
    resetUserRefurbishedProducts: (state) => {
      state.refurbishedProducts = [];
      state.loading = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasMoreProducts = true;
      state.hasMoreProductsBook = true;
      state.hasMoreProductsModule = true;
      state.hasMoreProductsGadgets = true;
      state.error = null;
      state.loadingMoreProducts = false;
    },
    setCurrentUserPage: (state, action) => {
      state.currentPage = action.payload;
    },
    sortUserRefurbishedProducts: (state, action) => {
      const { asc, desc } = action.payload;
      if (asc) {
        state.refurbishedProducts.sort((a, b) => a.price - b.price);
      } else if (desc) {
        state.refurbishedProducts.sort((a, b) => b.price - a.price);
      }
    },
    deleteProduct: (state, action) => {
      const productId = action.payload;
      state.refurbishedProducts = state.refurbishedProducts.filter(
        (product) => product.$id !== productId.id
      );
    },
    updateProduct: (state, action) => {
      // You can implement update logic here if needed
    },
    addUserRefurbishedProduct: (state, action) => {
      const newProduct = action.payload;
      state.refurbishedProducts = [newProduct, ...state.refurbishedProducts];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRefurbishedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRefurbishedProducts.fulfilled, (state, action) => {
        const { refurbishedProducts, totalPages, nbook, nmodule, ngadgets } = action.payload;

        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) => !state.refurbishedProducts.some(existingProduct => existingProduct.$id === product.$id)
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.totalPages = totalPages;

          state.hasMoreProductsBook = nbook >= 2;
          state.hasMoreProductsModule = nmodule >= 2;
          state.hasMoreProductsGadgets = ngadgets >= 2;

          state.hasMoreProducts = state.hasMoreProductsBook || state.hasMoreProductsModule || state.hasMoreProductsGadgets;
        } else {
          state.hasMoreProducts = false;
        }
        state.loading = false;
      })
      .addCase(fetchUserRefurbishedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(loadMoreUserRefurbishedProducts.pending, (state) => {
        state.loadingMoreProducts = true;
        state.error = null;
      })
      .addCase(loadMoreUserRefurbishedProducts.fulfilled, (state, action) => {
        const { refurbishedProducts, totalPages, nbook, nmodule, ngadgets } = action.payload;

        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) => !state.refurbishedProducts.some(existingProduct => existingProduct.$id === product.$id)
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.totalPages = totalPages;
          state.currentPage += 1;

          state.hasMoreProductsBook = nbook >= 1;
          state.hasMoreProductsModule = nmodule >= 1;
          state.hasMoreProductsGadgets = ngadgets >= 1;

          state.hasMoreProducts = state.hasMoreProductsBook || state.hasMoreProductsModule || state.hasMoreProductsGadgets;
        } else {
          state.hasMoreProducts = false;
        }
        state.loadingMoreProducts = false;
      })
      .addCase(loadMoreUserRefurbishedProducts.rejected, (state, action) => {
        state.loadingMoreProducts = false;
        state.error = action.payload || 'Something went wrong';
        state.hasMoreProducts = false;
      });
  },
});

// Export actions
export const {
  resetUserRefurbishedProducts,
  setCurrentUserPage,
  sortUserRefurbishedProducts,
  deleteProduct,
  updateProduct,
  addUserRefurbishedProduct,
} = userRefurbishedProductsSlice.actions;

export default userRefurbishedProductsSlice.reducer;
