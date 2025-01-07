import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { IoSearch } from 'react-icons/io5';

import {
  toggleRefurbishedCategory,
  toggleRefurbishedBrand
} from '../../redux/features/refurbishedPage/refurbishedProductFilterSectionSlice.jsx';
import { resetRefurbishedProducts } from '../../redux/features/refurbishedPage/refurbishedProductsSlice.jsx';

import './filterSection.css';

const RefurbishedProductFilterSection = ({showFilterBy, setShowFilterBy }) => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    category: false,
    brand: false
  });

  const [searchTerms, setSearchTerms] = useState({
    category: '',
    brand: ''
  });



  const selectedFilters = useSelector((state) => ({
    categorys: state.refurbishedproductfiltersection.selectedCategories,
    brands: state.refurbishedproductfiltersection.selectedBrands
  }));

  const allFilters = {
    category: ['Electronics', 'Fashion', 'Home', 'Book', 'Module'],
    brand: ['Samsung', 'Apple', 'Sony', 'Dell', 'HP'],
  };

  const filterActions = {
    category: toggleRefurbishedCategory,
    brand: toggleRefurbishedBrand
  };

  const handleFilterClick = (filter, value) => {
    dispatch(filterActions[filter](value));
    dispatch(resetRefurbishedProducts());
  };

  const renderFilter = (filter, title) => {
    const filteredItems = useMemo(
      () =>
        allFilters[filter].filter((item) =>
          item.toLowerCase().includes(searchTerms[filter].toLowerCase())
        ),
      [filter, searchTerms[filter]]
    );

    return (
      <div id="filter-options-refurbished-page" key={filter}>
        <div id={`filter-${filter}-options`}>
          <div className="searchRefurbishedPage-footer-filterby-div">
            <IoSearch size={20} />
            <input
              type="text"
              value={searchTerms[filter]}
              onChange={(e) =>
                setSearchTerms((prev) => ({
                  ...prev,
                  [filter]: e.target.value,
                }))
              }
              placeholder={`Search ${title}`}
              className="searchRefurbishedPage-footer-filterby-input"
            />
          </div>
          <div id="refurbished-page-filter-by-options">
            {filteredItems.map((item, index) => {
              const isSelected =
                selectedFilters[`${filter}s`]?.includes(item.toLowerCase()) || false;
              return (
                <span
                  key={`${filter}-${item}-${index}`}
                  className={`filter-option ${isSelected
                      ? 'refurbished-page-selected-category'
                      : 'refurbished-page-unselected-category'
                    }`}
                  onClick={() => handleFilterClick(filter, item)}
                >
                  {item}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="refurbished-page-filter-by-tab">
      {showFilterBy && (
        <>
          <div
            className="location-tab-IoIosCloseCircle"
            onClick={() => setShowFilterBy(false)}
            aria-label="Close sort options"
          >
            <IoClose size={25} />
          </div>

          <div style={{ color: "white" }}>FILTER SECTION</div>
        </>
      )}
      {showFilterBy && (
        <div id="refurbished-page-filter-by-header">
          {renderFilter('category', 'Category')}
          {renderFilter('brand', 'Brand')}
        </div>
      )}
    </div>
  );
};

export default RefurbishedProductFilterSection;
