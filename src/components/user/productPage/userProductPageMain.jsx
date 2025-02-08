import React, { useEffect} from 'react';
import { useSelector } from 'react-redux';

import { Helmet } from 'react-helmet';
import Navbar from '../navbar.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Oval } from 'react-loader-spinner';

import { useExecuteUserSearch } from '../../../hooks/searchUserProductHook.jsx';
import ProductList from '../../productList.jsx';


import '../style/userProductPageMain.css';

function UserRefurbishedProduct({userData}) {
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
                    <Navbar userData={userData} headerTitle={"YOUR REFURBISHED"} />
                </div>
            </header>
            <main>
                {loading ? (
                    <div className="fallback-loading">
                        <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
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
            </main>
        </div>
    );
}

export default UserRefurbishedProduct;
