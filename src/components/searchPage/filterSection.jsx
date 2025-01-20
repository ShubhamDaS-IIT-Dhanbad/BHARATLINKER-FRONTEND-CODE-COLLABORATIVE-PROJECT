import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';

import { useExecuteSearch } from '../../hooks/searchProductHook.jsx';
import {
  setSearchProductsCategories,
  setSearchProductsBrands,
} from '../../redux/features/searchPage/searchProductFilterSectionSlice';

import './filterSection.css';

const SearchProductFilterSection = ({ showFilterBy, setShowFilterBy }) => {
  const dispatch = useDispatch();
  const { executeSearch } = useExecuteSearch();

  const selectedBrands = useSelector(
    (state) => state.searchproductsfiltersection.selectedBrands
  );
  const selectedCategories = useSelector(
    (state) => state.searchproductsfiltersection.selectedCategories
  );

  // State for tracking selected categories and brands
  const [selectedCategoriesState, setSelectedCategoriesState] = useState(selectedCategories);
  const [selectedBrandsState, setSelectedBrandsState] = useState(selectedBrands);

  const [searchTerms, setSearchTerms] = useState({
    category: '',
    brand: '',
  });

  // Set 'category' as the default selected label
  const [selectedLabel, setSelectedLabel] = useState('category');

  const allFilters = {
    category: ['Electronics', 'Fashion', 'Home', 'Books', 'Modules'],
    brand: ['Samsung', 'Apple', 'Sony', 'Dell', 'HP'],
  };

  const filterActions = {
    category: setSearchProductsCategories,
    brand: setSearchProductsBrands,
  };

  const handleFilterClick = () => {
    // Dispatch the selected categories and brands
    dispatch(setSearchProductsCategories(selectedCategoriesState));
    dispatch(setSearchProductsBrands(selectedBrandsState));
    executeSearch();
  };

  const filterItems = useCallback(
    (filterType) => {
      return allFilters[filterType].filter((item) =>
        item.toLowerCase().includes(searchTerms[filterType].toLowerCase())
      );
    },
    [searchTerms]
  );

  const handleItemClick = (item, filterType) => {
    if (filterType === 'category') {
      const updatedSelection = [...selectedCategoriesState];
      if (updatedSelection.includes(item)) {
        const index = updatedSelection.indexOf(item);
        updatedSelection.splice(index, 1); // Remove item if already selected
      } else {
        updatedSelection.push(item); // Add item if not selected
      }
      setSelectedCategoriesState(updatedSelection); // Update selected categories state
    } else {
      const updatedSelection = [...selectedBrandsState];
      if (updatedSelection.includes(item)) {
        const index = updatedSelection.indexOf(item);
        updatedSelection.splice(index, 1); // Remove item if already selected
      } else {
        updatedSelection.push(item); // Add item if not selected
      }
      setSelectedBrandsState(updatedSelection); // Update selected brands state
    }
  };

  const renderFilter = (filterType, title) => {
    const filteredItems = filterItems(filterType);
    const selectedItems =
      filterType === 'category' ? selectedCategoriesState : selectedBrandsState;

    return (
      <div className="product-page-filter-items" key={filterType}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => {
            const isSelected = selectedItems.includes(item.toLowerCase());

            return (
              <div
                key={`${filterType}-${item}-${index}`}
                className={`filter-option ${isSelected
                  ? 'product-page-selected-category'
                  : 'product-page-unselected-category'
                  }`}
                onClick={() => handleItemClick(item.toLowerCase(), filterType)}
              >
                {item}
              </div>
            );
          })
        ) : (
          <p className="product-page-no-results">
            No {title.toLowerCase()} found
          </p>
        )}
        <div
          className="apply-button"
          onClick={handleFilterClick}
        >
          Apply
        </div>
      </div>
    );
  };

  const SortOption = ({ label }) => {
    const isSelected = selectedLabel === label;

    const handleClick = () => {
      setSelectedLabel((prev) => (prev === label ? null : label));
    };

    return (
      <div
        className="productSearch-page-sortby-option-title"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Sort ${label}`}
      >
        <div
          className={isSelected
            ? 'productSearch-sortby-item-selected'
            : 'productSearch-sortby-item-unselected'}
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </div>
      </div>
    );
  };

  return (
    showFilterBy && (
      <div className="product-page-filter-section">
        <div className="productSearch-page-sort-by-tab">
          <div
            className="location-tab-IoIosCloseCircle"
            onClick={() => setShowFilterBy(false)}
            aria-label="Close sort options"
          >
            <IoClose size={25} />
          </div>
          <div style={{ color: 'white' }}>FILTER SECTION</div>
          <div id="productSearch-page-sort-by-header">
            <div id="productSearch-page-sortby-options">
              <SortOption label="category" />
              <SortOption label="brand" />
            </div>
            {selectedLabel &&
              renderFilter(
                selectedLabel,
                selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1)
              )}
          </div>
        </div>
      </div>
    )
  );
};

export default SearchProductFilterSection;
