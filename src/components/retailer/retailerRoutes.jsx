import React, { Suspense, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Cookies from "js-cookie";
import { Oval } from "react-loader-spinner";
import useRetailerAuthHook from '../../hooks/retailerAuthHook.jsx'

// Lazy-loaded components
const ShopHome = React.lazy(() => import("./shopHome.jsx"));
const RetailerDashboard = React.lazy(() => import("./dashboard/dashboard.jsx"));
const ShopAddress = React.lazy(() => import("./shopAddress.jsx"));
const RetailerProducts = React.lazy(() => import("./products/userProductPageMain.jsx"));
const RetailerUpload = React.lazy(() => import("./upload/upload.jsx"));
const RetailerUpdate = React.lazy(() => import("./update/update.jsx"));
const RetailerPending = React.lazy(() => import("./pending/pending.jsx"));
const RetailerOrders = React.lazy(() => import("./order/order.jsx"));
const RetailerOrderDetail = React.lazy(() => import("./orderDetail/orderDetail.jsx"));

// Private route to protect routes if not authenticated



const RetailerRoutes = React.memo(() => {
  const { PrivateRoute} = useRetailerAuthHook();

  return (
    <Suspense
      fallback={
        <div className="fallback-loading">
          <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
        </div>
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
              <ShopHome/>
            </PrivateRoute>
          }
        />

        <Route
          path="/retailer/dashboard"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Dashboard - BharatLinker</title>
                <meta
                  name="description"
                  content="Manage your retailer profile, view analytics, and access business tools."
                />
              </Helmet>
              <RetailerDashboard />
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
          path="/retailer/products"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Products - BharatLinker</title>
                <meta
                  name="description"
                  content="View and manage your product inventory on BharatLinker."
                />
              </Helmet>
              <RetailerProducts  />
            </PrivateRoute>
          }
        />

        <Route
          path="/retailer/product/update/:id"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Update Product - BharatLinker</title>
                <meta
                  name="description"
                  content="Update your product details on BharatLinker."
                />
              </Helmet>
              <RetailerUpdate  />
            </PrivateRoute>
          }
        />

        <Route
          path="/retailer/upload"
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
          path="/shop/orders"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Order - BharatLinker</title>
                <meta
                  name="description"
                  content="orders"
                />
              </Helmet>
              <RetailerOrders/>
            </PrivateRoute>
          }
        />

        <Route
          path="/shop/order/:id"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Order Detail- BharatLinker</title>
                <meta
                  name="description"
                  content="orders"
                />
              </Helmet>
              <RetailerOrderDetail/>
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
});

export default RetailerRoutes;
