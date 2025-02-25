import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Oval } from 'react-loader-spinner';

import { useShopProductExecuteSearch } from '../../../hooks/retailerProductHook.jsx';
import { resetShopProducts } from '../../../redux/features/retailer/product.jsx';
import ProductList from './productList.jsx';
import Navbar from '../navbar.jsx';
import './product.css';

const RetailerProduct = React.memo(({ shopData }) => {
    const dispatch = useDispatch();

    const { products, loaded, loading, error, hasMoreProducts, loadingMoreProducts } = useSelector(
        (state) => state.retailerProducts
    );

    const { executeShopProductSearch, onLoadMoreShopProduct } = useShopProductExecuteSearch(shopData?.shopId);

    const handleSearch = useCallback(() => {
        executeShopProductSearch();
    }, [executeShopProductSearch]);

    // Handle Load More
    const handleLoadMore = useCallback(() => {
        onLoadMoreShopProduct();
    }, [onLoadMoreShopProduct]);

    // Handle Retry on Error
    const handleRetry = useCallback(() => {
        dispatch(resetShopProducts());
        handleSearch();
    }, [dispatch, handleSearch]);

    // Initial Fetch on Mount
    useEffect(() => {
        if (!loaded) executeShopProductSearch();
    }, [executeShopProductSearch, loaded]);

    return (
        <>
            <Helmet>
                <title>Retailer Products | Bharat Linker</title>
                <meta name="description" content="Browse and search for refurbished products offered by Bharat Linker." />
                <meta name="keywords" content="refurbished products, buy refurbished, Bharat Linker" />
            </Helmet>

            {/* Navbar with search functionality */}
            <Navbar
             shopData={shopData}
                headerTitle="SHOP PRODUCTS"
                executeShopProductSearch={handleSearch}
                infoTitle="Product Search Guide"
                infoDescription="You can search products by name or product ID."
            />


            <main >
                {loading && !products?.length ? (
                    <div className="shop-product-fallback-loading">
                        <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={products?.length || 0}
                        next={handleLoadMore}
                        hasMore={hasMoreProducts && !loadingMoreProducts}
                        loader={
                            loadingMoreProducts && (
                                <div className="shop-product-fallback-loading">
                                    <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                                </div>
                            )
                        }
               
                    >
                        <ProductList products={products || []} loading={loading} />
                    </InfiniteScroll>
                )}

                {/* Error Handling */}
                {error && (
                    <div className="error-container">
                        <p>Error: {error}</p>
                        <button onClick={handleRetry} aria-label="Retry loading products">
                            Retry
                        </button>
                    </div>
                )}
            </main>
        </>
    );
});

export default RetailerProduct;
