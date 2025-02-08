import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userRefurbishedProductsService from '../../../appWrite/UserRefurbishedProductService/userRefurbishedProduct.js';

// Async thunk for fetching refurbished products
export const fetchUserRefurbishedProducts = createAsyncThunk(
  'userRefurbishedProducts/fetchUserRefurbishedProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userRefurbishedProductsService.getUserRefurbishedProducts(params);

      if (response?.products?.length === 0) {
        return {
          inputValue: params.inputValue,
          refurbishedProducts: [],
          totalPages: 0,
          productsPerPage: params.productsPerPage,
        };
      }

      if (response.products) {
        return {
          inputValue: params.inputValue,
          refurbishedProducts: response.products,
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
          inputValue: params.query,
          refurbishedProducts: response.products,
          productsPerPage: params.productsPerPage,
          totalPages: Math.ceil(response.products.length / params.productsPerPage),
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
    query: "",
    refurbishedProducts: [],
    loading: false,
    currentPage: 1,
    totalPages: 1,
    hasMoreProducts: true,
    error: null,
    loadingMoreProducts: false,
  },
  reducers: {
    resetUserRefurbishedProducts: (state) => {
      state.refurbishedProducts = [];
      state.loading = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasMoreProducts = true;
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
      const { productId, updatedData } = action.payload;
      state.refurbishedProducts = state.refurbishedProducts.map(product =>
        product.$id === productId ? { ...product, ...updatedData } : product
      );
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
        const { inputValue, refurbishedProducts, totalPages, productsPerPage } = action.payload;
        state.query = inputValue;
        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) =>
              !state.refurbishedProducts.some((existingProduct) => existingProduct.$id === product.$id)
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.totalPages = totalPages;

          if (refurbishedProducts.length < productsPerPage) {
            state.hasMoreProducts = false;
          }
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
        const { inputValue, refurbishedProducts, totalPages, productsPerPage } = action.payload;
        state.query = inputValue;
        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) =>
              !state.refurbishedProducts.some((existingProduct) => existingProduct.$id === product.$id)
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.totalPages = totalPages;
          state.currentPage += 1;

          if (refurbishedProducts.length < productsPerPage) {
            state.hasMoreProducts = false;
          }
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
