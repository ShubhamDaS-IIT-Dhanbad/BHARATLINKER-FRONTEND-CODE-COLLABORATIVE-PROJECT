import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchingUserRefurbishedService from '../../../appWrite/userProducts/userRefurbishedProducts.js';
import { addRefurbishedProduct } from '../../../redux/features/user/userAllRefurbishedProductsSlice.jsx';

// Async thunk to fetch refurbished books
export const fetchRefurbishedBooks = createAsyncThunk(
    'books/fetchRefurbishedBooks',
    async ({ inputValue, phn, productsPerPage, currentPage }, { rejectWithValue, dispatch }) => {
        try {
            const response = await searchingUserRefurbishedService.getRefurbishedBooks({ inputValue, phn, productsPerPage, page: currentPage });
            if (response.documents && response.total) {
                dispatch(addRefurbishedProduct(response.documents));
                return {
                    refurbishedBooks: response.documents,
                    totalBooks: response.total,
                    productsPerPage,
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to load more refurbished products
export const loadMoreRefurbishedBooks = createAsyncThunk(
    'refurbishedProducts/loadMoreRefurbishedProducts',
    async ({ inputValue, phn, productsPerPage, page }, { rejectWithValue, dispatch }) => {
        try {
            const response = await searchingUserRefurbishedService.getRefurbishedBooks({ inputValue, phn, productsPerPage, page });
            if (response.documents && response.total) {
                dispatch(addRefurbishedProduct(response.documents));
                return {
                    refurbishedProducts: response.documents,
                    totalBooks: response.total,
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to delete a product
export const deleteBook = createAsyncThunk(
    'refurbishedProducts/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            await searchingUserRefurbishedService.deleteProduct(productId);
            return { productId };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const booksSlice = createSlice({
    name: 'userRefurbishedBooks',
    initialState: {
        refurbishedBooks: [],
        loading: false,
        loadingMoreBooks: false,
        currentPage: 1,
        totalBooks: 0,
        hasMoreRefurbishedBooks: true,
        error: null,
    },
    reducers: {
        resetBooks: (state) => {
            state.refurbishedBooks = [];
            state.currentPage = 1;
            state.totalBooks = 0;
            state.hasMoreRefurbishedBooks = true;
            state.error = null;
        },
        removeBook: (state, action) => {
            state.refurbishedBooks = state.refurbishedBooks.filter(book => book.$id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRefurbishedBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRefurbishedBooks.fulfilled, (state, action) => {
                const { refurbishedBooks, totalBooks } = action.payload;
                const newBooks = refurbishedBooks.filter(
                    (book) => !state.refurbishedBooks.some(existingBook => existingBook.$id === book.$id)
                );

                state.refurbishedBooks = [...state.refurbishedBooks, ...newBooks];
                state.hasMoreRefurbishedBooks = state.refurbishedBooks.length < totalBooks;
                state.loading = false;
            })
            .addCase(fetchRefurbishedBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreRefurbishedBooks = false;
            })





            .addCase(loadMoreRefurbishedBooks.pending, (state) => {
                state.loadingMoreBooks = true;
                state.error = null;
            })
            .addCase(loadMoreRefurbishedBooks.fulfilled, (state, action) => {
                const { refurbishedProducts, totalBooks } = action.payload;
                const newBooks = refurbishedProducts.filter(
                    (book) => !state.refurbishedBooks.some(existingBook => existingBook.$id === book.$id)
                );

                state.refurbishedBooks = [...state.refurbishedBooks, ...newBooks];
                state.currentPage += 1;

                // Fixing the typo here
                state.hasMoreRefurbishedBooks = state.refurbishedBooks.length < totalBooks;
                state.loadingMoreBooks = false;
            })

            .addCase(loadMoreRefurbishedBooks.rejected, (state, action) => {
                state.loadingMoreBooks = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreRefurbishedBooks = false;
            })





            .addCase(deleteBook.fulfilled, (state, action) => {
                const { productId } = action.payload;
                state.refurbishedBooks = state.refurbishedBooks.filter(product => product.$id !== productId);
            })
            .addCase(deleteBook.rejected, (state, action) => {
                state.error = action.payload || 'Failed to delete the product';
            });
    },
});

export const { resetBooks, removeBook } = booksSlice.actions;
export const selectBooks = (state) => state.userRefurbishedBooks.refurbishedBooks;
export const selectBooksLoading = (state) => state.userRefurbishedBooks.loading;
export const selectBooksError = (state) => state.userRefurbishedBooks.error;

export default booksSlice.reducer;
