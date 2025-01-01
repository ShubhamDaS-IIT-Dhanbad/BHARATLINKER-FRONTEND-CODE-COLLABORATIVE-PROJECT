import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { toggleCategory } from '../../redux/features/searchShopFilterSectionSlice.jsx';
import { resetShops } from '../../redux/features/searchShopSlice.jsx';
import { IoSearch } from "react-icons/io5";

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
                <MdOutlineKeyboardArrowLeft size={'40px'} onClick={() => navigate('/shop')} />
                FILTER SECTION
            </div>

            <div id="filter-options-shop-page">
                {1 && (
                    <>
                        <div id="filter-category-options">

                            <div className='searchShopPage-footer-filterby-div'>
                                <IoSearch size={20} />
                                <input
                                    type="text"
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    className='searchShopPage-footer-filterby-input'
                                    placeholder='search Category Of The Shop'
                                />
                            </div>
                        </div>
                        <div id='shop-page-filter-by-options'>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map(category => (
                                <p
                                    key={category}
                                    className={`filter-option ${selectedCategories.includes(category.toUpperCase()) ? 'shop-selected-category' : 'shop-unselected-category'}`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category}
                                </p>
                            ))
                        ) : (
                            <p>No categories found</p>
                        )}
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default FilterSection;
