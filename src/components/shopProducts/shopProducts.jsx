import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import ProductList from './productList.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import s1 from '../../assets/s1.png'
import Navbar from '../navbar.jsx';

import AddToCartTab from "../viewCartTab/viewCart.jsx";

import { useShopProductExecuteSearch } from '../../hooks/searchShopProductHook.jsx';
import './shopProducts.css';

const ProductSearch = () => {
    const location = useLocation();
    const { shopId } = useParams();
    
        const {totalQuantity, totalPrice} = useSelector((state) => state.userCart);

    // Parse shopName from query params
    const queryParams = new URLSearchParams(location.search);
    const shopName = queryParams.get('shopName') || '';

    // ✅ Pass `shopId` to the custom hook
    const { executeShopProductSearch, onLoadMoreShopProduct } = useShopProductExecuteSearch(shopId);


    const shopData = useSelector((state) => state.shopproducts.shops[shopId]) || {};
    const { loading } = useSelector((state) => state.shopproducts);

    const {
        products = [],
        hasMoreProducts = false,
    } = shopData;

    const globalLoading = useSelector((state) => state.shopproducts.loading);

    // Initial search when the component loads
    const handleInitialSearch = useCallback(() => {
        if (products.length === 0 && !globalLoading) {
            executeShopProductSearch();
        }
    }, []);

    useEffect(() => {
        handleInitialSearch();
    }, [handleInitialSearch]);

    return (
        <>
            <div id="shopSearchPage-container-top">
                <Navbar headerTitle={shopName.slice(0, 20).toUpperCase()} shopId={shopId} />
            </div>

            {loading ? (
                <div className="fallback-loading-img">
                    <img src={s1} />
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={products.length}
                    next={onLoadMoreShopProduct}
                    hasMore={hasMoreProducts}
                    loader={<h4>Loading more products...</h4>}
                    scrollThreshold={0.9}
                >
                    <ProductList products={products} />
                </InfiniteScroll>
            )}
            
            <AddToCartTab totalQuantity={totalQuantity} totalPrice={totalPrice} />
        </>
    );
};

export default ProductSearch;
