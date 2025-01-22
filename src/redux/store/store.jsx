import {configureStore} from '@reduxjs/toolkit';


// search page
import searchproducts from '../features/searchPage/searchProductSlice.jsx'
import searchproductsfiltersection from '../features/searchPage/searchProductFilterSectionSlice.jsx'

//search shops
import searchshops from '../features/searchShop/searchShopSlice.jsx'
import shopfiltersection from '../features/searchShop/shopFilterSection.jsx'
import singleshops from '../features/singleShopSlice.jsx'

//shop products
import shopproducts from '../features/shopProducts/searchProductSlice.jsx'

//refurbished products
import refurbishedproducts from '../features/refurbishedPage/refurbishedProductsSlice.jsx'
import refurbishedproductsfiltersection from '../features/refurbishedPage/refurbishedProductFilterSectionSlice.jsx';

//user refurbished products
import userRefurbishedProducts from '../features/user/userAllRefurbishedProductsSlice.jsx'
import userOrders from '../features/user/orderSlice.jsx'

//retailer products
import retailerProducts from '../features/retailer/product.jsx'


const store=configureStore({
    reducer:{
        // search page
        searchproducts:searchproducts,
        searchproductsfiltersection:searchproductsfiltersection,

        //search shops
        searchshops:searchshops,
        shopfiltersection:shopfiltersection,
        singleshops:singleshops,

        //shop products
        shopproducts:shopproducts,

        //refurbished products
        refurbishedproducts:refurbishedproducts,
        refurbishedproductsfiltersection:refurbishedproductsfiltersection,

        //user refurbished products
        userRefurbishedProducts:userRefurbishedProducts,
        userOrders:userOrders,

        //retailer products
        retailerProducts:retailerProducts
    }
});
export default store;