/*COMPLETE*/
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { useExecuteSearch } from '../../hooks/searchProductHook.jsx';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import SearchBar from './searchBar';
import ProductList from './productList.jsx';
import { RotatingLines } from 'react-loader-spinner';

import InfiniteScroll from 'react-infinite-scroll-component';

import ProductSortBySection from './sortbySection.jsx';
import ProductFilterBySection from './filterSection.jsx';

import './searchPage.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { inputValue, setInputValue, executeSearch,onLoadMore } = useExecuteSearch();

    const [showSortBy, setShowSortBy] = useState(false);
    const [showFilterBy, setShowFilterBy] = useState(false);

    const {
        products,
        loading,
        loadingMoreProducts,
        hasMoreProducts,
        sortByAsc,
        sortByDesc,
    } = useSelector((state) => state.searchproducts);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setSearchParams((prev) => ({
            ...Object.fromEntries(prev.entries()),
            query: value,
        }));
    };

   
    useEffect(() => {
        if (products.length == 0 && !loading) {executeSearch();}
    }, [products.length]);

    return (
        <>
            <div id="productSearchPage-container-top">
                <SearchBar
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    onSearch={executeSearch}
                    onNavigateHome={() => navigate('/')}
                />
            </div>
            {loading ? (
                <div className="refurbished-page-loading-container">
                    <RotatingLines width="60" height="60" color="#007bff" />
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={products.length}
                    next={onLoadMore}
                    hasMore={hasMoreProducts}
                    loader={loadingMoreProducts && <h4>Loading more products...</h4>}
                >
                    <ProductList
                        products={products}
                        hasMoreProducts={hasMoreProducts}
                        loadingMoreProducts={loadingMoreProducts}
                    />
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
