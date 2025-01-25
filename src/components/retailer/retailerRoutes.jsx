import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Cookies from "js-cookie"; // Import Cookies
import useRetailerAuthHook from '../../hooks/retailerAuthHook.jsx';

// Lazy-loaded components
const Retailer = React.lazy(() => import("./retailer.jsx"));
const RetailerDashboard = React.lazy(() => import("./dashboard/dashboard.jsx"));
const RetailerProducts = React.lazy(() => import("./products/userProductPageMain.jsx"));
const RetailerUpload = React.lazy(() => import("./upload/upload.jsx"));
const RetailerUpdate = React.lazy(() => import("./update/update.jsx"));
const RetailerPending = React.lazy(() => import("./pending/pending.jsx"));

// Private route to protect routes if not authenticated
const PrivateRoute = ({ children }) => {
  const isAuthenticated = Cookies.get('BharatLinkerShopData');
  if (!isAuthenticated) {return <Navigate to="/error" />;}
  return children;
};

// Fallback Loader component
const Loading = () => <div>Loading...</div>;

const RetailerRoutes = React.memo(() => {
  const { getRetailerDataFromCookie } = useRetailerAuthHook();
  const retailerData = getRetailerDataFromCookie();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Pending Approval Route */}
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

          {/* Protected Routes */}
          <Route
            path="/retailer"
            element={
              <PrivateRoute>
                <Helmet>
                  <title>Retailer Home - BharatLinker</title>
                  <meta
                    name="description"
                    content="Welcome to the BharatLinker Retailer dashboard."
                  />
                </Helmet>
                <Retailer retailerData={retailerData} />
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
                <RetailerDashboard retailerData={retailerData} />
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
                <RetailerProducts retailerData={retailerData} />
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
                <RetailerUpdate retailerData={retailerData} />
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
                <RetailerUpload retailerData={retailerData} />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
});

export default RetailerRoutes;
