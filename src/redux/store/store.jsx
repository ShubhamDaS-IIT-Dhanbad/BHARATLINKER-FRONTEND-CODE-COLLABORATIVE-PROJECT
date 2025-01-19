import {configureStore} from '@reduxjs/toolkit';


// search page
import searchproducts from '../features/searchPage/searchProductSlice.jsx'
import searchproductsfiltersection from '../features/searchPage/searchProductFilterSectionSlice.jsx'

//search shops
import searchshops from '../features/searchShopSlice.jsx'
import searchshopfiltersection from '../features/searchShopFilterSectionSlice.jsx'
import searchshopsortbysection from '../features/searchShopSortbySectionSlice.jsx'
import singleshops from '../features/singleShopSlice.jsx'

//shop products
import shopproducts from '../features/shopProducts/searchProductSlice.jsx'

//refurbished products
import refurbishedproducts from '../features/refurbishedPage/refurbishedProductsSlice.jsx'

//user refurbished products
import userRefurbishedProducts from '../features/user/userAllRefurbishedProductsSlice.jsx'

//retailer products
import retailerProducts from '../features/retailer/product.jsx'


const store=configureStore({
    reducer:{
        // search page
        searchproducts:searchproducts,
        searchproductsfiltersection:searchproductsfiltersection,

        //search shops
        searchshops:searchshops,
        searchshopfiltersection:searchshopfiltersection,
        searchshopsortbysection:searchshopsortbysection,
        singleshops:singleshops,

        //shop products
        shopproducts:shopproducts,

        //refurbished products
        refurbishedproducts:refurbishedproducts,

        //user refurbished products
        userRefurbishedProducts:userRefurbishedProducts,

        //retailer products
        retailerProducts:retailerProducts
    }
});
export default store;