import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import useRetailerAuthHook from '../../hooks/retailerAuthHook.jsx';

// Lazy-loaded components
const Retailer = React.lazy(() => import("./retailer.jsx"));
const RetailerDashboard = React.lazy(() => import("./dashboard/dashboard.jsx"));
const RetailerProducts = React.lazy(() => import("./products/userProductPageMain.jsx"));
const RetailerUpload = React.lazy(() => import("./upload/upload.jsx"));
const RetailerUpdate = React.lazy(() => import("./update/update.jsx"));
const RetailerPending = React.lazy(() => import("./pending/pending.jsx"));

// Fallback Loader
const Loading = () => <div>Loading...</div>;

const RetailerRoutes = React.memo(() => {
  const { PrivateRoute, getRetailerDataFromCookie } = useRetailerAuthHook();
  const retailerData = getRetailerDataFromCookie();
  return (
    <>
      <Routes>

        <Route
          path="/retailer/pending"
          element={
            <Suspense fallback={<Loading />}>
              <Helmet>
                <title>Pending Approval - BharatLinker</title>
                <meta
                  name="description"
                  content="Your retailer account is pending approval. Please wait for further updates."
                />
              </Helmet>
              <RetailerPending />
            </Suspense>
          }
        />
        {/* Protected routes */}
        <Route
          path="/retailer"
          element={
            <Suspense fallback={<Loading />}>
              <Helmet>
                <title>Retailer Home - BharatLinker</title>
                <meta
                  name="description"
                  content="Welcome to the BharatLinker Retailer dashboard."
                />
              </Helmet>
              <Retailer />
            </Suspense>
          }
        />
        <Route
          path="/retailer/dashboard"
          element={
            <Suspense fallback={<Loading />}>
              <Helmet>
                <title>Retailer Dashboard - BharatLinker</title>
                <meta
                  name="description"
                  content="Manage your retailer profile, view analytics, and access business tools."
                />
              </Helmet>
              <RetailerDashboard />
            </Suspense>
          }
        />
        <Route
          path="/retailer/products"
          element={
            <Suspense fallback={<Loading />}>
              <Helmet>
                <title>Retailer Products - BharatLinker</title>
                <meta
                  name="description"
                  content="View and manage your product inventory on BharatLinker."
                />
              </Helmet>
              <RetailerProducts />
            </Suspense>
          }
        />
        <Route
          path="/retailer/product/update/:id"
          element={
            <Suspense fallback={<Loading />}>
              <Helmet>
                <title>Update Product - BharatLinker</title>
                <meta
                  name="description"
                  content="Update your product details on BharatLinker."
                />
              </Helmet>
              <RetailerUpdate />
            </Suspense>
          }
        />
        <Route
          path="/retailer/upload"
          element={
            <Suspense fallback={<Loading />}>
              <Helmet>
                <title>Upload Products - BharatLinker</title>
                <meta
                  name="description"
                  content="Upload new products to your BharatLinker retailer account."
                />
              </Helmet>
              <RetailerUpload />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
});

export default RetailerRoutes;
