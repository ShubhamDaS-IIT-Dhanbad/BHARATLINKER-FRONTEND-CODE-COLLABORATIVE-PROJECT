import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { toggleCategory} from '../../redux/features/searchShopFilterSectionSlice.jsx';
import { resetShops } from '../../redux/features/searchShopSlice.jsx';

import './searchShop.css';
const FilterSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showCategory, setShowCategory] = useState(false);
    const [searchCategory, setSearchCategory] = useState(""); 

    const selectedCategories = useSelector(state => state.searchshopfiltersection.selectedCategories);
    const categories = ['Electronics', 'Fashion', 'Home', 'Books'];

    const filteredCategories = categories.filter(category => 
        category.toLowerCase().includes(searchCategory.toLowerCase())
    );

  
    const handleCategoryClick = (category) => {
        dispatch(toggleCategory(category));
        dispatch(resetShops());
    };


    return (
        <div className='product-filter-section'>
            <div id='filter-section-product-page'>
                <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => navigate('/search')} />
                FILTER SECTION
            </div>

            <div id="filter-options-product-page">
                {/* Category Filter */}
                <div 
                    onClick={() => setShowCategory(!showCategory)} 
                    className="search-shop-page-filter-option-title"
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
                                    className={`filter-option ${selectedCategories.includes(category.toUpperCase()) ? 'shop-selected-category' : ''}`}
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

export default FilterSection;
