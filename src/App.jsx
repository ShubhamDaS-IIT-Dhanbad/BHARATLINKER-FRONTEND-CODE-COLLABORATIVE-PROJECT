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
//Shop Card
import SingleShopCard from './components/singleShop/singleShop.jsx'
import RefurbishedPage from "./components/refurbishedPage/refurbishedPage.jsx";
import RefurbishedProductSortBySection from "./components/searchPage/sortbySection.jsx";
import RefurbishedProductFilterSection from "./components/refurbishedPage/filterSection.jsx";


//retailer routes
import Retailer from './components/retailer/retailer.jsx'
import RetailerRoutes from './components/retailer/retailerRoutes.jsx';

//user routes
import User from './components/user/userHome.jsx'
import RefurbishedBooksUploadUser from './components/user/booksUploadComponent/booksUpload.jsx'
import RefurbishedGadgetsUploadUser from './components/user/gadgetsUploadComponent/gadgetsUpload.jsx'
import UserProductPageMain from './components/user/productPage/userProductPageMain.jsx'
import UserUpdateBook  from './components/user/updateComponent/userUpdateBook.jsx';
import UserUpdateModule  from './components/user/updateComponent/userUpdateModule.jsx';
import UserUpdateGadget from './components/user/UpdateComponent/userUpdateGadget.jsx';

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

         {/* refurbished products */}
         <Route path="/refurbished" element={<RefurbishedPage />} />
         <Route path="/refurbished/sortby" element={<RefurbishedProductSortBySection />} />
         <Route path="/refurbished/filter" element={<RefurbishedProductFilterSection />} />

        {/* retailer routes */}
        <Route path='/retailer' element={<Retailer />} />
        <Route path="/*" element={<RetailerRoutes />} />

        {/* user routes */}
        <Route path='/user' element={<User />} />
        <Route path='/user/upload/books' element={<RefurbishedBooksUploadUser/>} />
        <Route path='/user/upload/gadgets' element={<RefurbishedGadgetsUploadUser/>} />
        <Route path='/user/refurbished' element={<UserProductPageMain/>} />
        <Route path='/user/refurbished/update/book/:id' element={<UserUpdateBook />} />
        <Route path='/user/refurbished/update/module/:id' element={<UserUpdateModule/>} />
        <Route path='/user/refurbished/update/gadget/:id' element={<UserUpdateGadget/>} />
        <Route path='/user/privacy' element={<Retailer />} />

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
