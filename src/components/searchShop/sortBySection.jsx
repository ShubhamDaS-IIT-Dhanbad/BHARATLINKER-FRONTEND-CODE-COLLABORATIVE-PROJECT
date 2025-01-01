import React from 'react';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const SortBySection = ({ showSortBy, setShowSortBy }) => {
  const navigate = useNavigate(); // Declare navigate properly
  const categories = ['1km', '3km', '5km', '10km', '15km', '20km'];
  const filteredCategories = categories.filter(category =>
    category.toLowerCase()
  );
  return (
    <div className='shop-page-sort-section'>
      <div id='filter-section-shop-page'>
        <MdOutlineKeyboardArrowLeft
          size={'40px'}
          onClick={() => navigate('/shop')}
          aria-label="Go Back"
          tabIndex={0}
        />
        SORT BY
      </div>

      <div id="sort-by-options-shop-page">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <p
              key={category}
             id="shop-unselected-sort-by"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </p>
          ))
        ) : (
          <p>No categories found</p>
        )}
      </div>
    </div>
  );
};

export default SortBySection;
