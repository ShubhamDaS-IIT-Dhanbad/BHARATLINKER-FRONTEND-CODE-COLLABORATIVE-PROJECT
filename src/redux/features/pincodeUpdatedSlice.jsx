import { createSlice } from '@reduxjs/toolkit';

const pincodeSlice = createSlice({
  name: 'pincodestate',
  initialState: {
    isUpdatedPincode: true,
    isUpdatedProduct: false, 
    isUpdatedShop: false,
    isUpdatedRefurbish: false, 
    isUpdatedUserProduct: false, 
  },
  reducers: {
    updatePincode: (state, action) => {
      state.isUpdatedPincode = false;
    },
    updateProduct: (state) => {
      state.isUpdatedProduct = true; 
    },
    updateShop: (state) => {
      state.isUpdatedShop = true;
    },
    updateRefurbish: (state) => {
      state.isUpdatedRefurbish = true;
    },
    updateUserRefurbish: (state) => {
      state.isUpdatedUserProduct = true;
    },

    reupdateProduct: (state) => {
        state.isUpdatedProduct = false; 
      },
      reupdateShop: (state) => {
        state.isUpdatedShop = false;
      },
      reupdateRefurbish: (state) => {
        state.isUpdatedRefurbish = false;
      },
      reupdateUserRefurbish: (state) => {
        state.isUpdatedUserProduct= false;
      }
  },
});

export const {
  updatePincode,
  updateProduct,
  updateShop,
  updateRefurbish,
  updateUserRefurbish,
  reupdateProduct,
  reupdateShop,
  reupdateRefurbish,
  reupdateUserRefurbish
} = pincodeSlice.actions;

export default pincodeSlice.reducer;
