import React, { useState, useEffect } from 'react';
import { LiaSortSolid } from 'react-icons/lia';
import { MdFilterList } from 'react-icons/md';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { Oval } from "react-loader-spinner";

import RefurbishedNavbar from '../a.navbarComponent/navbar.jsx';
import RefurbishedProductList from './refurbishedProductList';
import RefurbishedProductSortBySection from './sortBySection';
import RefurbishedProductFilterBySection from './filterSection';
import { useSearchRefurbishedProductsHook } from '../../hooks/searchRefurbishedHook.jsx';

import './refurbishedPage.css';

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
  const selectedBrands = useSelector(
    (state) => state.refurbishedproductsfiltersection.selectedRefurbishedBrands
  );
  const selectedCategories = useSelector(
    (state) => state.refurbishedproductsfiltersection.selectedRefurbishedCategories
  );

  useEffect(() => {
    if (refurbishedProducts.length === 0) {
      executeSearchRefurbished();
    }
  }, [updated, selectedBrands, selectedCategories]);

  return (
    <>
          <div id="refurbishedPage-container-top">
            <RefurbishedNavbar headerTitle={"REFURBISHED PAGE"} />
          </div>

          {(loading) ? (
            <div className="fallback-loading">
              <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />

            </div>
          ) : (
            <InfiniteScroll
              dataLength={refurbishedProducts.length}
              next={onLoadMoreRefurbished}
              hasMore={hasMoreProducts}
              loader={loadingMoreProducts && (
                <div id="search-shop-load-more-shop-loader">
                  <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                </div>
              )}
            >
              <RefurbishedProductList
                products={refurbishedProducts}
                loading={loading}
                sortByAsc={sortByAsc}
                sortByDesc={sortByDesc}
              />
            </InfiniteScroll>)
          }

          {showSortBy && (
            <RefurbishedProductSortBySection
              showSortBy={showSortBy}
              setShowSortBy={setShowSortBy}
              sortByAsc={sortByAsc}
              sortByDesc={sortByDesc}
            />
          )}

          {showFilterBy && (
            <RefurbishedProductFilterBySection
              showFilterBy={showFilterBy}
              setShowFilterBy={setShowFilterBy}
            />
          )}

          <div id="refurbishedProductPage-footer">
            <div
              id="refurbishedProductPage-footer-sortby"
              onClick={() => setShowSortBy(true)}
              role="button"
              tabIndex="0"
              aria-label="Open sort by section"
            >
              <LiaSortSolid size={33} />
              SORT BY
            </div>
            <div
              id="refurbishedProductPage-footer-filterby"
              onClick={() => setShowFilterBy(true)}
              role="button"
              tabIndex="0"
              aria-label="Open filter by section"
            >
              <MdFilterList size={33} />
              FILTER BY
            </div>
          </div>

        
    </>);
};

export default RefurbishedPage;
