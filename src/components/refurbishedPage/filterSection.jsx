import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown} from "react-icons/io"; // Add IoClose here
import { IoClose } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import {
    toggleRefurbishedCategory,
    toggleRefurbishedBrand,
    toggleRefurbishedClass,
    toggleRefurbishedExam,
    toggleRefurbishedLanguage,
    toggleRefurbishedBoard
} from '../../redux/features/refurbishedProductFilterSectionSlice.jsx';
import { resetRefurbishedProducts } from '../../redux/features/refurbishedProductsSlice.jsx';

import './refurbishedPage.css';

const RefurbishedProductFilterSection = ({showFilterBy, setShowFilterBy}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        category: false,
        brand: false,
        class: false,
        exam: false,
        language: false,
        board: false
    });

    const [searchTerms, setSearchTerms] = useState({
        category: "",
        brand: "",
        class: "",
        exam: "",
        language: "",
        board: ""
    });

    const handleFilterToggle = (filter) => {
        setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
    };

    const handleSearchChange = (filter, value) => {
        setSearchTerms((prev) => ({ ...prev, [filter]: value }));
    };

    const selectedFilters = useSelector(state => ({
        categorys: state.refurbishedproductfiltersection.selectedCategories,
        brands: state.refurbishedproductfiltersection.selectedBrands,
        classs: state.refurbishedproductfiltersection.selectedClasses,
        exams: state.refurbishedproductfiltersection.selectedExams,
        languages: state.refurbishedproductfiltersection.selectedLanguages,
        boards: state.refurbishedproductfiltersection.selectedBoards
    }));

    const allFilters = {
        category: ['Electronics', 'Fashion', 'Home', 'Book', 'Module'],
        brand: ['Samsung', 'Apple', 'Sony', 'Dell', 'HP'],
        class: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
        exam: ['CBSE', 'ICSE', 'NEET', 'JEE', 'SAT'],
        language: ['English', 'Hindi', 'French', 'German', 'Spanish'],
        board: ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge']
    };

    const filterActions = {
        category: toggleRefurbishedCategory,
        brand: toggleRefurbishedBrand,
        class: toggleRefurbishedClass,
        exam: toggleRefurbishedExam,
        language: toggleRefurbishedLanguage,
        board: toggleRefurbishedBoard
    };

    const handleFilterClick = (filter, value) => {
        dispatch(filterActions[filter](value));
        dispatch(resetRefurbishedProducts());
    };

    const renderFilter = (filter, title) => {
        return (
            <div id="filter-options-product-page">
                <div
                    onClick={() => handleFilterToggle(filter)}
                    className="refurbished-product-page-filter-option-title"
                    aria-expanded={filters[filter]}
                    tabIndex={0}
                >
                    <p>{title}</p>
                    {filters[filter] ? <IoIosArrowUp size="25px" /> : <IoIosArrowDown size="25px" />}
                </div>
                {filters[filter] && (
                    <div id={`filter-${filter}-options`}>
                        <input
                            type="text"
                            value={searchTerms[filter]}
                            onChange={(e) => handleSearchChange(filter, e.target.value)}
                            placeholder={`Search ${title}`}
                            className="filter-search-input"
                        />
                        {allFilters[filter]
                            .filter(item =>
                                item.toLowerCase().includes(searchTerms[filter].toLowerCase())
                            ).map(item => {
                                const isSelected =
                                    selectedFilters[filter + 's']?.includes(item.toLowerCase()) || false; // Safe access
                                return (
                                    <div
                                        key={item}
                                        className={`filter-option ${isSelected ? 'refurbished-selected-category' : ''}`}
                                        onClick={() => handleFilterClick(filter, item)}
                                    >
                                        {item}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="refurbished-page-filter-by-tab">
            {showFilterBy && (
                <div className="location-tab-IoIosCloseCircle" onClick={() => setShowFilterBy(false)} aria-label="Close sort options">
                    <IoClose size={25} />
                </div>
            )}
            {showFilterBy && (
                <div id='refurbished-page-filter-by-header'>
                    <div id='filter-section-product-page'>
                        <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => navigate('/refurbished')} />
                        FILTER SECTION
                    </div>

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
