import React, { Suspense, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Cookies from "js-cookie";
import { Oval } from "react-loader-spinner";

// Lazy-loaded components
const Retailer = React.lazy(() => import("./retailer.jsx"));
const RetailerDashboard = React.lazy(() => import("./dashboard/dashboard.jsx"));
const RetailerProducts = React.lazy(() => import("./products/userProductPageMain.jsx"));
const RetailerUpload = React.lazy(() => import("./upload/upload.jsx"));
const RetailerUpdate = React.lazy(() => import("./update/update.jsx"));
const RetailerPending = React.lazy(() => import("./pending/pending.jsx"));
const RetailerOrders = React.lazy(() => import("./order/order.jsx"));
const RetailerOrderDetail = React.lazy(() => import("./orderDetail/orderDetail.jsx"));

// Private route to protect routes if not authenticated
const PrivateRoute = ({ children }) => {
  const isAuthenticated = Cookies.get("BharatLinkerShopData");
  if (!isAuthenticated) {
    return <Navigate to="/error" />;
  }
  return children;
};

const RetailerRoutes = React.memo(() => {

  const getRetailerDataFromCookie = useCallback(() => {
    const storedData = Cookies.get("BharatLinkerShopData");
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error("Error parsing retailer data from cookie:", error);
        return null;
      }
    }
    return null;
  }, []);
  const retailerData = getRetailerDataFromCookie();

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

        <Route
          path="/retailer/orders"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Order - BharatLinker</title>
                <meta
                  name="description"
                  content="orders"
                />
              </Helmet>
              <RetailerOrders retailerData={retailerData} />
            </PrivateRoute>
          }
        />

        <Route
          path="/retailer/order/:id"
          element={
            <PrivateRoute>
              <Helmet>
                <title>Retailer Order Detail- BharatLinker</title>
                <meta
                  name="description"
                  content="orders"
                />
              </Helmet>
              <RetailerOrderDetail retailerData={retailerData} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
});

export default RetailerRoutes;
