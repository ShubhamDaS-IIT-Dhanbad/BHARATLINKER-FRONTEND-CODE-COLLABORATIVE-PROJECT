import React from 'react';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSortOrder } from '../../redux/features/searchProductSortbySectionSlice.jsx';
import { sortProductReducer } from '../../redux/features/searchProductSlice.jsx';

const RefurbishedProductSortBySection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Fetching sort order state from Redux
    const { sortByAsc, sortByDesc } = useSelector((state) => state.searchproductsortbysection);

    // Handle sort order change
    const handleSortOrderChange = (order) => {
        dispatch(sortProductReducer({ asc: sortByAsc, desc: sortByDesc }));
        dispatch(toggleSortOrder(order));
    };

    // Sort option component
    const SortOption = ({ order, isSelected, label }) => (
        <div 
            className="refurbished-product-page-sortby-option-title" 
            onClick={() => handleSortOrderChange(order)} 
            role="button" 
            aria-label={`Sort ${label}`} 
        >
            <div 
                className={isSelected ? 'sortby-item-selected green-class' : 'sortby-item-unselected'}
            ></div>
            <p className="sortby-item-label">{label}</p>
        </div>
    );

    return (
        <>
            {/* Header Section */}
            <div id="refurbished-product-sort-by-header">
                <div id="refurbished-product-sort-by-header-inner-div">
                    SORT BY SECTION
                    <IoChevronBackCircleOutline 
                        id="refurbished-product-sort-by-header-inner-div-IoChevronBackCircleOutline" 
                        size="30px" 
                        onClick={() => navigate('/search')} 
                        aria-label="Go back to search page"
                    />
                </div>
            </div>

            {/* Sort Options */}
            <div id="refurbished-product-page-sortby-options">
                <SortOption order="asc" isSelected={sortByAsc} label="Low to High" />
                <SortOption order="desc" isSelected={sortByDesc} label="High to Low" />
            </div>
        </>
    );
};

export default RefurbishedProductSortBySection;
