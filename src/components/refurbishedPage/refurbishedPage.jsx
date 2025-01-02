import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRefurbishedProducts, loadMoreRefurbishedProducts } from '../../redux/features/refurbishedProductsSlice';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import InfiniteScroll from 'react-infinite-scroll-component';
import RefurbishedNavbar from './refurbishedNavbar';
import RefurbishedProductList from './refurbishedProductList';
import RefurbishedProductSortBySection from './sortBySection';
import RefurbishedProductFilterBySection from './filterSection';
import './refurbishedPage.css';

const RefurbishedPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchInput, setSearchInput] = useState('');
    const [showSortBy, setShowSortBy] = useState(false);
    const [showFilterBy, setShowFilterBy] = useState(false);

    const {
        refurbishedProducts,
        currentPage,
        hasMoreProducts,
        hasMoreProductsBook,
        hasMoreProductsModule,
        hasMoreProductsGadgets,
        error,
        loading,
        loadingMoreProducts
    } = useSelector(state => state.refurbishedproducts);

    const selectedCategories = useSelector(state => state.refurbishedproductfiltersection.selectedCategories);
    const selectedBrands = useSelector(state => state.refurbishedproductfiltersection.selectedBrands);
    const selectedClasses = useSelector(state => state.refurbishedproductfiltersection.selectedClasses);
    const selectedExams = useSelector(state => state.refurbishedproductfiltersection.selectedExams);
    const selectedLanguages = useSelector(state => state.refurbishedproductfiltersection.selectedLanguages);
    const selectedBoards = useSelector(state => state.refurbishedproductfiltersection.selectedBoards);

    const handleSearch = () => {
        const params = {
            inputValue: searchInput.trim(),
            page: 1,
            productsPerPage: 8,
            pinCodes: [742136],
            selectedCategories,
            selectedClasses,
            selectedExams,
            selectedLanguages,
            selectedBoards,
            selectedBrands,
            hasMoreProductsBook,
            hasMoreProductsModule,
            hasMoreProductsGadgets,
            sortByAsc: null,
            sortByDesc: null,
        };
        dispatch(fetchRefurbishedProducts(params));
    };

    useEffect(() => {
        if (refurbishedProducts.length === 0) handleSearch();
    }, [searchInput]);

    const handleLoadMore = () => {
        if (!hasMoreProducts || loadingMoreProducts) return;

        const params = {
            inputValue: searchInput.trim(),
            page: currentPage + 1,
            productsPerPage: 8,
            pinCodes: [742136],
            selectedCategories,
            selectedClasses,
            selectedExams,
            selectedLanguages,
            selectedBoards,
            selectedBrands,
            hasMoreProductsBook,
            hasMoreProductsModule,
            hasMoreProductsGadgets,
            sortByAsc: null,
            sortByDesc: null,
        };
        dispatch(loadMoreRefurbishedProducts(params));
    };

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={handleSearch}>Retry</button>
            </div>
        );
    }

    return (
        <div className='refurbished-main-container'>
            <RefurbishedNavbar setSearchInput={setSearchInput} />
            <InfiniteScroll
                dataLength={refurbishedProducts.length}
                next={handleLoadMore}
                hasMore={hasMoreProducts}
                loader={loadingMoreProducts && <h4>Loading more products...</h4>}
                endMessage={<p>No more products available</p>}
            >
                <RefurbishedProductList products={refurbishedProducts} loading={loading} />
            </InfiniteScroll>
            {showSortBy && (
                <RefurbishedProductSortBySection
                    showSortBy={showSortBy}
                    setShowSortBy={setShowSortBy}
                />
            )}
            {showFilterBy && (
                <RefurbishedProductFilterBySection
                    showFilterBy={showFilterBy}
                    setShowFilterBy={setShowFilterBy}
                />
            )}
            <div id='refurbishedProductPage-footer'>
                <div
                    id='refurbishedProductPage-footer-sortby'
                    onClick={() => setShowSortBy(true)}
                    role="button"
                    tabIndex="0"
                    aria-label="Open sort by section"
                >
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div
                    id='refurbishedProductPage-footer-filterby'
                    onClick={() => setShowFilterBy(true)}
                    role="button"
                    tabIndex="0"
                    aria-label="Open filter by section"
                >
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </div>
    );
};

export default RefurbishedPage;
