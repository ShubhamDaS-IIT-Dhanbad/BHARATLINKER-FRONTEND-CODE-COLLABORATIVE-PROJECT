import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./style/userNavbar.css";
import p1 from './asset/pro1.png'
const Navbar = ({ userData, headerTitle, onBackNavigation }) => {
  const navigate = useNavigate();

  const handleBackNavigation = () => {
    if (onBackNavigation) {
      onBackNavigation();
    } else {
      navigate("/user");
    }
  };

  return (

    <div className="user-navbar-header-container">

      <div className="user-navbar-header-user-section">
        <FaArrowLeft
          id="user-navbar-user-icon"
          size={25}
          onClick={handleBackNavigation}
          aria-label="Go to Home"
          tabIndex={0}
        />

        <img src={p1} alt="User Profile" className="user-dashboard-profile-img" />
        <div className="user-navbar-user-location">
          <p className="user-navbar-location-label">{headerTitle}</p>
          <p className="user-navbar-header-user-phn">
            {userData ? `+91 ${userData.phoneNumber}` : "xxxxx xxxxx"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Navbar;