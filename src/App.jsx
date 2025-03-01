import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Oval } from 'react-loader-spinner';
import useUserAuth from './hooks/userAuthHook.jsx';
import { fetchUserCart } from "./redux/features/user/cartSlice.jsx";
import './App.css';

// Static Imports
import Download from './components/downloadapp.jsx';
import HomePage from './components/homePage/home.jsx';
import SearchPage from './components/searchPage/searchPage.jsx';
import SearchShop from './components/searchShop/searchShop.jsx';

// Lazy Loaded 
const LoginPage = lazy(() => import('./components/user/login.jsx'));
const SingleProduct = lazy(() => import('./components/singleProduct.jsx'));
const SingleShopCard = lazy(() => import('./components/singleShop.jsx'));
const ShopProducts = lazy(() => import('./components/shopProducts/shopProducts.jsx'));

const RetailerRoutes = lazy(() => import('./components/retailer/retailerRoutes.jsx'));
const RetailerLogin = lazy(() => import("./components/retailer/login.jsx"));
const RetailerRegister = lazy(() => import("./components/retailer/register.jsx"));

const User = lazy(() => import('./components/user/userHome.jsx'));
const UserProfile = lazy(() => import('./components/user/userProfile.jsx'));
const UserOrder = lazy(() => import('./components/user/order/order.jsx'));
const UserCart = lazy(() => import('./components/user/myCart/myCart.jsx'));

// Route Configuration
const routes = {
  public: [
    { path: "/", component: HomePage, title: "Bharat Linker", desc: "Welcome to Bharat Linker, your one-stop solution for business management.", robots: "index, follow" },
    { path: "/download", component: Download, title: "Bharat Linker", desc: "Welcome to Bharat Linker, your one-stop solution for business management.", robots: "index, follow" },
    { path: "/login", component: LoginPage, title: "Login - Bharat Linker", desc: "Login to access your Bharat Linker account and manage your business efficiently.", robots: "noindex, nofollow" },
    { path: "/search", component: SearchPage, title: "Search Products - Bharat Linker", desc: "Search and explore a wide range of products on Bharat Linker." },
    { path: "/product/:productId", component: SingleProduct, title: "Product Details - Bharat Linker", desc: "View detailed information about the selected product on Bharat Linker." },
    { path: "/shop", component: SearchShop, title: "Search Shops - Bharat Linker", desc: "Search and explore various shops on Bharat Linker." },
    { path: "/shop/:shopId", component: SingleShopCard, title: "Shop Details - Bharat Linker", desc: "Discover detailed information about this shop on Bharat Linker." },
    { path: "/shop/product/:shopId", component: ShopProducts, title: "Shop Products - Bharat Linker", desc: "View products from this shop on Bharat Linker." },
    { path: "/secure/login", component: RetailerLogin, title: "Retailer Login - BharatLinker", desc: "Login to your BharatLinker Retailer account and manage your business effectively." },
    { path: "/secure/register", component: RetailerRegister, title: "Register as a Retailer - BharatLinker", desc: "Register as a retailer on BharatLinker to expand your business opportunities." },
    { path: "/*", component: RetailerRoutes, title: "Retailer Dashboard - Bharat Linker", desc: "Access the retailer dashboard to manage your shop, products, and orders on Bharat Linker." },
  ],
  private: [
    { path: "/user", component: User, title: "User Dashboard - Bharat Linker", desc: "Access your Bharat Linker user dashboard to manage your account, orders, and more." },
    { path: "/user/profile", component: UserProfile, title: "User Profile - Bharat Linker", desc: "View and update your Bharat Linker user profile." },
    { path: "/user/order", component: UserOrder, title: "Orders - Bharat Linker", desc: "View and manage your orders on Bharat Linker." },
    { path: "/user/cart", component: UserCart, title: "Cart - Bharat Linker", desc: "View and manage your cart on Bharat Linker." },
  ]
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={
          <div className="fallback-loading">
            <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
          </div>
        }>
          <RoutesWithConditionalHeader />
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

const RoutesWithConditionalHeader = React.memo(() => {
  const { PrivateRoute } = useUserAuth();
  const { cart, isCartFetched } = useSelector((state) => state.userCart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isCartFetched) {
      const userData = Cookies.get('BharatLinkerUserData');
      let parsedUserData;
      try {
        parsedUserData = userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
      if (parsedUserData?.userId && cart.length === 0) {
        console.log(parsedUserData)
        dispatch(fetchUserCart(parsedUserData.userId));
      }
    }
  }, [dispatch, cart.length, isCartFetched]);

  return (
    <Routes>
      {/* Public Routes */}
      {routes.public.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <>
              <Helmet>
                <title>{route.title}</title>
                <meta name="description" content={route.desc} />
                {route.robots && <meta name="robots" content={route.robots} />}
              </Helmet>
              <route.component />
            </>
          }
        />
      ))}

      {/* Private Routes */}
      {routes.private.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute>
              <Helmet>
                <title>{route.title}</title>
                <meta name="description" content={route.desc} />
              </Helmet>
              <route.component />
            </PrivateRoute>
          }
        />
      ))}
    </Routes>
  );
});

export default App;