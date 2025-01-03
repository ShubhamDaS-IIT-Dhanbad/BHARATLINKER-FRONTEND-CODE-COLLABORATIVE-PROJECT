import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRefurbishedProducts, loadMoreRefurbishedProducts, resetRefurbishedProducts } from '../../redux/features/refurbishedProductsSlice';
import { LiaSortSolid } from 'react-icons/lia';
import { MdFilterList } from 'react-icons/md';
import InfiniteScroll from 'react-infinite-scroll-component';
import RefurbishedNavbar from './refurbishedNavbar';
import RefurbishedProductList from './refurbishedProductList';
import RefurbishedProductSortBySection from './sortBySection';
import RefurbishedProductFilterBySection from './filterSection';
import './refurbishedPage.css';
import { RotatingLines } from 'react-loader-spinner'; // Import the loader spinner
import { useSearchParams } from 'react-router-dom';

const RefurbishedPage = () => {
  const dispatch = useDispatch();

  // Local state hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [inputValue, setInputValue] = useState(query);

  const [showSortBy, setShowSortBy] = useState(false);
  const [showFilterBy, setShowFilterBy] = useState(false);

  const { sortByAsc, sortByDesc } = useSelector((state) => state.refurbishedproductsortbysection);

  // Redux state
  const {
    refurbishedProducts,
    currentPage,
    hasMoreProducts,
    loading,
    loadingMoreProducts,
    error,
  } = useSelector((state) => state.refurbishedproducts);

  const selectedCategories = useSelector((state) => state.refurbishedproductfiltersection.selectedCategories);
  const selectedBrands = useSelector((state) => state.refurbishedproductfiltersection.selectedBrands);
  const selectedClasses = useSelector((state) => state.refurbishedproductfiltersection.selectedClasses);
  const selectedExams = useSelector((state) => state.refurbishedproductfiltersection.selectedExams);
  const selectedLanguages = useSelector((state) => state.refurbishedproductfiltersection.selectedLanguages);
  const selectedBoards = useSelector((state) => state.refurbishedproductfiltersection.selectedBoards);

  // Search handling function
  const handleSearch = () => {
    const params = {
      inputValue,
      page: 1,
      productsPerPage: 8,
      pinCodes: [742136],
      selectedCategories,
      selectedClasses,
      selectedExams,
      selectedLanguages,
      selectedBoards,
      selectedBrands,
      sortByAsc, sortByDesc
    };
    dispatch(fetchRefurbishedProducts(params));
  };

  // Input change handler for search
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setSearchParams({ query: value });
  };

  // Fetch products on initial render if no products exist
  useEffect(() => {
    if (refurbishedProducts.length === 0) handleSearch();
  }, [
    selectedCategories,
    selectedClasses,
    selectedExams,
    selectedLanguages,
    selectedBoards,
    selectedBrands]);

  // Handle loading more products
  const handleLoadMore = () => {
    if (!hasMoreProducts || loadingMoreProducts) return;

    const params = {
      inputValue,
      page: currentPage + 1,
      productsPerPage: 8,
      pinCodes: [742136],
      selectedCategories,
      selectedClasses,
      selectedExams,
      selectedLanguages,
      selectedBoards,
      selectedBrands,
      sortByAsc, sortByDesc
    };
    dispatch(loadMoreRefurbishedProducts(params));
  };

  // Error handling display
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
      <RefurbishedNavbar
        handleSearch={handleSearch}
        handleSearchChange={handleInputChange}
        inputValue={inputValue}
      />
      {loading ? (
        <div className="refurbished-page-loading-container">
          <RotatingLines width="60" height="60" color="#007bff" />
        </div>
      ) : (
        <InfiniteScroll
          dataLength={refurbishedProducts.length}
          next={handleLoadMore}
          hasMore={hasMoreProducts}
          loader={loadingMoreProducts && <h4>Loading more products...</h4>}
        >
          <RefurbishedProductList
            products={refurbishedProducts}
            loading={loading}
            sortByAsc={sortByAsc}
            sortByDesc={sortByDesc} />
        </InfiniteScroll>
      )}

      {showSortBy && (
        <RefurbishedProductSortBySection
          handleSearch={handleSearch}
          showSortBy={showSortBy}
          setShowSortBy={setShowSortBy}
        />
      )}
      {showFilterBy && (
        <RefurbishedProductFilterBySection
          handleSearch={handleSearch}
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
