import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchingUserRefurbishedService from '../../../appWrite/userProducts/userRefurbishedProducts.js';
import { addRefurbishedProduct } from '../../../redux/features/user/userAllRefurbishedProductsSlice.jsx';

// Async thunk to fetch refurbished modules
export const fetchRefurbishedModules = createAsyncThunk(
    'modules/fetchRefurbishedModules',
    async ({ inputValue, phn, productsPerPage, currentPage }, { dispatch, rejectWithValue }) => {
        
        try {
            const response = await searchingUserRefurbishedService.getModule({
                inputValue,
                phn,
                productsPerPage,
                page: currentPage,
            });

            if (response.documents && response.total) {
                dispatch(addRefurbishedProduct(response.documents));
                return {
                    refurbishedModules: response.documents,
                    totalModules: response.total,
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to load more refurbished modules
export const loadMoreRefurbishedModules = createAsyncThunk(
    'modules/loadMoreRefurbishedModules',
    async ({ inputValue, phn, productsPerPage, page }, { dispatch, rejectWithValue }) => {
        try {
            const response = await searchingUserRefurbishedService.getRefurbishedProducts({
                inputValue,
                phn,
                productsPerPage,
                page,
            });

            if (response.documents && response.total) {
                dispatch(addRefurbishedProduct(response.documents));
                return {
                    refurbishedModules: response.documents,
                    totalModules: response.total,
                };
            } else {
                return rejectWithValue('Invalid data structure in response');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to delete a module
export const deleteModule = createAsyncThunk(
    'modules/deleteModule',
    async (moduleId, { rejectWithValue }) => {
        try {
            await searchingUserRefurbishedService.deleteProduct(moduleId);
            return { moduleId };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice for modules
const modulesSlice = createSlice({
    name: 'userRefurbishedModules',
    initialState: {
        refurbishedModules: [],
        loadingModules: false,
        loadingMoreModules: false,
        currentPage: 1,
        totalModules: 0,
        hasMoreModules: true,
        error: null,
    },
    reducers: {
        resetModules: (state) => {
            state.refurbishedModules = [];
            state.currentPage = 1;
            state.totalModules = 0;
            state.hasMoreModules = true;
            state.error = null;
        },
        removeModule: (state, action) => {
            state.refurbishedModules = state.refurbishedModules.filter(
                (module) => module.$id !== action.payload
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRefurbishedModules.pending, (state) => {
                state.loadingModules = true;
                state.error = null;
            })
            .addCase(fetchRefurbishedModules.fulfilled, (state, action) => {
                const { refurbishedModules, totalModules } = action.payload;
                state.refurbishedModules = [...refurbishedModules];
                state.totalModules = totalModules;
                state.hasMoreModules = state.refurbishedModules.length < totalModules;
                state.loadingModules = false;
                state.currentPage = 1; // Reset page on new fetch
            })
            .addCase(fetchRefurbishedModules.rejected, (state, action) => {
                state.loadingModules = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreModules = false;
            })





            .addCase(loadMoreRefurbishedModules.pending, (state) => {
                state.loadingMoreModules = true;
                state.error = null;
            })
            .addCase(loadMoreRefurbishedModules.fulfilled, (state, action) => {
                const { refurbishedModules, totalModules } = action.payload;
                const newModules = refurbishedModules.filter(
                    (module) => !state.refurbishedModules.some((existingModule) => existingModule.$id === module.$id)
                );

                state.refurbishedModules = [...state.refurbishedModules, ...newModules];
                state.currentPage += 1;
                state.totalModules = totalModules;
                state.hasMoreModules = state.refurbishedModules.length < totalModules;
                state.loadingMoreModules = false;
            })
            .addCase(loadMoreRefurbishedModules.rejected, (state, action) => {
                state.loadingMoreModules = false;
                state.error = action.payload || 'Something went wrong';
                state.hasMoreModules = false;
            })





            .addCase(deleteModule.fulfilled, (state, action) => {
                const { moduleId } = action.payload;
                state.refurbishedModules = state.refurbishedModules.filter(
                    (module) => module.$id !== moduleId
                );
            })
            .addCase(deleteModule.rejected, (state, action) => {
                state.error = action.payload || 'Failed to delete the module';
            });
    },
});

// Selector to get modules state
export const selectModules = (state) => state.modules;

// Exporting actions and reducer
export const { resetModules, removeModule} = modulesSlice.actions;
export default modulesSlice.reducer;
