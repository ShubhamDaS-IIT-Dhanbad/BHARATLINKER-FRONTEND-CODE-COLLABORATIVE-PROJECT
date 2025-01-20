import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { TfiSave } from "react-icons/tfi";
import { RiResetRightLine } from "react-icons/ri";
import { useExecuteSearch } from '../../hooks/searchProductHook.jsx';
import {
  setSearchProductsCategories,
  setSearchProductsBrands,
} from '../../redux/features/searchPage/searchProductFilterSectionSlice';

import './filterSection.css';

const SearchProductFilterSection = ({ showFilterBy, setShowFilterBy }) => {
  const [isApply, setIsApply] = useState(false);
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
    category: [
      'Appliances', 'Automobiles', 'Bags', 'Beauty', 'Books', 'Electronics', 'Fashion',
      'Footwear', 'Furniture', 'Gaming', 'Gadgets', 'Health', 'Home', 'Jewelry',
      'Kitchen', 'Laptops', 'Modules', 'Music', 'Office Supplies', 'Outdoors',
      'Pet Supplies', 'Smartphones', 'Sports', 'Stationery', 'Toys', 'Watches', 'Grocery'
    ]

    ,
    brand: [
      'Acer', 'Adidas', 'Apple', 'ASUS', 'Beats', 'Bose', 'Canon', 'Dell', 'HP', 'Huawei',
      'JBL', 'Lenovo', 'LG', 'Microsoft', 'Motorola', 'Nike', 'Nikon', 'OnePlus', 'Oppo',
      'Panasonic', 'Philips', 'Puma', 'Razer', 'Samsung', 'Sharp', 'Sony', 'Toshiba', 'Under Armour',
      'Vivo', 'Xiaomi'
    ]

  };

  const filterActions = {
    category: setSearchProductsCategories,
    brand: setSearchProductsBrands,
  };

  const handleFilterClick = () => {
    setIsApply(true);
    dispatch(setSearchProductsCategories(selectedCategoriesState));
    dispatch(setSearchProductsBrands(selectedBrandsState));
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
        updatedSelection.splice(index, 1);
      } else {
        updatedSelection.push(item);
      }
      setSelectedCategoriesState(updatedSelection);
    } else {
      const updatedSelection = [...selectedBrandsState];
      if (updatedSelection.includes(item)) {
        const index = updatedSelection.indexOf(item);
        updatedSelection.splice(index, 1);
      } else {
        updatedSelection.push(item);
      }
      setSelectedBrandsState(updatedSelection);
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
            ? 'productSearch-filterby-item-selected'
            : 'productSearch-filterby-item-unselected'}
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
            onClick={() => {
              if (isApply) { executeSearch(); }
              setShowFilterBy(false)
            }
            }
            aria-label="Close sort options"
          >
            <IoClose size={25} />
          </div>
          <div style={{ color: 'white' }}>FILTER SECTION</div>
          <div id="productSearch-page-sort-by-header">

            <div id="productSearch-page-filterby-options">
              <TfiSave onClick={handleFilterClick} size={20} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                <SortOption label="category" />
                <SortOption label="brand" />
              </div>
              <RiResetRightLine size={20} />
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
