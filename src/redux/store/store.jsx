import {configureStore} from '@reduxjs/toolkit';


// search page
import searchproducts from '../features/searchPage/searchProductSlice.jsx'
import searchproductsfiltersection from '../features/searchPage/searchProductFilterSectionSlice.jsx'

//search shops
import searchshops from '../features/searchShop/searchShopSlice.jsx'
import shopfiltersection from '../features/searchShop/shopFilterSection.jsx'
import singleshops from '../features/searchShop/singleShopSlice.jsx';

//shop products
import shopproducts from '../features/shopProducts/searchProductSlice.jsx'

//user
import userdata from '../features/user/userDataSlice.jsx'
import userCart from '../features/user/cartSlice.jsx'
import userorders from '../features/user/orderSlice.jsx'

//retailer products
import retailerProducts from '../features/retailer/product.jsx'
import retailerorders from '../features/retailer/orderSlice.jsx'


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
        //user 
        userdata:userdata,
        userCart:userCart,
        userorders:userorders,

        //retailer products
        retailerProducts:retailerProducts,
        retailerorders:retailerorders
    }
});
export default store;