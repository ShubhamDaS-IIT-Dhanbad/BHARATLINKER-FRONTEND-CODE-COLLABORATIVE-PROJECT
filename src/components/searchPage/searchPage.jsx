import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useExecuteSearch } from '../../hooks/searchProductHook.jsx';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import SearchBar from '../a.navbarComponent/navbar.jsx';
import ProductList from '../b.productComponent/productList.jsx';

import { RotatingLines,Oval } from 'react-loader-spinner';

import InfiniteScroll from 'react-infinite-scroll-component';

import ProductSortBySection from './sortbySection.jsx';
import ProductFilterBySection from './filterSection.jsx';

import './searchPage.css';

const SearchPage = ({ isProductPageLoaded, setProductPageLoaded }) => {
    const { executeSearch, onLoadMore } = useExecuteSearch();

    const [showSortBy, setShowSortBy] = useState(false);
    const [showFilterBy, setShowFilterBy] = useState(false);

    const {
        updated,
        products,
        loading,
        loadingMoreProducts,
        hasMoreProducts,
        sortByAsc,
        sortByDesc,
    } = useSelector((state) => state.searchproducts);
      const selectedBrands = useSelector(
        (state) => state.searchproductsfiltersection.selectedBrands
      );
      const selectedCategories = useSelector(
        (state) => state.searchproductsfiltersection.selectedCategories
      );
    

    useEffect(() => {
        if (products.length === 0) {
            executeSearch();
        }
        const delayTimeout = setTimeout(() => {
            setProductPageLoaded(true);
        }, 500);

        return () => clearTimeout(delayTimeout);
    }, [updated,selectedBrands,selectedCategories]);

    return (
        <>
            {(!isProductPageLoaded) ? (
                <div className="fallback-loading">
                   <Oval height={30} width={30} color="white" secondaryColor="gray" ariaLabel="loading" />
                </div>
            ) : (
                <>
                    <div id="productSearchPage-container-top">
                        <SearchBar
                            headerTitle={"SEARCH PAGE"}
                            handleSearchSubmit={executeSearch}
                        />
                    </div>

                    {(loading || !isProductPageLoaded) ? (
                        <div className="fallback-loading">
                            <Oval height={30} width={30} color="white" secondaryColor="gray" ariaLabel="loading" />                                   
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={products.length}
                            next={onLoadMore}
                            hasMore={hasMoreProducts}
                            loader={loadingMoreProducts && <h4>Loading more products...</h4>}
                        >
                            <ProductList/>
                        </InfiniteScroll>)}

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
                </>)}
        </>
    );
};

export default SearchPage;
