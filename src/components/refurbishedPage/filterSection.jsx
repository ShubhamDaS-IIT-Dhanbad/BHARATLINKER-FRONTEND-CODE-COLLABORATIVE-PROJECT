import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import {
  toggleRefurbishedCategory,
  toggleRefurbishedBrand,
  toggleRefurbishedClass,
  toggleRefurbishedExam,
  toggleRefurbishedLanguage,
  toggleRefurbishedBoard,
} from '../../redux/features/refurbishedPage/refurbishedProductFilterSectionSlice.jsx';
import { resetRefurbishedProducts } from '../../redux/features/refurbishedPage/refurbishedProductsSlice.jsx';

import './filterSection.css';

const RefurbishedProductFilterSection = ({showFilterBy, setShowFilterBy }) => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    category: false,
    brand: false,
    class: false,
    exam: false,
    language: false,
    board: false,
  });

  const [searchTerms, setSearchTerms] = useState({
    category: '',
    brand: '',
    class: '',
    exam: '',
    language: '',
    board: '',
  });



  const selectedFilters = useSelector((state) => ({
    categorys: state.refurbishedproductfiltersection.selectedCategories,
    brands: state.refurbishedproductfiltersection.selectedBrands,
    classs: state.refurbishedproductfiltersection.selectedClasses,
    exams: state.refurbishedproductfiltersection.selectedExams,
    languages: state.refurbishedproductfiltersection.selectedLanguages,
    boards: state.refurbishedproductfiltersection.selectedBoards,
  }));

  const allFilters = {
    category: ['Electronics', 'Fashion', 'Home', 'Book', 'Module'],
    brand: ['Samsung', 'Apple', 'Sony', 'Dell', 'HP'],
    class: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    exam: ['CBSE', 'ICSE', 'NEET', 'JEE', 'SAT'],
    language: ['English', 'Hindi', 'French', 'German', 'Spanish'],
    board: ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'],
  };

  const filterActions = {
    category: toggleRefurbishedCategory,
    brand: toggleRefurbishedBrand,
    class: toggleRefurbishedClass,
    exam: toggleRefurbishedExam,
    language: toggleRefurbishedLanguage,
    board: toggleRefurbishedBoard,
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
          {renderFilter('class', 'Class')}
          {renderFilter('exam', 'Exam')}
          {renderFilter('language', 'Language')}
          {renderFilter('board', 'Board')}
        </div>
      )}
    </div>
  );
};

export default RefurbishedProductFilterSection;
