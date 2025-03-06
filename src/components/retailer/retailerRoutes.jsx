import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Oval } from "react-loader-spinner";
import useRetailerAuthHook from '../../hooks/retailerAuthHook.jsx'

// Lazy-loaded components
const ShopHome = React.lazy(() => import("./shopHome.jsx"));
const ShopDashboard = React.lazy(() => import("./shopData/shopData.jsx"));
const ShopAddress = React.lazy(() => import("./shopAddress.jsx"));
const RetailerProducts = React.lazy(() => import("./products/userProductPageMain.jsx"));
const RetailerUpload = React.lazy(() => import("./upload/upload.jsx"));
const RetailerUpdate = React.lazy(() => import("./update/update.jsx"));
const RetailerPending = React.lazy(() => import("./pending/pending.jsx"));
const RetailerOrders = React.lazy(() => import("./order/order.jsx"));
const ShopPassword = React.lazy(() => import("./password/password.jsx"));
// Private route to protect routes if not authenticated


const RetailerRoutes = React.memo(() => {
  const { PrivateRoute } = useRetailerAuthHook();

  return (
    <Suspense
      fallback={
        <div className="loading-shd-div-container">
          <div className="loading-shd-div">
            <Oval height={30} width={30} color="green" secondaryColor="white" />
          </div>
        </div >
      }
    >
      <Routes>
        <Route
          path="/retailer/pending"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Pending Approval - BharatLinker</title>
                <meta
                  name="description"
                  content="Your retailer account is pending approval. Please wait for further updates."
                />
              </Helmet>
              <RetailerPending />
            </PrivateRoute>
          }
        />

        <Route
          path="/secure/shop"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Home - BharatLinker</title>
                <meta
                  name="description"
                  content="Welcome to the BharatLinker Retailer dashboard."
                />
              </Helmet>
              <ShopHome />
            </PrivateRoute>
          }
        />

        <Route
          path="/secure/shopdata"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Dashboard - BharatLinker</title>
                <meta
                  name="description"
                  content="Manage your retailer profile, view analytics, and access business tools."
                />
              </Helmet>
              <ShopDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/secure/shop/address"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Shop Address - BharatLinker</title>
                <meta
                  name="shop address"
                  content="Manage your retailer profile, view analytics, and access business tools."
                />
              </Helmet>
              <ShopAddress />
            </PrivateRoute>
          }
        />

        <Route
          path="/secure/retailer/products"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Products - BharatLinker</title>
                <meta
                  name="description"
                  content="View and manage your product inventory on BharatLinker."
                />
              </Helmet>
              <RetailerProducts />
            </PrivateRoute>
          }
        />

        <Route
          path="/secure/shop/update/:id"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Update Product - BharatLinker</title>
                <meta
                  name="description"
                  content="Update your product details on BharatLinker."
                />
              </Helmet>
              <RetailerUpdate />
            </PrivateRoute>
          }
        />

        <Route
          path="/secure/shop/upload"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Upload Products - BharatLinker</title>
                <meta
                  name="description"
                  content="Upload new products to your BharatLinker retailer account."
                />
              </Helmet>
              <RetailerUpload />
            </PrivateRoute>
          }
        />
        <Route
          path="/secure/shop/password"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Password - BharatLinker</title>
                <meta
                  name="description"
                  content="Upload new products to your BharatLinker retailer account."
                />
              </Helmet>
              <ShopPassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/secure/shop/orders"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Order - BharatLinker</title>
                <meta
                  name="description"
                  content="orders"
                />
              </Helmet>
              <RetailerOrders />
            </PrivateRoute>
          }
        />

      </Routes>
    </Suspense>
  );
});

export default RetailerRoutes;
