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
import './searchPage.css';

const SearchPage = () => {
    const { executeSearch, onLoadMore } = useExecuteSearch();  
    const { cart, totalQuantity, totalPrice, isCartFetched } = useSelector((state) => state.userCart);
    

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
                <div className="fallback-loading">
                    <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
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
            {!loading &&
                <AddToCartTab totalQuantity={totalQuantity} totalPrice={totalPrice} />}
            {/* <div id="productSearchPage-footer">
                <div
                    id="productSearchPage-footer-sortby"
                    onClick={() => setShowSortBy(!showSortBy)}
                >
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div
                    id="productSearchPage-footer-filterby"
                    onClick={() => setShowFilterBy(!showFilterBy)}
                >
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div> */}
        </>
    );
};

export default SearchPage;
