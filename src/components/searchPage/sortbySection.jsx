// src/features/RefurbishedProductSortBySection.jsx
import React from 'react';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRefurbishedSortOrder } from '../../redux/features/refurbishedProductSortbySectionSlice.jsx'; // Correct import
import { resetRefurbishedProducts } from '../../redux/features/refurbishedProductsSlice.jsx';

const RefurbishedProductSortBySection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { sortByAsc, sortByDesc } = useSelector((state) => state.refurbishedProductSortBySection);

    return (
        <>
            <div id='refurbished-product-sort-by-header'>
                <div id='refurbished-product-sort-by-header-inner-div'>
                    SORT BY SECTION
                    <IoChevronBackCircleOutline 
                        id='refurbished-product-sort-by-header-inner-div-IoChevronBackCircleOutline' 
                        size={'30px'} 
                        onClick={() => { navigate('/refurbished') }} 
                    />
                </div>
            </div>

            <div id="refurbished-product-page-sortby-options">
                <div 
                    className="refurbished-product-page-sortby-option-title" 
                    onClick={() => { dispatch(resetRefurbishedProducts()); dispatch(toggleRefurbishedSortOrder('asc')) }} // Dispatch action
                >
                    <div className={sortByAsc ? 'sortby-item-selected' : 'sortby-item-unselected'}></div>
                    <p className="sortby-item-label">Low to High</p>
                </div>
                <div 
                    className="refurbished-product-page-sortby-option-title" 
                    onClick={() => { dispatch(resetRefurbishedProducts()); dispatch(toggleRefurbishedSortOrder('desc')) }} // Dispatch action
                >
                    <div className={sortByDesc ? 'sortby-item-selected' : 'sortby-item-unselected'}></div>
                    <p className="sortby-item-label">High to Low</p>
                </div>
            </div>
        </>
    );
};

export default RefurbishedProductSortBySection;
