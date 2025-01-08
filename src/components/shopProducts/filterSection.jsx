import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IoClose, IoSearch } from 'react-icons/io5';

import {
  toggleCategory,
  toggleBrand,
  resetShopProducts
} from '../../redux/features/shopProducts/searchProductSlice';

import './filterSection.css';

const SearchProductFilterSection = ({
  handleSearch,
  shopId,
  selectedBrands,
  selectedCategories,
  setShowFilterBy,
}) => {
  const dispatch = useDispatch();

  const [searchTerms, setSearchTerms] = useState({
    category: '',
    brand: '',
  });

  // Available filters for category and brand
  const allFilters = {
    category: ['Electronics', 'Fashion', 'Home', 'Books', 'Modules'],
    brand: ['Samsung', 'Apple', 'Sony', 'Dell', 'HP'],
  };

  // Filter actions to toggle category and brand selection
  const filterActions = {
    category: toggleCategory,
    brand: toggleBrand,
  };

  useEffect(() => {
    // Reset search terms when categories or brands change
    setSearchTerms({
      category: '',
      brand: '',
    });
  }, [selectedCategories, selectedBrands]);

  // Handle the filter option click
  const handleFilterClick = (filterType, value) => {
    dispatch(filterActions[filterType]({ shopId, [filterType]: value.toLowerCase() }));
        dispatch(resetShopProducts(shopId));
  };

  // Filter items based on the search term
  const filterItems = useCallback(
    (filterType) => {
      return allFilters[filterType].filter((item) =>
        item.toLowerCase().includes(searchTerms[filterType].toLowerCase())
      );
    },
    [searchTerms]
  );

  // Render filter input and items
  const renderFilter = (filterType, title) => {
    const filteredItems = filterItems(filterType);
    const selectedItems = filterType === 'category' ? selectedCategories : selectedBrands;

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
              const isSelected = selectedItems?.includes(item?.toLowerCase());

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
    <div className="product-page-filter-section">
      <div
        className="product-page-close-filter-section"
        onClick={() => setShowFilterBy(false)}
        aria-label="Close filter options"
      >
        <IoClose size={25} />
      </div>
      <div className="filter-section-title">FILTER SECTION</div>

      <div className="product-page-filter-options-container">
        {renderFilter('category', 'Category')}
        {renderFilter('brand', 'Brand')}
      </div>
    </div>
  );
};

export default SearchProductFilterSection;
