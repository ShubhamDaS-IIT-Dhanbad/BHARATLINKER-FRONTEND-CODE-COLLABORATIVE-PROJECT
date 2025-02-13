import React from 'react';
import { IoChevronBackCircleOutline, IoClose } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { sortRefurbishedProducts,toggleSortOrder } from '../../redux/features/refurbishedPage/refurbishedProductsSlice.jsx';

const RefurbishedProductSortBySection = ({ showSortBy, setShowSortBy,sortByAsc, sortByDesc }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // Handle sort order change
    const handleSortOrderChange = (order) => {
        dispatch(sortRefurbishedProducts({ asc: sortByAsc, desc: sortByDesc }));
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
                className={isSelected ? 'refurbished-sortby-item-selected' : 'refurbished-sortby-item-unselected'}
            >
                 {label}
            </div>
           
        </div>
    );

    return (
        showSortBy && (
            <div className="refurbished-page-sort-by-tab">
                <div className='location-tab-IoIosCloseCircle' onClick={() => setShowSortBy(false)} aria-label="Close sort options">
                    <IoClose size={25} />
                </div>
                <div style={{color:"white"}}>SORT SECTION</div>
                {/* Header Section */}
                <div id="refurbished-page-sort-by-header">
                    {/* Sort Options */}
                    <div id="refurbished-page-sortby-options">
                        <SortOption order="asc" isSelected={sortByAsc} label="A - Z" />
                        <SortOption order="desc" isSelected={sortByDesc} label="Z - A" />
                    </div>
                </div>
            </div>
        )
    );
};

export default RefurbishedProductSortBySection;
