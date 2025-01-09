// src/redux/features/refurbishedProductsSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchRefurbishedProductService from '../../../appWrite/searchRefurbished.js';

// Async thunk for fetching refurbished products
export const fetchRefurbishedProducts = createAsyncThunk(
  'refurbishedProducts/fetchRefurbishedProducts',
  async (
    {
      inputValue,
      userLat ,userLong,radius,
      page,
      productsPerPage,
      sortByAsc,
      sortByDesc,
      selectedCategories,
      selectedBrands,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await searchRefurbishedProductService.getRefurbishedProducts({
        inputValue,userLat ,userLong,radius,
        page,
        productsPerPage,
        sortByAsc,
        sortByDesc,
        selectedCategories,
        selectedBrands,
      });

      if (response?.products) {
        return {
          refurbishedProducts: response.products,
          hasMoreProducts: response.products.length >= productsPerPage, // Corrected check
        };
      } else {
        return rejectWithValue('Invalid data structure in response');
      }
    } catch (error) {
      console.error('Error fetching refurbished products:', error);
      return rejectWithValue(error.response?.data || error.message || 'Unknown error');
    }
  }
);

// Async thunk for loading more refurbished products
export const loadMoreRefurbishedProducts = createAsyncThunk(
  'refurbishedProducts/loadMoreRefurbishedProducts',
  async (
    {
      inputValue,userLat ,userLong,radius,
      page,
      productsPerPage,
      sortByAsc,
      sortByDesc,
      selectedCategories,
      selectedBrands,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await searchRefurbishedProductService.getRefurbishedProducts({
        inputValue,userLat ,userLong,radius,
        page,
        productsPerPage,
        sortByAsc,
        sortByDesc,
        selectedCategories,
        selectedBrands,
      });
      if (response?.products) {
        return {
          refurbishedProducts: response.products,
          hasMoreProducts: response.products.length >= productsPerPage, // Corrected check
        };
      } else {
        return rejectWithValue('Invalid data structure in response');
      }
    } catch (error) {
      console.error('Error loading more refurbished products:', error);
      return rejectWithValue(error.response?.data || error.message || 'Unknown error');
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
    loadingMoreProducts: false,
    sortByAsc: false, // Added default state for sort order
    sortByDesc: false,
  },
  reducers: {
    toggleSortOrder: (state, action) => {
      const order = action.payload;
      if (order === 'asc') {
        state.sortByAsc = !state.sortByAsc;
        state.sortByDesc = false;
      } else if (order === 'desc') {
        state.sortByDesc = !state.sortByDesc;
        state.sortByAsc = false;
      }
    },
    resetRefurbishedProducts: (state) => {
      state.refurbishedProducts = [];
      state.loading = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasMoreProducts = true;
      state.error = null;
      state.loadingMoreProducts = false;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    sortRefurbishedProducts: (state, action) => {
      const { asc, desc } = action.payload;
      if (asc) {
        state.refurbishedProducts.sort((a, b) => a.price - b.price);
      } else if (desc) {
        state.refurbishedProducts.sort((a, b) => b.price - a.price);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefurbishedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefurbishedProducts.fulfilled, (state, action) => {
        const { refurbishedProducts, hasMoreProducts } = action.payload;

        // Update refurbished products and hasMoreProducts
        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) =>
              !state.refurbishedProducts.some(
                (existingProduct) => existingProduct.$id === product.$id
              )
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.hasMoreProducts = hasMoreProducts;
        }
        state.loading = false;
      })
      .addCase(fetchRefurbishedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      
      // Load more refurbished products
      .addCase(loadMoreRefurbishedProducts.pending, (state) => {
        state.loadingMoreProducts = true;
        state.error = null;
      })
      .addCase(loadMoreRefurbishedProducts.fulfilled, (state, action) => {
        const { refurbishedProducts, hasMoreProducts } = action.payload;

        // Update refurbished products and hasMoreProducts
        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) =>
              !state.refurbishedProducts.some(
                (existingProduct) => existingProduct.$id === product.$id
              )
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.currentPage += 1;

          // Check if there are no more products
          state.hasMoreProducts = hasMoreProducts;
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
export const { toggleSortOrder, resetRefurbishedProducts, setCurrentPage, sortRefurbishedProducts } = refurbishedProductsSlice.actions;
export default refurbishedProductsSlice.reducer;
