import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';
import { TbChevronDown } from 'react-icons/tb';
import { FaArrowLeft } from 'react-icons/fa'; // Corrected FaArrowLeft import
import { useDispatch } from 'react-redux';
import { resetRefurbishedProducts } from '../../redux/features/refurbishedPage/refurbishedProductsSlice';
import LocationTab from '../locationTab/locationTab';
import Cookies from 'js-cookie'; // Import Cookies for cookie handling
import './refurbishedNavbar.css';

function RefurbishedNavbar({ inputValue, handleSearchChange, handleSearch }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [locationTab, setLocationTab] = useState(false);
  const [location, setLocation] = useState(null); // Declare location state
  const [loading, setLoading] = useState(true); // Declare loading state

  useEffect(() => {
    const fetchLocation = () => {
      const storedLocation = Cookies.get('BharatLinkerUserLocation');
      if (storedLocation) {
        try {
          const parsedLocation = JSON.parse(storedLocation);
          setLocation(parsedLocation);
        } catch (error) {
          console.error("Error parsing location data from cookies:", error);
          setLocation(null);
        }
      }
      setLoading(false); // Set loading to false after fetching location
    };

    fetchLocation();
  }, [locationTab]); // Empty dependency array to run once on mount

  // Handling Enter key press to trigger search
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      dispatch(resetRefurbishedProducts()); // Reset the products before the search
      handleSearch(); // Trigger the search function
    }
  };

  return (
    <>
      <div className="refurbished-page-header-visible">
        <div className="refurbished-page-header-container">
          <div className="refurbished-page-header-user-section">
            <FaArrowLeft
              id="refurbished-page-user-icon"
              size={25}
              onClick={() => navigate('/')} // Navigate to home
              aria-label="Back to Home"
              tabIndex={0}
            />
            <div className="refurbished-page-user-location">
              <p className="refurbished-page-location-label">REFURBISHED SECTION</p>
              <div
                className="refurbished-page-location-value"
                onClick={() => setLocationTab(true)} // Open location tab on click
                aria-label="Change Location"
                tabIndex={0}
              >
                {/* Show loading or the location if available */}
                {loading ? 'Loading location...' : (location ? location.address.slice(0,22): 'Location not set')}
                <TbChevronDown size={15} />
              </div>
            </div>
          </div>
        </div>

        <div className="refurbished-page-search-section">
          <div className="refurbished-page-search-input-container">
            <BiSearchAlt
              className="refurbished-page-search-icon"
              onClick={handleSearch} // Trigger search on icon click
              aria-label="Search"
              tabIndex={0}
            />
            <input
              className="refurbished-page-search-input"
              placeholder="Search"
              value={inputValue} // Controlled input value
              onChange={handleSearchChange} // Handle input change
              onKeyDown={handleKeyDown} // Handle Enter key press for search
              aria-label="Search input"
            />
          </div>
        </div>
      </div>

      {/* Render LocationTab if locationTab state is true */}
      {locationTab && <LocationTab setLocationTab={setLocationTab} />}
    </>
  );
}

export default RefurbishedNavbar;
