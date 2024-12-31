import React from "react";
import { Routes, Route } from "react-router-dom";
import RetailerLogin from './retailerLogin.jsx';
// import RetailerSignup from './retailerSignup.jsx';
// import ProtectedRoute from '../components/protectedRouteRetailer.jsx';
// import RetailerHome from './retailerHome.jsx';
// import RetailerShop from './retailerShopPage.jsx';
// import RetailerProduct from './retailerProductPage.jsx';
// import UploadProduct from './retailerUploadProduct.jsx';
// import UpdateProduct from './retailerUpdateProduct.jsx';

const RetailerRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/retailer/login" element={<RetailerLogin />} />
      {/* <Route path="/retailer/signup" element={<RetailerSignup />} /> */}
      
      {/* Protected Routes */}
      {/* <Route path="/retailer/home" element={<ProtectedRoute element={<RetailerHome />} />} />
      <Route path="/retailer/shop" element={<ProtectedRoute element={<RetailerShop />} />} /> */}
      {/* <ProtectedRoute path="/retailer/data" element={<RetailerData />} /> */}
      {/* <Route path="/retailer/product" element={<ProtectedRoute element={<RetailerProduct />} />} />
      <Route path="/retailer/uploadproduct" element={<ProtectedRoute element={<UploadProduct />} />} />
      <Route path="/retailer/updateproduct/:productId" element={<ProtectedRoute element={<UpdateProduct />} />} /> */}
    </Routes>
  );
};

export default RetailerRoutes;
