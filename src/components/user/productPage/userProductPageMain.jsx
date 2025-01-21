import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { BiSearchAlt } from "react-icons/bi";
import { Helmet } from 'react-helmet';
import Navbar from '../a.navbarComponent/navbar.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RotatingLines } from 'react-loader-spinner';
import { Oval } from 'react-loader-spinner';

import { useExecuteUserSearch } from '../../../hooks/searchUserProductHook.jsx';
import ProductList from '../../b.productComponent/productList.jsx';

import './userProductPageMain.css';

function UserRefurbishedProduct() {
    const navigate = useNavigate();
    const { executeSearch, onLoadMore } = useExecuteUserSearch();
    const {
        refurbishedProducts,
        loading,
        error,
        currentPage,
        hasMoreProducts,
        loadingMoreProducts,
    } = useSelector((state) => state.userRefurbishedProducts);

    const userData = useSelector((state) => state.user);

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (refurbishedProducts.length === 0 && !loading) {
            executeSearch();
        }
    }, []);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = () => {
        executeSearch(); // Trigger search when search button or enter key is pressed
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // Execute search on Enter key press
        }
    };

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
                <title>Your Refurbished Products | Bharat Linker</title>
                <meta name="description" content="Browse and search for refurbished products offered by Bharat Linker." />
                <meta name="keywords" content="refurbished products, buy refurbished, Bharat Linker" />
            </Helmet>
            <header>
                <div className="user-refurbished-product-page-header">
                <Navbar headerTitle={"YOUR REFURBISHED"} />
                </div>
            </header>
            <main>
                {loading ? (
                    <div className="fallback-loading">
                        <Oval height={30} width={30} color="white" secondaryColor="gray" ariaLabel="loading" />
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={refurbishedProducts.length}
                        next={onLoadMore}
                        hasMore={hasMoreProducts}
                    >
                        <ProductList products={refurbishedProducts} loading={loading} />
                    </InfiniteScroll>
                )}
                {loadingMoreProducts && (
                    <div className="user-refurbished-product-page-loading-more">
                        <RotatingLines width="40" height="40" color="#007bff" />
                    </div>
                )}
            </main>
        </div>
    );
}

export default UserRefurbishedProduct;
