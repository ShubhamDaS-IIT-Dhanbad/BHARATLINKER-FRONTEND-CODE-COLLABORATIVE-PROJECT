import React, { Suspense, lazy } from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Oval } from 'react-loader-spinner';
import './App.css';

import  HomePage from './components/homePage/home.jsx';

import SearchPage from './components/searchPage/searchPage.jsx';
import SearchShop from './components/searchShop/searchShop.jsx';
import RefurbishedPage from './components/refurbishedPage/refurbishedPage.jsx';
const ShopProducts = lazy(() => import('./components/shopProducts/shopProducts.jsx'));

import SingleProduct from './components/singleProduct/singleProduct.jsx';
import SingleShopCard from './components/singleShop/singleShop.jsx';
import SingleRefurbishedProductCard from './components/singleRefurbishedProduct/singleRefurbishedProduct.jsx';

const LoginPage = lazy(() => import('./components/loginPage/login.jsx'));
const User = lazy(() => import('./components/user/userHome.jsx'));
const UserProfile = lazy(() => import('./components/user/userProfile/userProfile.jsx'));
const UserProductPageMain = lazy(() => import('./components/user/productPage/userProductPageMain.jsx'));
const RefurbishedBooksUploadUser = lazy(() => import('./components/user/userProductUpload/userProductUpload.jsx'));
const UserUpdateBookModule = lazy(() => import('./components/user/userProductUpdate/userProductUpdate.jsx'));
const UserNotification = lazy(() => import('./components/user/notification/userNotification.jsx'));
const UserOrder = lazy(() => import('./components/user/order/order.jsx'));

const RetailerRoutes = lazy(() => import('./components/retailer/retailerRoutes.jsx'));

function App() {
  const [showFallback, setShowFallback] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <Suspense
          fallback={
            showFallback && (
              <div className="fallback-loading">
                
                 <Oval 
                 height={40} 
                 width={45} 
                 color="white" 
                 secondaryColor="gray" 
                 ariaLabel="loading" />
                             
              </div>
            )
          }
        >
          <RoutesWithConditionalHeader />
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

const RoutesWithConditionalHeader = React.memo(() => (
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
            <HomePage />
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
            <LoginPage />
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
            </Helmet>
            <SearchPage />
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
            <SingleProduct />
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
            <SearchShop />
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
            <SingleShopCard />
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
            <RefurbishedPage />
          </>
        }
      />
      <Route path="/refurbished/:refurbishedId" element={<SingleRefurbishedProductCard />} />

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
        element={
          <>
            <Helmet>
              <title>User Dashboard - Bharat Linker</title>
              <meta name="description" content="Access your Bharat Linker user dashboard to manage your account, orders, and more." />
            </Helmet>
            <User />
          </>
        }
      />
      <Route
        path="/user/profile"
        element={
          <>
            <Helmet>
              <title>User Profile - Bharat Linker</title>
              <meta name="description" content="View and update your Bharat Linker user profile." />
            </Helmet>
            <UserProfile />
          </>
        }
      />
      <Route
        path="/user/refurbished"
        element={
          <>
            <Helmet>
              <title>Manage Refurbished Products - Bharat Linker</title>
              <meta name="description" content="View and manage your refurbished product listings on Bharat Linker." />
            </Helmet>
            <UserProductPageMain />
          </>
        }
      />
      <Route
        path="/user/upload/:productType"
        element={
          <>
            <Helmet>
              <title>Upload Products - Bharat Linker</title>
              <meta name="description" content="Upload your products for sale on Bharat Linker, including refurbished items." />
            </Helmet>
            <RefurbishedBooksUploadUser />
          </>
        }
      />
      <Route
        path="/user/refurbished/update/:id"
        element={
          <>
            <Helmet>
              <title>Update Product - Bharat Linker</title>
              <meta name="description" content="Edit and update the details of your refurbished products on Bharat Linker." />
            </Helmet>
            <UserUpdateBookModule />
          </>
        }
      />
      <Route
        path="/user/notification"
        element={
          <>
            <Helmet>
              <title>Notifications - Bharat Linker</title>
              <meta name="description" content="View all your notifications related to account activity and updates." />
            </Helmet>
            <UserNotification />
          </>
        }
      />
      <Route
        path="/user/order"
        element={
          <>
            <Helmet>
              <title>Orders - Bharat Linker</title>
              <meta name="description" content="View and manage your orders on Bharat Linker." />
            </Helmet>
            <UserOrder />
          </>
        }
      />

    </Routes>
  </>
));

export default App;
