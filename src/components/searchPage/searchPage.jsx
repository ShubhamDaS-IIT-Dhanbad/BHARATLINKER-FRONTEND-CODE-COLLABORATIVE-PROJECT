import React, { useEffect,useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Oval } from 'react-loader-spinner';
import 'react-loading-skeleton/dist/skeleton.css';

import AddToCartTab from "../viewCartTab/viewCart.jsx";
import SearchBar from '../navbar.jsx';
import ProductList from '../productList.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useExecuteSearch } from '../../hooks/searchProductHook';

const s1="https://res.cloudinary.com/demc9mecm/image/upload/v1741102460/s1_i7wbfi.png";
import './searchPage.css';

const SearchPage = () => {
    const { executeSearch, onLoadMore } = useExecuteSearch();  
    const {totalQuantity, totalPrice} = useSelector((state) => state.userCart);
    


    const {
        updated,
        products = [],
        loading,
        loadingMoreProducts,
        hasMoreProducts,
    } = useSelector((state) => state.searchproducts);

    const handleInitialSearch = useCallback(() => {
        if (products.length === 0 && !loading) {
            executeSearch();
        }
    }, [products.length, updated]);
    useEffect(() => {
        handleInitialSearch();
    }, [products.length, updated]);

    return (
        <>
            <div id="productSearchPage-container-top">
                <SearchBar
                    headerTitle={"SEARCH PRODUCT"}
                />
            </div>

            {loading ? (
                <div className="fallback-loading-img">
                   <img src={s1} />
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={products.length}
                    next={onLoadMore}
                    hasMore={hasMoreProducts}
                    loader={loadingMoreProducts && <div className="fallback-loading">
                        <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                    </div>}
                >
                    <ProductList />
                </InfiniteScroll>
            )}

            
            {!loading &&<AddToCartTab totalQuantity={totalQuantity} totalPrice={totalPrice} />}
            
        </>
    );
};

export default SearchPage;
