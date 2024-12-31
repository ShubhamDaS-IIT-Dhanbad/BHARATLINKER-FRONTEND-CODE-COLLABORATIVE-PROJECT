// src/redux/features/refurbishedProductsSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchRefurbishedProductService from '../../appWrite/searchRefurbished.js';

// Async thunk for fetching refurbished products
export const fetchRefurbishedProducts = createAsyncThunk(
  'refurbishedProducts/fetchRefurbishedProducts',
  async ({ inputValue, selectedCategories, selectedBrands, pinCodes, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
    try {
      const response = await searchRefurbishedProductService.getRefurbishedProducts({
        inputValue, pinCodes, page, productsPerPage, sortByAsc, sortByDesc, selectedCategories, selectedBrands,
      });
      if (response?.documents?.length === 0) {
        return {
          refurbishedProducts: [],
          totalPages: 0,
          productsPerPage
        };
      }
      if (response.documents && response.total) {
        return {

          refurbishedProducts: response.documents,
          productsPerPage,
          totalPages: response.total || 0,
        };
      } else {
        return rejectWithValue('Invalid data structure in response');
      }
    } catch (error) {
      console.error("Error fetching refurbished products:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadMoreRefurbishedProducts = createAsyncThunk(
  'refurbishedProducts/loadMoreRefurbishedProducts',
  async ({ inputValue, selectedCategories, selectedBrands, pinCodes, page, productsPerPage, sortByAsc, sortByDesc }, { rejectWithValue }) => {
    try {
      const response = await searchRefurbishedProductService.getRefurbishedProducts({
        inputValue, pinCodes, page, productsPerPage, sortByAsc, sortByDesc, selectedCategories, selectedBrands,
      });

      // Check if response has refurbished products and total pages
      if (response.documents && response.total) {
        return {
          refurbishedProducts: response.documents,
          productsPerPage,
          totalPages: response.total || 0,
        };
      } else {
        return rejectWithValue('Invalid data structure in response');
      }
    } catch (error) {
      console.error("Error loading more refurbished products:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create slice for refurbished products
const refurbishedProductsSlice = createSlice({
  name: 'refurbishedproducts',
  initialState: {
    refurbishedProducts: [],
    loading: true,
    currentPage: 1,
    totalPages: 1,
    hasMoreProducts: true,
    error: null,
    loadingMoreProducts: false, // Added this state for load more functionality
  },
  reducers: {
    resetRefurbishedProducts: (state) => {
      state.refurbishedProducts = [];
      state.loading = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasMoreProducts = true;
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Set current page
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefurbishedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefurbishedProducts.fulfilled, (state, action) => {
        const { refurbishedProducts, totalPages, productsPerPage } = action.payload;
        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) => !state.refurbishedProducts.some(existingProduct => existingProduct.$id === product.$id)
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.totalPages = totalPages;
          state.hasMoreProducts = state.currentPage *  productsPerPage < totalPages;
        } else {
          state.hasMoreProducts = false;
        }
        state.loading = false;
      })
      .addCase(fetchRefurbishedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Capture error message
      })

      // Load more refurbished products
      .addCase(loadMoreRefurbishedProducts.pending, (state) => {
        state.loadingMoreProducts = true;
        state.error = null;
      })
      .addCase(loadMoreRefurbishedProducts.fulfilled, (state, action) => {
        const { refurbishedProducts, totalPages, productsPerPage } = action.payload;
        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) => !state.refurbishedProducts.some(existingProduct => existingProduct.$id === product.$id)
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.totalPages = totalPages;
          state.currentPage += 1;
          state.hasMoreProducts = state.currentPage *  productsPerPage < totalPages;
        } else {
          state.hasMoreProducts = false;
        }
        state.loadingMoreProducts = false;
      })
      .addCase(loadMoreRefurbishedProducts.rejected, (state, action) => {
        state.loadingMoreProducts = false;
        state.error = action.payload || 'Something went wrong';
        state.hasMoreProducts = false;
      });
  },
});

// Export actions
export const { resetRefurbishedProducts, setCurrentPage } = refurbishedProductsSlice.actions;
export default refurbishedProductsSlice.reducer;
