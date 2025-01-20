import React from 'react';
import { useDispatch} from 'react-redux';
import { toggleSortOrder,sortProductReducer } from '../../redux/features/searchPage/searchProductSlice.jsx';
import { IoClose } from "react-icons/io5";
import './sortby.css'
const productSearchProductSortBySection = ({ showSortBy, setShowSortBy,sortByAsc, sortByDesc}) => {
    const dispatch = useDispatch();
    
    // Handle sort order change
    const handleSortOrderChange = (order) => {
        dispatch(toggleSortOrder(order));
        dispatch(sortProductReducer({ sortByAsc,sortByDesc}));
    };

    // Sort option component
   const SortOption = ({ order, isSelected, label }) => (
           <div
               className="productSearch-page-sortby-option-title"
               onClick={() => handleSortOrderChange(order)}
               role="button"
               tabIndex={0}
               aria-label={`Sort ${label}`}
           >
               <div
                   className={isSelected ? 'productSearch-sortby-item-selected' : 'productSearch-sortby-item-unselected'}
               >
                    {label}
               </div>
              
           </div>
       );
   
       return (
           showSortBy && (
               <div className="productSearch-page-sort-by-tab">
                   <div className='location-tab-IoIosCloseCircle' onClick={() => setShowSortBy(false)} aria-label="Close sort options">
                       <IoClose size={25} />
                   </div>
                   <div style={{color:"white"}}>SORT SECTION</div>
                   <div id="productSearch-page-sort-by-header">
                       <div id="productSearch-page-sortby-options">
                           <SortOption order="asc" isSelected={sortByAsc} label="A - Z" />
                           <SortOption order="desc" isSelected={sortByDesc} label="Z - A" />
                       </div>
                   </div>
               </div>
           )
       );
};

export default productSearchProductSortBySection;
