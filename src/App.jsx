import React, { useMemo, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

import './App.css';

import HomePage from './components/homePage/home.jsx'
import LoginPage from './components/loginPage/login.jsx'

// search product section
import SearchPage from './components/searchPage/searchPage.jsx';
import SearchSorybySection from './components/searchPage/sortbySection.jsx';
import SearchFilterSection from './components/searchPage/filterSection.jsx';
//Product Card
import SingleProductCard from './components/singleProduct/singleProduct.jsx'

//search shop
import SearchShop from './components/searchShop/searchShop.jsx'
import ShopSorybySection from './components/searchShop/sortBySection.jsx';
import ShopFilterSection from './components/searchShop/filterSection.jsx';
//shop products
import ShopProducts from './components/shopProducts/shopProducts.jsx'

//Shop Card
import SingleShopCard from './components/singleShop/singleShop.jsx'

//Refurbished
import RefurbishedPage from "./components/refurbishedPage/refurbishedPage.jsx";
import SingleRefurbishedProductCard from './components/singleRefurbishedProduct/singleRefurbishedProduct.jsx'
//retailer routes
import Retailer from './components/retailer/retailer.jsx'
import RetailerRoutes from './components/retailer/retailerRoutes.jsx';

//user routes
import User from './components/user/userHome.jsx'
import UserProfile from './components/user/userProfile/userProfile.jsx';
import UserProductPageMain from './components/user/productPage/userProductPageMain.jsx'
import RefurbishedBooksUploadUser from './components/user/userProductUpload/userProductUpload.jsx'
import UserUpdateBookModule  from './components/user/userProductUpdate/userProductUpdate.jsx';
import UserNotification from './components/user/notification/userNotification.jsx'



function App() {

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <RoutesWithConditionalHeader/>
      </Suspense>
    </Router>
  );
}

const RoutesWithConditionalHeader = React.memo(({ address }) => {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  const { isRetailerHeaderFooter, isRetailerProductHeaderFooter, isHomepage } = useMemo(() => {
    return {
      isRetailerHeaderFooter: location.pathname.startsWith('/retailer/home') ||
        location.pathname.startsWith('/retailer/shop') ||
        location.pathname.startsWith('/retailer/data'),
      isRetailerProductHeaderFooter: location.pathname.startsWith('/retailer/product') ||
        location.pathname.startsWith('/retailer/uploadproduct') ||
        location.pathname.startsWith('/retailer/updateproduct'),
      isHomepage: location.pathname === '/',
    };
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />

        {/* search section */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/sortby" element={<SearchSorybySection />} />
        <Route path="search/filterby" element={<SearchFilterSection/>}/>
        {/* Single Product */}
        <Route path="/product/:productId" element={<SingleProductCard/>} />

        {/* search shop */}
        <Route path="/shop" element={<SearchShop />} />
        <Route path="/shop/sortby" element={<ShopSorybySection />} />
        <Route path="shop/filterby" element={<ShopFilterSection/>}/>



         {/* Single Shop */}
         <Route path="/shop/:shopId" element={<SingleShopCard/>} />
          {/* Shop Products */}
          <Route path="/shop/product/:shopId" element={<ShopProducts/>} />




         {/* refurbished products */}
         <Route path="/refurbished" element={<RefurbishedPage />} />
         <Route path="/refurbished/:refurbishedId" element={<SingleRefurbishedProductCard/>} />

        {/* retailer routes */}
        <Route path='/retailer' element={<Retailer />} />
        <Route path="/*" element={<RetailerRoutes />} />

        {/* user routes */}
        <Route path='/user' element={<User />} />
        <Route path='/user/profile' element={<UserProfile />} />
        <Route path='/user/refurbished' element={<UserProductPageMain/>} />
        <Route path='/user/upload/:productType' element={<RefurbishedBooksUploadUser/>} />
        <Route path='/user/refurbished/update/:id' element={<UserUpdateBookModule/>}/>
        <Route path='/user/notification' element={<UserNotification/>}/>
        <Route path='/user/privacy' element={<>private boss</>} />

      </Routes>
    </>
  );
});

const LoadingFallback = () => (
  <>
    <div style={{ width: '100vw', height: "57px", position: "fixed", top: "0px", backgroundColor: 'rgb(135, 162, 255)' }} />
    <div style={{ width: '100vw', height: "57px", position: "fixed", bottom: "0px", backgroundColor: 'rgb(135, 162, 255)' }} />
  </>
);

export default App;
