import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose, IoSearch } from 'react-icons/io5';

import {
  toggleSearchProductsCategory,
  toggleSearchProductsBrand,
  resetSearchProductsFilters,
} from '../../redux/features/searchPage/searchProductFilterSectionSlice';

import './filterSection.css';

const SearchProductFilterSection = ({ showFilterBy, setShowFilterBy }) => {
  const dispatch = useDispatch();

  const selectedBrands= useSelector((state) => state.searchproductsfiltersection.selectedBrands);
  const selectedCategories = useSelector(
    (state) => state.searchproductsfiltersection.selectedCategories
  );
  
  const [searchTerms, setSearchTerms] = useState({
    category: '',
    brand: '',
  });

  const allFilters = {
    category: ['Electronics', 'Fashion', 'Home', 'Books', 'Modules'],
    brand: ['Samsung', 'Apple', 'Sony', 'Dell', 'HP'],
  };

  const filterActions = {
    category: toggleSearchProductsCategory,
    brand: toggleSearchProductsBrand,
  };

  const handleFilterClick = (filterType, value) => {
    dispatch(filterActions[filterType](value.toLowerCase()));
    dispatch(resetSearchProductsFilters());
  };

  const filterItems = useCallback(
    (filterType) => {
      return allFilters[filterType].filter((item) =>
        item.toLowerCase().includes(searchTerms[filterType].toLowerCase())
      );
    },
    [searchTerms]
  );

  const renderFilter = (filterType, title) => {
    const filteredItems = filterItems(filterType);
    const selectedItems =
      filterType === 'category' ? selectedCategories : selectedBrands;

    return (
      <div className="product-page-filter-options" key={filterType}>
        <div className="filter-header">
          <IoSearch size={20} />
          <input
            type="text"
            value={searchTerms[filterType]}
            onChange={(e) =>
              setSearchTerms((prev) => ({
                ...prev,
                [filterType]: e.target.value,
              }))
            }
            placeholder={`Search ${title}`}
            className="filter-input"
          />
        </div>
        <div className="filter-items">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const isSelected = selectedItems.includes(item.toLowerCase());

              return (
                <span
                  key={`${filterType}-${item}-${index}`}
                  className={`filter-option ${
                    isSelected
                      ? 'product-page-selected-category'
                      : 'product-page-unselected-category'
                  }`}
                  onClick={() => handleFilterClick(filterType, item)}
                >
                  {item}
                </span>
              );
            })
          ) : (
            <p className="no-results">No {title.toLowerCase()} found</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`product-page-filter-section ${showFilterBy ? 'show' : ''}`}>
      {showFilterBy && (
        <>
          <div
            className="product-page-close-filter-section"
            onClick={() => setShowFilterBy(false)}
            aria-label="Close filter options"
          >
            <IoClose size={25} />
          </div>
          <div className="filter-section-title" style={{color:"white"}}>FILTER SECTION</div>

          <div className="product-page-filter-options-container">
            {renderFilter('category', 'Category')}
            {renderFilter('brand', 'Brand')}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchProductFilterSection;
