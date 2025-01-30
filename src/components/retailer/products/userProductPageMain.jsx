import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { BiSearchAlt } from "react-icons/bi";
import { Helmet } from 'react-helmet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Oval } from 'react-loader-spinner';

import {
    fetchProducts,
    loadMoreProducts,
    resetProducts,
} from '../../../redux/features/retailer/product.jsx';

import ProductList from './productList.jsx';
import './product.css';
import Cookies from 'js-cookie';

const retailerProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        products,
        loading,
        error,
        currentPage,
        hasMoreProducts,
        loadingMoreProducts,
    } = useSelector((state) => state.retailerProducts);

    const [inputValue, setInputValue] = useState('');
    const [userData, setUserData] = useState(null);

    // Fetch user data from cookies on component mount
    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerShopData');
        if (userSession) {
            setUserData(JSON.parse(userSession));
        }
    }, []);

    // Debounced search function
    const handleSearch = useCallback(() => {
        if (!userData?.$id) return;
        const params = {
            inputValue,
            page: 1,
            productsPerPage: 8,
            selectedCategories: [],
            selectedBrands: [],
            sortByAsc: false,
            sortByDesc: false,
            shopId: userData.$id,
        };
        dispatch(resetProducts());
        dispatch(fetchProducts(params));
    }, [dispatch, inputValue, userData]);

    // Input change handler for search
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // Handle "Enter" key press for search
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // Fetch products on initial render if no products exist
    useEffect(() => {
        if (products.length === 0 && userData) {
            handleSearch();
        }
    }, [userData, products.length, handleSearch]);

    // Handle loading more products
    const handleLoadMore = () => {
        if (!hasMoreProducts || loadingMoreProducts || !userData?.$id) return;

        const params = {
            inputValue,
            page: currentPage + 1,
            productsPerPage: 8,
            selectedCategories: [],
            selectedBrands: [],
            sortByAsc: false,
            sortByDesc: false,
            shopId: userData.$id,
        };
        dispatch(loadMoreProducts(params));
    };

    // Error handling
    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={handleSearch}>Retry</button>
            </div>
        );
    }

    return (
        <div className="user-product-page-body">
            <Helmet>
                <title>Retailer Products | Bharat Linker</title>
                <meta name="description" content="Browse and search for refurbished products offered by Bharat Linker." />
                <meta name="keywords" content="refurbished products, buy refurbished, Bharat Linker" />
            </Helmet>


            <header>
                <div className="retailer-product-page-header">
                    <div className="retailer-product-page-header-upper">
                        <FaArrowLeft
                            id="retailer-product-page-left-icon"
                            size={25}
                            onClick={() => navigate('/retailer')}
                            aria-label="Go back to User Account"
                            tabIndex={0}
                        />
                        <div className="retailer-product-page-header-inner">
                            <h1 className="retailer-product-page-header-text">ALL PRODUCTS</h1>
                            {userData?.shopName && (
                                <div
                                    className={`retailer-product-header-shopname`}
                                    aria-label="Change Location"
                                    tabIndex={0}
                                >
                                    {userData?.shopName}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="retailer-product-page-search-section">
                        <div className="retailer-product-page-search-input-container">
                            <BiSearchAlt
                                className="retailer-product-page-search-icon"
                                onClick={handleSearch}
                                aria-label="Search Products"
                                tabIndex={0}
                            />
                            <input
                                className="retailer-product-page-search-input"
                                placeholder="Search Products"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                aria-label="Search input"
                            />
                        </div>
                    </div>
                </div>
            </header>






            <main>
                {loading ? (
                    <div className="fallback-loading">
                        <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={products?.length}
                        next={handleLoadMore}
                        hasMore={hasMoreProducts}
                        loader={
                            <div className="fallback-loading">
                                <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                            </div>}
                    >
                        <ProductList products={products} loading={loading} />
                    </InfiniteScroll>
                )}
            </main>
        </div>
    );
};

export default retailerProduct;
