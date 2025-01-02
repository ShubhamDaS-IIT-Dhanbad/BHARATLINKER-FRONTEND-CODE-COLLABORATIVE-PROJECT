import React from 'react';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSortOrder } from '../../redux/features/searchProductSortbySectionSlice';
import { sortProductReducer } from '../../redux/features/searchProductSlice';
import { IoClose } from "react-icons/io5";

const RefurbishedProductSortBySection = ({ showSortBy, setShowSortBy }) => {
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
            className="refurbished-page-sortby-option-title"
            onClick={() => handleSortOrderChange(order)}
            role="button"
            tabIndex={0}
            aria-label={`Sort ${label}`}
        >
            <div
                className={isSelected ? 'refurbished-sortby-item-selected green-class' : 'refurbished-sortby-item-unselected'}
            ></div>
            <p className="refurbished-sortby-item-label">{label}</p>
        </div>
    );

    return (
        showSortBy && (
            <div className="refurbished-page-sort-by-tab">
                <div className='location-tab-IoIosCloseCircle' onClick={() => setShowSortBy(false)} aria-label="Close sort options">
                    <IoClose size={25} />
                </div>
                {/* Header Section */}
                <div id="refurbished-page-sort-by-header">
                    <div id="refurbished-page-sort-by-header-inner-div">
                        SORT BY SECTION
                        <IoChevronBackCircleOutline
                            id="refurbished-page-sort-by-header-icon"
                            size="30px"
                            onClick={() => navigate('/refurbished')}
                            aria-label="Go back to refurbished page"
                        />
                    </div>
                    {/* Sort Options */}
                    <div id="refurbished-page-sortby-options">
                        <SortOption order="asc" isSelected={sortByAsc} label="Low to High" />
                        <SortOption order="desc" isSelected={sortByDesc} label="High to Low" />
                    </div>
                </div>
            </div>
        )
    );
};

export default RefurbishedProductSortBySection;
