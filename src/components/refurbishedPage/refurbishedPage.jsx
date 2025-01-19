import React, { useState, useEffect } from 'react'; // Added useEffect import
import { LiaSortSolid } from 'react-icons/lia';
import { MdFilterList } from 'react-icons/md';
import InfiniteScroll from 'react-infinite-scroll-component';

import RefurbishedNavbar from '../a.navbarComponent/navbar.jsx';
import RefurbishedProductList from './refurbishedProductList';

import RefurbishedProductSortBySection from './sortBySection';
import RefurbishedProductFilterBySection from './filterSection';
import { useSelector } from 'react-redux';
import './refurbishedPage.css';

import { useSearchRefurbishedProductsHook } from '../../hooks/searchRefurbishedHook.jsx';

import { RotatingLines } from 'react-loader-spinner';

const RefurbishedPage = () => {
  const { executeSearchRefurbished, onLoadMoreRefurbished } = useSearchRefurbishedProductsHook();

  const [showSortBy, setShowSortBy] = useState(false);
  const [showFilterBy, setShowFilterBy] = useState(false);

  const {
    refurbishedProducts,
    updated,
    hasMoreProducts,
    loading,
    loadingMoreProducts,
    sortByAsc,
    sortByDesc
  } = useSelector((state) => state.refurbishedproducts);

  useEffect(() => {
    if (refurbishedProducts.length === 0) {
      executeSearchRefurbished();
    }
  }, [refurbishedProducts.length, updated]); 

  return (
    <>
      <div id="refurbishedPage-container-top">
        <RefurbishedNavbar
          headerTitle={"REFURBISHED PAGE"}
        />
      </div>
      <div>
        {loading ? (
          <div className="refurbished-page-loading-container">
            <RotatingLines width="60" height="60" color="#007bff" />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={refurbishedProducts.length}
            next={onLoadMoreRefurbished}
            hasMore={hasMoreProducts}
            loader={loadingMoreProducts && <h4>Loading more products...</h4>}
          >
            <RefurbishedProductList
              products={refurbishedProducts}
              loading={loading}
              sortByAsc={sortByAsc}
              sortByDesc={sortByDesc}
            />
          </InfiniteScroll>
        )}

        {showSortBy && (
          <RefurbishedProductSortBySection
            handleSearch={handleSearch}
            showSortBy={showSortBy}
            setShowSortBy={setShowSortBy}
            sortByAsc={sortByAsc}
            sortByDesc={sortByDesc}
          />
        )}
        {showFilterBy && (
          <RefurbishedProductFilterBySection
            handleSearch={handleSearch}
            showFilterBy={showFilterBy}
            setShowFilterBy={setShowFilterBy}
            sortByAsc={sortByAsc}
            sortByDesc={sortByDesc}
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
    </>
  );
};

export default RefurbishedPage;
