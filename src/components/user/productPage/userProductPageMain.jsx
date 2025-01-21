import React, { useEffect} from 'react';
import { useSelector } from 'react-redux';

import { Helmet } from 'react-helmet';
import Navbar from '../a.navbarComponent/navbar.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RotatingLines } from 'react-loader-spinner';
import { Oval } from 'react-loader-spinner';

import { useExecuteUserSearch } from '../../../hooks/searchUserProductHook.jsx';
import ProductList from '../../b.productComponent/productList.jsx';


import './userProductPageMain.css';

function UserRefurbishedProduct() {
    const { executeSearch, onLoadMore } = useExecuteUserSearch();
    const {
        refurbishedProducts,
        loading,
        error,
        hasMoreProducts,
        loadingMoreProducts,
    } = useSelector((state) => state.userRefurbishedProducts);

    useEffect(() => {
        if (refurbishedProducts.length === 0 && !loading) {
            executeSearch();
        }
    }, []);

 
    const handleSearch = () => {
        executeSearch(); 
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
