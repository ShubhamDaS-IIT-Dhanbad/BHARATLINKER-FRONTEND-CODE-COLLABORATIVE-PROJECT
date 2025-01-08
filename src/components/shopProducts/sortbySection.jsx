import React from 'react';
import { useDispatch} from 'react-redux';
import { toggleShopSortOrder} from '../../redux/features/shopProducts/searchProductSlice.jsx';


import { IoClose } from "react-icons/io5";
const RefurbishedProductSortBySection = ({shopId, showSortBy, setShowSortBy,sortByAsc, sortByDesc}) => {
    const dispatch = useDispatch();
    
    // Handle sort order change
    const handleSortOrderChange = (order) => {
        dispatch(toggleShopSortOrder({shopId,order}));
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
                   <div id="refurbished-page-sort-by-header">
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
