// src/features/RefurbishedProductFilterSection.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { toggleRefurbishedCategory } from '../../redux/features/refurbishedProductFilterSectionSlice.jsx';
import { resetRefurbishedProducts } from '../../redux/features/refurbishedProductsSlice.jsx';

import './refurbishedPage.css';

const RefurbishedProductFilterSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showCategory, setShowCategory] = useState(false);
    const [searchCategory, setSearchCategory] = useState(""); 

    const selectedCategories = useSelector(state => state.refurbishedproductfiltersection.selectedCategories);
    const categories = ['Electronics', 'Fashion', 'Home', 'Books']; // Example categories

    const filteredCategories = categories.filter(category => 
        category.toLowerCase().includes(searchCategory.toLowerCase())
    );

    const handleCategoryClick = (category) => {
        dispatch(toggleRefurbishedCategory(category));
        dispatch(resetRefurbishedProducts());
    };

    return (
        <div className='refurbished-product-filter-section'>
            <div id='filter-section-product-page'>
                <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => navigate('/refurbished')} />
                FILTER SECTION
            </div>
            <div id="filter-options-product-page" style={{backgroundColor:"red",marginTop:"100px"}}>
                {/* Category Filter */}
                <div 
                    onClick={() => setShowCategory(!showCategory)} 
                    className="refurbished-product-page-filter-option-title"
                    aria-expanded={showCategory}
                    tabIndex={0} // Allow keyboard navigation
                >
                    <p>Category</p>
                    {showCategory ? <IoIosArrowUp size="25px" /> : <IoIosArrowDown size="25px" />}
                </div>
                {showCategory && (
                    <div id="filter-category-options">
                        <input 
                            type="text" 
                            value={searchCategory} 
                            onChange={(e) => setSearchCategory(e.target.value)} 
                            placeholder="Search categories" 
                            className="filter-search-input"
                        />
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map(category => (
                                <div
                                    key={category}
                                    className={`filter-option ${selectedCategories.includes(category.toUpperCase()) ? 'refurbished-selected-category' : ''}`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category}
                                </div>
                            ))
                        ) : (
                            <p>No categories found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RefurbishedProductFilterSection;
