import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar.jsx';
import { Helmet } from 'react-helmet';
import { RiRefreshLine } from "react-icons/ri";
import { TiInfoOutline } from "react-icons/ti";
import { FaPlus, FaEdit, FaSave } from "react-icons/fa";
import './style/userProfile.css';

function UserRefurbishedProduct({ userData }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setName(userData?.name || '');
      setAddress(userData.address || []);
    }
    window.scrollTo(0, 0);
  }, [userData]);

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      navigate('/address');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // TODO: Save updated name to backend if required
  };

  return (
    <>
      <Helmet>
        <title>Your Profile | Bharat Linker</title>
        <meta name="description" content="your profile" />
        <meta name="keywords" content="profile, user profile, Bharat Linker" />
      </Helmet>
      <Navbar userData={userData} headerTitle="USER PROFILE" />

      <div className="user-profile-content">
        <div className="profile-section-card">
          <div className="editable-field-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="profile-input-field"
              placeholder="Enter your full name"
              required
              disabled={!isEditing}
            />
            {isEditing ? (
              <button className="icon-button save-icon" onClick={handleSaveClick}>
                <FaSave className="icon-sm" />
              </button>
            ) : (
              <button className="icon-button edit-icon" onClick={handleEditClick}>
                <FaEdit className="icon-sm" />
              </button>
            )}
          </div>
        </div>

        <div className="profile-section-card" style={{ marginTop: "10px" }}>
          <div className="section-header-row">
            <button className="primary-button" onClick={handleAddAddress}>
              <FaPlus className="icon-xs" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="address-grid">

            {address.length > 0 &&
              address.map((addr, index) => (
                <div key={index} className="address-card">

                  <div className="address-content">
                    <p className="address-text">{addr.address}</p>
                    {/* <div className="address-actions">
                    <button className="icon-button text-button">
                      <RiRefreshLine className="icon-sm" />
                      <span>Update</span>
                    </button>
                  </div> */}
                  </div>

                  {/* <div className="card-footer">
                  <TiInfoOutline className="icon-sm text-muted" />
                  <span className="footer-text">Tap to edit address</span>
                </div> */}

                </div>
              ))}

            {address.length === 0 && (
              <div className="empty-state">
                
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserRefurbishedProduct;

// {showi && (
//   <div className="info-box">
//     This location will be used to display refurbished products from other users in your area.
//     Your latitude and longitude are stored for accurate location tracking.
//   </div>
// )}


