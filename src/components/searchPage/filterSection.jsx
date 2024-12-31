import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { toggleCategory, toggleBrand } from '../../redux/features/searchProductFilterSectionSlice.jsx';
import { resetProducts } from '../../redux/features/searchProductSlice.jsx';
import { FaArrowLeft } from "react-icons/fa";

const FilterSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showCategory, setShowCategory] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    
    const [searchCategory, setSearchCategory] = useState(""); // Separate search input for category
    const [searchBrand, setSearchBrand] = useState(""); // Separate search input for brand

    // Fetch selected categories and brands from the Redux state
    const selectedCategories = useSelector(state => state.searchproductfiltersection.selectedCategories);
    const selectedBrands = useSelector(state => state.searchproductfiltersection.selectedBrands);

    // Static categories and brands for demonstration
    const categories = ['Electronics', 'Fashion', 'Home', 'Books'];
    const brands = ['Apple', 'Samsung', 'Nike', 'Adidas'];

    // Filter categories and brands based on search inputs
    const filteredCategories = categories.filter(category => 
        category.toLowerCase().includes(searchCategory.toLowerCase())
    );
    const filteredBrands = brands.filter(brand => 
        brand.toLowerCase().includes(searchBrand.toLowerCase())
    );

    const handleCategoryClick = (category) => {
        dispatch(toggleCategory(category)); // Dispatch toggleCategory action to toggle selection
        dispatch(resetProducts()); // Reset products based on new filters
    };

    const handleBrandClick = (brand) => {
        dispatch(toggleBrand(brand)); // Dispatch toggleBrand action to toggle selection
        dispatch(resetProducts()); // Reset products based on new filters
    };

    return (
        <div className='product-filter-section'>
             <div id="filter-section-product-page">
                <FaArrowLeft size={25} onClick={() =>  navigate('/search') } style={{position:"fixed",left:"10px"}}/>
                Filter
              </div>

            <div id="filter-options-product-page">
                <div onClick={() => setShowCategory(!showCategory)} className="search-shop-page-filter-option-title">
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
                        {filteredCategories.map(category => (
                            <div
                                key={category}
                                className={`filter-option ${selectedCategories.includes(category) ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick(category)} // Toggle on click
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                )}

                {/* Brand Filter */}
                <div onClick={() => setShowBrand(!showBrand)} className="search-shop-page-filter-option-title">
                    <p>Brand</p>
                    {showBrand ? <IoIosArrowUp size="25px" /> : <IoIosArrowDown size="25px" />}
                </div>
                {showBrand && (
                    <div id="filter-brand-options">
                        <input 
                            type="text" 
                            value={searchBrand} 
                            onChange={(e) => setSearchBrand(e.target.value)} 
                            placeholder="Search brands" 
                            className="filter-search-input"
                        />
                        {filteredBrands.map(brand => (
                            <div
                                key={brand}
                                className={`filter-option ${selectedBrands.includes(brand) ? 'selected-brand' : ''}`}
                                onClick={() => handleBrandClick(brand)} // Toggle on click
                            >
                                {brand}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSection;
