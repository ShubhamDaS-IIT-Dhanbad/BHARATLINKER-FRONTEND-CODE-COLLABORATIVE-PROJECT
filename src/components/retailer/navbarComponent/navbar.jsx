import React, { useState, useEffect } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../../style/navbar.css";

const Navbar = ({ retailerData, headerTitle, onBackNavigation }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  // Handle search when clicking the icon
  const handleSearchIconClick = () => {
    if (searchInput.trim()) {
      executeSearch(searchInput);
    }
  };

  // Handle search when pressing "Enter"
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      executeSearch(searchInput);
    }
  };

  // Update searchInput when query changes
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Search execution logic
  const executeSearch = (searchTerm) => {
    setQuery(searchTerm);
    console.log("Searching for: ", searchTerm);
  };

  // Handle navigation logic
  const handleBackNavigation = () => {
    if (onBackNavigation) {
      onBackNavigation(); // Call the passed function if present
    } else {
      navigate("/retailer"); // Default to navigate to /user
    }
  };

  return (
    <div className="product-page-header-visible">
      <div className="product-page-header-container">
        <div className="product-page-header-user-section">
          <FaArrowLeft
            id="product-page-user-icon"
            size={25}
            onClick={handleBackNavigation}
            aria-label="Go to Home"
            tabIndex={0}
          />
          <div className="product-page-user-location">
            <p className="product-page-location-label">{headerTitle}</p>
            <p id="dashboard-header-user-phn">
              {retailerData?.phoneNumber ? retailerData?.phoneNumber : retailerData?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Conditionally render search bar for specific routes */}
      {location.pathname === "/user/refurbished" && (
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
      )}
    </div>
  );
};

export default Navbar;
