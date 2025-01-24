import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk('userdata/fetchUserData', async () => {
  return {};
});

const initialState = {
  userData: null,
  isLoading: false,
  error: null,
};

const userDataSlice = createSlice({
  name: 'userdata',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    clearUser: (state) => {
      state.userData = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null; 
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUser, clearUser, setLoading, setError } = userDataSlice.actions;

export default userDataSlice.reducer;
