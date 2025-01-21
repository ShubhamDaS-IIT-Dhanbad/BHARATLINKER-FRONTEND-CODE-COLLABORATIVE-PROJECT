import React, { useState, useEffect } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import useUserAuth from '../../../hooks/userAuthHook.jsx';
import { useExecuteUserSearch } from '../../../hooks/searchUserProductHook.jsx';
import '../../style/navbar.css';

const Navbar = ({ headerTitle }) => {
    const navigate = useNavigate();
    const { userData } = useUserAuth();
    const { executeSearch } = useExecuteUserSearch();

    const { query } = useSelector((state) => state.userRefurbishedProducts);
    const [searchInput, setSearchInput] = useState('');

    // Handle search when clicking the icon
    const handleSearchIconClick = () => {
        if (searchInput.trim()) {
            executeSearch(searchInput);
        }
    };

    // Handle search when pressing "Enter"
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            executeSearch(searchInput);
        }
    };
    useEffect(() => {
        setSearchInput(query);
    }, []);

    return (
        <>
            <div className="product-page-header-visible">
                <div className="product-page-header-container">
                    <div className="product-page-header-user-section">
                        <FaArrowLeft
                            id="product-page-user-icon"
                            size={25}
                            onClick={() => navigate('/user')}
                            aria-label="Go to Home"
                            tabIndex={0}
                        />
                        <div className="product-page-user-location">
                            <p className="product-page-location-label">{headerTitle}</p>
                            <p id="dashboard-header-user-phn">
                                {userData ? userData.phoneNumber : 'xxxxx xxxxx'}
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
                            onKeyDown={handleSearchKeyPress}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
