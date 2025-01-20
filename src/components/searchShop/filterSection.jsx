import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import {
  setShopFilterCategories,
  setShopFilterBrands,
} from '../../redux/features/searchShop/shopFilterSection';

import './filterSection.css';
import { resetShops } from '../../redux/features/searchShop/searchShopSlice';

const SearchProductFilterSection = ({ showFilterBy, setShowFilterBy }) => {
  const [isApply, setIsApply] = useState(false);
  const dispatch = useDispatch();

  const selectedBrands = useSelector(
    (state) => state.shopfiltersection.selectedBrands
  );
  const selectedCategories = useSelector(
    (state) => state.shopfiltersection.selectedCategories
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
    category:[
      "Electronics",
      "Hardware",
      "Computer",
      "Mobile",
      "Grocery",
      "Clothing",
      "Furniture",
      "Footwear",
      "Jewelry",
      "Pharmacy",
      "Bookstore",
      "Stationery",
      "Toy",
      "Sports",
      "Automobile",
      "Pet",
      "Beauty & Cosmetic",
      "Home Decor",
      "Kitchenware",
      "Gaming",
      "Music",
      "Gardening",
      "Baby Products",
      "Art & Craft",
      "Fitness Equipment",
      "Repair",
      "Travel Accessories",
      "Outdoors & Camping",
      "Office Supplies",
      "Watches & Accessories",
      "Gift",
      "Secondhand Goods",
      "Bakery",
      "Butcher",
      "Fish Market"
    ]
    

    ,
    brand: [
      'Acer', 'Adidas', 'Apple', 'ASUS', 'Beats', 'Bose', 'Canon', 'Dell', 'HP', 'Huawei',
      'JBL', 'Lenovo', 'LG', 'Microsoft', 'Motorola', 'Nike', 'Nikon', 'OnePlus', 'Oppo',
      'Panasonic', 'Philips', 'Puma', 'Razer', 'Samsung', 'Sharp', 'Sony', 'Toshiba', 'Under Armour',
      'Vivo', 'Xiaomi'
    ]

  };

  const handleFilterClick = () => {
    dispatch(setShopFilterCategories(selectedCategoriesState));
    dispatch(setShopFilterBrands(selectedBrandsState));
    dispatch(resetShops());
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
    setIsApply(true);
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
        // onClick={handleClick}
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
        <div className="productSearch-page-sort-by-tab">
          <div
            className="location-tab-IoIosCloseCircle"
            onClick={() => {
              if (isApply) { handleFilterClick() }
              setShowFilterBy(false)
            }
            }
            aria-label="Close sort options"
          >
            <IoClose size={25} />
          </div>
          <div style={{ color: 'white' }}>FILTER SECTION</div>
          <div id="productSearch-page-filter-by-header">

            <div id="productSearch-page-filterby-options">
              <SortOption label="category" />
              {/* <SortOption label="brand" /> */}
            </div>
            {selectedLabel &&
              renderFilter(
                selectedLabel,
                selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1)
              )}
          </div>
        </div>
    )
  );
};

export default SearchProductFilterSection;
