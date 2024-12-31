import React from 'react';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const SortBySection = ({ showSortBy, setShowSortBy }) => {
  return (
    showSortBy && (
      <div className='search-page-filter-section'>
        <div id='filter-section-search-shop'>
          <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => setShowSortBy(false)} />
          SORT BY
        </div>
      </div>
    )
  );
};

export default SortBySection;
