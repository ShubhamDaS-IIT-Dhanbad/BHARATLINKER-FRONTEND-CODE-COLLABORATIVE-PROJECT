import React  from "react";
import { useNavigate} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./style/userNavbar.css";

const p1="https://res.cloudinary.com/demc9mecm/image/upload/v1741103723/pro1_yqfqbm.webp";
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