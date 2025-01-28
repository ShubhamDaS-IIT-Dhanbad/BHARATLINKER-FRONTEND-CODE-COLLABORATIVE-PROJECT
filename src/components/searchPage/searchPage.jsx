import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import { Oval } from 'react-loader-spinner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import SearchBar from '../a.navbarComponent/navbar.jsx';
import ProductList from '../b.productComponent/productList.jsx';
import ProductSortBySection from './sortbySection.jsx';
import ProductFilterBySection from './filterSection.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useExecuteSearch } from '../../hooks/searchProductHook';
import './searchPage.css';

const SearchPage = () => {
    const { executeSearch, onLoadMore } = useExecuteSearch();

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

    const selectedBrands = useSelector(
        (state) => state.searchproductsfiltersection.selectedBrands
    ) || [];
    const selectedCategories = useSelector(
        (state) => state.searchproductsfiltersection.selectedCategories
    ) || [];

    useEffect(() => {
        if (products.length === 0 && !loading) {
            const inputValue = "";
            executeSearch(inputValue);
        }
    }, [updated, selectedBrands, selectedCategories]);

    const skeletons = [1, 2, 3, 4, 5, 6];
    return (
        <>
            <div id="productSearchPage-container-top">
                <SearchBar
                    headerTitle={"SEARCH PAGE"}
                    handleSearchSubmit={executeSearch}
                />
            </div>

            {loading ? (
                // <div id="skleton-page-grid">
                //     {skeletons.map((_, index) => (
                //         <div className="product-card-skleton" key={index}>
                //             <Skeleton height="250px" width="200px" />
                //             <div className="product-card-skleton-bottom">
                //                 <Skeleton height="30px" />
                //                 <Skeleton height={50} />
                //             </div>
                //         </div>
                //     ))}
                // </div>
                <div className="fallback-loading">
                    <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />

                </div>

            ) : (
                <InfiniteScroll
                    dataLength={products.length}
                    next={onLoadMore}
                    hasMore={hasMoreProducts}
                    loader={loadingMoreProducts && <h4>Loading more products...</h4>}
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
            <div id="productSearchPage-footer">
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
            </div>
        </>
    );
};

export default SearchPage;
