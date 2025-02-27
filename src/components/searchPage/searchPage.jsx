import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import { Oval } from 'react-loader-spinner';
import 'react-loading-skeleton/dist/skeleton.css';

import AddToCartTab from "../viewCartTab/viewCart.jsx";
import SearchBar from '../navbar.jsx';
import ProductList from '../productList.jsx';
import ProductSortBySection from './sortbySection.jsx';
import ProductFilterBySection from './filterSection.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useExecuteSearch } from '../../hooks/searchProductHook';

import s1 from '../../assets/s1.png';
import './searchPage.css';

const SearchPage = () => {
    const { executeSearch, onLoadMore } = useExecuteSearch();  
    const {totalQuantity, totalPrice} = useSelector((state) => state.userCart);
    

    const [showSortBy, setShowSortBy] = useState(false);
    const [showFilterBy, setShowFilterBy] = useState(false);

    const {
        updated,
        products = [],
        loading,
        loadingMoreProducts,
        hasMoreProducts,
        sortByAsc,
        sortByDesc,
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
                    headerTitle={"SEARCH PAGE"}
                    handleSearchSubmit={executeSearch}
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

            {showSortBy && (
                <ProductSortBySection
                    handleSearch={executeSearch}
                    showSortBy={showSortBy}
                    setShowSortBy={setShowSortBy}
                    sortByAsc={sortByAsc}
                    sortByDesc={sortByDesc}
                    products={products}
                />
            )}

            {showFilterBy && (
                <ProductFilterBySection
                    handleSearch={executeSearch}
                    showFilterBy={showFilterBy}
                    setShowFilterBy={setShowFilterBy}
                />
            )}
            {!loading &&<AddToCartTab totalQuantity={totalQuantity} totalPrice={totalPrice} />}
            
        </>
    );
};

export default SearchPage;
