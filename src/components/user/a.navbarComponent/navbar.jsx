import React, { useState, useEffect } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useExecuteUserSearch } from '../../../hooks/searchUserProductHook.jsx'

import { FaArrowLeft } from 'react-icons/fa';
import '../../style/navbar.css';

import { useSelector } from 'react-redux';
//hooks


const Navbar = ({ headerTitle }) => {
    const navigate = useNavigate();
    const location = useLocation();


    const { executeSearch} = useExecuteUserSearch();
    const { query: searchQuery } = useSelector((state) => state.searchproducts);

    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        
    }, []);


    const handleSearch = (e) => {
        const inputValue = searchInput;
        executeSearch(inputValue);
    };

    const handleSearchIconClick = () => {
        const inputValue = searchInput;
        executeSearch(inputValue);
    }




    return (
        <>
            <div className="product-page-header-visible">
                <div className="product-page-header-container">
                    <div className="product-page-header-user-section">

                        <FaArrowLeft
                            id='product-page-user-icon'
                            size={25}
                            onClick={() => navigate('/user')}
                            aria-label="Go to Home"
                            tabIndex={0}
                        />
                        <div className="product-page-user-location">
                            <p className="product-page-location-label">
                                {headerTitle}
                            </p>

                        </div>
                    </div>
                </div>

                <div className="product-page-search-section">
                    <div className="product-page-search-input-container">
                        <BiSearchAlt
                            className="product-page-search-icon"
                            onClick={handleSearchIconClick}
                        />
                        <input
                            className="product-page-search-input"
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={handleSearch}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
