// src/redux/features/refurbishedProductsSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchRefurbishedProductService from '../../appWrite/searchRefurbished.js';

// Async thunk for fetching refurbished products
export const fetchRefurbishedProducts = createAsyncThunk(
  'refurbishedProducts/fetchRefurbishedProducts',
  async ({
    inputValue, pinCodes, page,
    productsPerPage, sortByAsc, sortByDesc,
    hasMoreProductsBook,
    hasMoreProductsModule,
    hasMoreProductsGadgets,

    selectedCategories,
    selectedClasses,
    selectedExams,
    selectedLanguages,
    selectedBoards,
    selectedBrands

  }, { rejectWithValue }) => {
    try {
      const response = await searchRefurbishedProductService.getRefurbishedProducts({
        inputValue, pinCodes, page, productsPerPage, sortByAsc, sortByDesc, selectedCategories, selectedBrands,
        hasMoreProductsBook,
        hasMoreProductsModule,
        hasMoreProductsGadgets
      });

      if (response?.products?.length === 0) {
        return {
          refurbishedProducts: [],
          totalPages: 0,
          productsPerPage
        };
      }

      if (response.products) {
        return {
          refurbishedProducts: response.products,
          nbook: response.nbook,
          nmodule: response.nmodule,
          ngadgets: response.ngadgets,
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
  async ({
    inputValue, pinCodes, page,
    productsPerPage, sortByAsc, sortByDesc,
    hasMoreProductsBook,
    hasMoreProductsModule,
    hasMoreProductsGadgets,

    selectedCategories,
    selectedClasses,
    selectedExams,
    selectedLanguages,
    selectedBoards,
    selectedBrands,
  }, { rejectWithValue }) => {
    try {
      const response = await searchRefurbishedProductService.getRefurbishedProducts({
        inputValue, pinCodes, page, productsPerPage,
        sortByAsc, sortByDesc, selectedCategories, selectedBrands, hasMoreProductsBook,
        hasMoreProductsModule,
        hasMoreProductsGadgets
      });

      // Check if response has refurbished products and total pages
      if (response?.products) {
        return {
          refurbishedProducts: response.products,
          productsPerPage,
          totalPages: response.total || 0,
          nbook: response.nbook || 0,
          nmodule: response.nmodule || 0,
          ngadgets: response.ngadgets || 0,
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
    hasMoreProductsBook: true,
    hasMoreProductsModule: true,
    hasMoreProductsGadgets: true,
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
      state.hasMoreProductsBook = true;
      state.hasMoreProductsModule = true;
      state.hasMoreProductsGadgets = true;
      state.error = null;
      state.loadingMoreProducts = false;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Set current page
    },
    sortRefurbishedProducts: (state, action) => {
      const { asc, desc } = action.payload;
      if (asc) {
        state.refurbishedProducts.sort((a, b) => a.price - b.price);
      } else if (desc) {
        state.refurbishedProducts.sort((a, b) => b.price - a.price);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefurbishedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefurbishedProducts.fulfilled, (state, action) => {
        const { refurbishedProducts, totalPages, productsPerPage, nbook, nmodule, ngadgets } = action.payload;

        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) => !state.refurbishedProducts.some(existingProduct => existingProduct.$id === product.$id)
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.totalPages = totalPages;

          // Update 'hasMoreProducts' logic based on number of products in each category
          state.hasMoreProductsBook = nbook >= 4;
          state.hasMoreProductsModule = nmodule >= 4;
          state.hasMoreProductsGadgets = ngadgets >= 4;

          state.hasMoreProducts = state.hasMoreProductsBook || state.hasMoreProductsModule || state.hasMoreProductsGadgets;
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
        const { refurbishedProducts, totalPages, productsPerPage, nbook, nmodule, ngadgets } = action.payload;

        if (refurbishedProducts.length > 0) {
          const newProducts = refurbishedProducts.filter(
            (product) => !state.refurbishedProducts.some(existingProduct => existingProduct.$id === product.$id)
          );
          state.refurbishedProducts = [...state.refurbishedProducts, ...newProducts];
          state.totalPages = totalPages;
          state.currentPage += 1;

          // Update 'hasMoreProducts' logic based on number of products in each category
          state.hasMoreProductsBook = nbook >= 4;
          state.hasMoreProductsModule = nmodule >= 4;
          state.hasMoreProductsGadgets = ngadgets >= 4;

          state.hasMoreProducts = state.hasMoreProductsBook || state.hasMoreProductsModule || state.hasMoreProductsGadgets;
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
export const { resetRefurbishedProducts, setCurrentPage,sortRefurbishedProducts } = refurbishedProductsSlice.actions;
export default refurbishedProductsSlice.reducer;
