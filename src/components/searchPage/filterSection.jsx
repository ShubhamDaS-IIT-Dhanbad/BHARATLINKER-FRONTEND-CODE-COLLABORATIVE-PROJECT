import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { toggleCategory, toggleBrand } from '../../redux/features/searchProductFilterSectionSlice.jsx';
import { resetProducts } from '../../redux/features/searchProductSlice.jsx';

const FilterSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchCategory, setSearchCategory] = useState("");
    const [searchBrand, setSearchBrand] = useState("");

    const selectedCategories = useSelector(state => state.searchproductfiltersection.selectedCategories);
    const selectedBrands = useSelector(state => state.searchproductfiltersection.selectedBrands);

    const categories = ['Electronics', 'Fashion', 'Home', 'Books','Human'];
    const brands = ['Apple', 'Samsung', 'Nike', 'Adidas'];

    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchCategory.toLowerCase())
    );
    const filteredBrands = brands.filter(brand =>
        brand.toLowerCase().includes(searchBrand.toLowerCase())
    );

    const handleCategoryClick = (category) => {
        dispatch(toggleCategory(category.toLowerCase())); // Ensure consistency with stored values
        dispatch(resetProducts());
    };

    const handleBrandClick = (brand) => {
        dispatch(toggleBrand(brand.toLowerCase())); // Ensure consistency with stored values
        dispatch(resetProducts());
    };

    return (
        <div className='product-filter-section'>
            {/* Header Section */}
            <div id="filter-section-product-page">
                <FaArrowLeft
                    size={25}
                    onClick={() => navigate('/search')}
                    style={{ position: "fixed", left: "10px", cursor: "pointer" }}
                />
                <span>Filter</span>
            </div>

            {/* Filter Options */}
            <div id="filter-options-product-page">
                {/* Category Filter */}
                <div id="search-page-filter-category-options">
                    <div className='searchShopPage-footer-filterby-div'>
                        <IoSearch size={20} />
                        <input
                            type="text"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            placeholder="Search categories..."
                            className='searchShopPage-footer-filterby-input'
                        />
                    </div>
                    <div id='shop-page-filter-by-options'>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map(category => (
                                <p
                                    key={category}
                                    className={`filter-option ${selectedCategories.includes(category.toLowerCase()) ? 'shop-selected-category' : 'shop-unselected-category'}`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category}
                                </p>
                            ))
                        ) : (
                            <li className="no-results">No categories found</li>
                        )}
                    </div>
                </div>

                {/* Brand Filter */}
                <div id="search-page-filter-brand-options">
                    <div className='searchShopPage-footer-filterby-div'>
                        <IoSearch size={20} />
                        <input
                            type="text"
                            value={searchBrand}
                            onChange={(e) => setSearchBrand(e.target.value)}
                            placeholder="Search brands..."
                            className='searchShopPage-footer-filterby-input'
                        />
                    </div>
                    <div id='shop-page-filter-by-options'>
                        {filteredBrands.length > 0 ? (
                            filteredBrands.map(brand => (
                                <p
                                    key={brand}
                                    className={`filter-option ${selectedBrands.includes(brand.toLowerCase()) ? 'shop-selected-category' : 'shop-unselected-category'}`}
                                    onClick={() => handleBrandClick(brand)}
                                >
                                    {brand}
                                </p>
                            ))
                        ) : (
                            <li className="no-results">No brands found</li>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;
