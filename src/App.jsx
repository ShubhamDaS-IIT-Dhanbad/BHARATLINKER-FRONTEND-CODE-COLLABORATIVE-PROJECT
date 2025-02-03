import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Helmet, HelmetProvider } from "react-helmet-async";
import useUserAuth from './hooks/userAuthHook.jsx';
import { Oval } from 'react-loader-spinner';

import HomePage from './components/homePage/home.jsx';
import SearchPage from './components/searchPage/searchPage.jsx';
import SearchShop from './components/searchShop/searchShop.jsx';
import RefurbishedPage from './components/refurbishedPage/refurbishedPage.jsx';

import i1 from './assets/bl.png';
const LoginPage = lazy(() => import('./components/loginPage/login.jsx'));

const SingleProduct = lazy(() => import('./components/singleProduct/singleProduct.jsx'));
const ShopProducts = lazy(() => import('./components/shopProducts/shopProducts.jsx'));
const SingleShopCard = lazy(() => import('./components/singleShop/singleShop.jsx'));
const SingleRefurbishedProductCard = lazy(() => import('./components/singleRefurbishedProduct/singleRefurbishedProduct.jsx'));
const User = lazy(() => import('./components/user/userHome.jsx'));
const UserProfile = lazy(() => import('./components/user/userProfile/userProfile.jsx'));
const UserProductPageMain = lazy(() => import('./components/user/productPage/userProductPageMain.jsx'));
const RefurbishedBooksUploadUser = lazy(() => import('./components/user/userProductUpload/userProductUpload.jsx'));
const UserUpdateBookModule = lazy(() => import('./components/user/userProductUpdate/userProductUpdate.jsx'));
const UserNotification = lazy(() => import('./components/user/notification/userNotification.jsx'));
const UserOrder = lazy(() => import('./components/user/order/order.jsx'));
const UserCart = lazy(() => import('./components/user/myCart/myCart.jsx'));
const UserOrderDetail = lazy(() => import('./components/user/orderDetail/orderDetail.jsx'));

const RetailerRoutes = lazy(() => import('./components/retailer/retailerRoutes.jsx'));
const RetailerLogin = React.lazy(() => import("./components/retailer/login.jsx"));
const RetailerRegister = React.lazy(() => import("./components/retailer/register.jsx"));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={
          <div className="fallback-loading">
            <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
          </div>}>
          <RoutesWithConditionalHeader />
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

const RoutesWithConditionalHeader = React.memo(() => {
  const { PrivateRoute, getUserDataFromCookie } = useUserAuth();
  const userData = getUserDataFromCookie();
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Helmet>
                <title>Bharat Linker</title>
                <meta name="description" content="Welcome to Bharat Linker, your one-stop solution for business management." />
                <meta name="robots" content="index, follow" />
              </Helmet>
              <HomePage userData={userData} />
            </>
          }
        />
        
        <Route
          path="/login"
          element={
            <>
              <Helmet>
                <title>Login - Bharat Linker</title>
                <meta name="description" content="Login to access your Bharat Linker account and manage your business efficiently." />
                <meta name="robots" content="noindex, nofollow" />
              </Helmet>
              <LoginPage userData={userData} />
            </>
          }
        />
        {/* Search Section */}
        <Route
          path="/search"
          element={
            <>
              <Helmet>
                <title>Search Products - Bharat Linker</title>
                <meta name="description" content="Search and explore a wide range of products on Bharat Linker." />
              </Helmet >
              <SearchPage userData={userData} />
            </>
          }
        />

        {/* Single Product */}
        <Route
          path="/product/:productId"
          element={
            <>
              <Helmet>
                <title>Product Details - Bharat Linker</title>
                <meta name="description" content="View detailed information about the selected product on Bharat Linker." />
              </Helmet>
              <SingleProduct userData={userData} />
            </>
          }
        />

        {/* Search Shop */}
        <Route
          path="/shop"
          element={
            <>
              <Helmet>
                <title>Search Shops - Bharat Linker</title>
                <meta name="description" content="Search and explore various shops on Bharat Linker." />
              </Helmet>
              <SearchShop userData={userData} />
            </>
          }
        />

        {/* Single Shop */}
        <Route
          path="/shop/:shopId"
          element={
            <>
              <Helmet>
                <title>Shop Details - Bharat Linker</title>
                <meta name="description" content="Discover detailed information about this shop on Bharat Linker." />
              </Helmet>
              <SingleShopCard userData={userData} />
            </>
          }
        />
        <Route path="/shop/product/:shopId" element={<ShopProducts />} />

        {/* Refurbished */}
        <Route
          path="/refurbished"
          element={
            <>
              <Helmet>
                <title>Refurbished Products - Bharat Linker</title>
                <meta name="description" content="Explore high-quality refurbished products on Bharat Linker." />
              </Helmet>
              <RefurbishedPage userData={userData} />
            </>
          }
        />
        <Route
          path="/refurbished/:refurbishedId"
          element={
            <>
              <Helmet>
                <title>Refurbished Details - Bharat Linker</title>
                <meta name="description" content="Search and explore a wide range of products on Bharat Linker." />
              </Helmet >
              <SingleRefurbishedProductCard userData={userData} />
            </>}
        />



















        <Route
          path="/secure/login"
          element={
            <>
              <Helmet>
                <title>Retailer Login - BharatLinker</title>
                <meta
                  name="description"
                  content="Login to your BharatLinker Retailer account and manage your business effectively."
                />
              </Helmet>
              <RetailerLogin />
            </>
          }
        />
        <Route
          path="/secure/register"
          element={
            <>
              <Helmet>
                <title>Register as a Retailer - BharatLinker</title>
                <meta
                  name="description"
                  content="Register as a retailer on BharatLinker to expand your business opportunities."
                />
              </Helmet>
              <RetailerRegister />
            </>
          }
        />
        {/* Retailer and User Routes */}
        <Route
          path="/*"
          element={
            <>
              <Helmet>
                <title>Retailer Dashboard - Bharat Linker</title>
                <meta name="description" content="Access the retailer dashboard to manage your shop, products, and orders on Bharat Linker." />
              </Helmet>
              <RetailerRoutes />
            </>
          }
        />












        <Route
          path="/user"
          element=
          {
            <PrivateRoute>
              <Helmet>
                <title>User Dashboard - Bharat Linker</title>
                <meta name="description" content="Access your Bharat Linker user dashboard to manage your account, orders, and more." />
              </Helmet>
              <User userData={userData} />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/profile"
          element=
          {
            <PrivateRoute>
              <Helmet>
                <title>User Profile - Bharat Linker</title>
                <meta name="description" content="View and update your Bharat Linker user profile." />
              </Helmet>
              <UserProfile userData={userData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/refurbished"
          element=
          {
            <PrivateRoute>
              <Helmet>
                <title>Manage Refurbished Products - Bharat Linker</title>
                <meta name="description" content="View and manage your refurbished product listings on Bharat Linker." />
              </Helmet>
              <UserProductPageMain userData={userData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/upload/:productType"
          element=
          {
            <PrivateRoute>
              <Helmet>
                <title>Upload Products - Bharat Linker</title>
                <meta name="description" content="Upload your products for sale on Bharat Linker, including refurbished items." />
              </Helmet>
              <RefurbishedBooksUploadUser userData={userData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/refurbished/update/:id"
          element=
          {
            <PrivateRoute>
              <Helmet>
                <title>Update Product - Bharat Linker</title>
                <meta name="description" content="Edit and update the details of your refurbished products on Bharat Linker." />
              </Helmet>
              <UserUpdateBookModule userData={userData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/notification"
          element=
          {
            <PrivateRoute>
              <Helmet>
                <title>Notifications - Bharat Linker</title>
                <meta name="description" content="View all your notifications related to account activity and updates." />
              </Helmet>
              <UserNotification userData={userData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/order"
          element=
          {
            <PrivateRoute>
              <Helmet>
                <title>Orders - Bharat Linker</title>
                <meta name="description" content="View and manage your orders on Bharat Linker." />
              </Helmet>
              <UserOrder userData={userData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/cart"
          element=
          {
            <PrivateRoute>
              <Helmet>
                <title>Cart - Bharat Linker</title>
                <meta name="description" content="View and manage your cart on Bharat Linker." />
              </Helmet>
              <UserCart userData={userData} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/order/:id"
          element=
          {
            <PrivateRoute>
              <Helmet>
                <title>Orders - Bharat Linker</title>
                <meta name="description" content="Order detail on Bharat Linker." />
              </Helmet>
              <UserOrderDetail userData={userData} />
            </PrivateRoute>
          }
        />

      </Routes>
    </>
  )
});

export default App;
