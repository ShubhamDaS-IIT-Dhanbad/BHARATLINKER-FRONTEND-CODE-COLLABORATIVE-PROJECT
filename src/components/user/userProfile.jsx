import React, { useEffect, useState } from 'react';
import Navbar from './navbar.jsx';
import { Helmet } from 'react-helmet';
import { FaLocationDot } from "react-icons/fa6";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import './style/userProfile.css';

import LocationTab from '../locationTab/locationTab.jsx';
import { updateUserById } from '../../appWrite/user/userData.js';
import Cookies from 'js-cookie';

function UserRefurbishedProduct({ userData }) {
  const [address, setAddress] = useState([]);
  const [showLocationTab, setShowLocationTab] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  useEffect(() => {
    if (userData) {
      setAddress(userData.address || []);
    }
    window.scrollTo(0, 0);
  }, [userData]);

  const handleAddAddress = () => {
    setShowLocationTab(true);
  };

  const handleDeleteAddress = async (index) => {
    if (!userData || !userData.userId) return;
  
    const updatedAddressList = [...address];
    updatedAddressList.splice(index, 1);
  
    let updatedAddress = updatedAddressList.map(addr =>
      `${addr.latitude}@${addr.longitude}@${addr.address}`
    );
  
    const updateData = {
      documentId: userData.userId,
      address: updatedAddress,
    };
    setAddress(updatedAddressList);
    const updatedUserData = { ...userData, address: updatedAddressList };
    Cookies.set("BharatLinkerUserData", JSON.stringify(updatedUserData), { expires: 30 });
    updateUserById(updateData).catch((error) => {
      console.error("Error deleting address:", error);
    });
  };
  
  

  if (showLocationTab) {
    return (
      <LocationTab
        documentId={userData.userId}
        header="ADD NEW ADDRESS"
        setDeliveryAddress={setDeliveryAddress}
        setLocationTab={setShowLocationTab}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Profile | Bharat Linker</title>
        <meta name="description" content="your profile" />
        <meta name="keywords" content="profile, user profile, Bharat Linker" />
      </Helmet>
      <Navbar userData={userData} headerTitle="USER PROFILE" />

      <div className="user-profile-content">
        <div className="profile-section-card" style={{ marginTop: "10px" }}>
          <div className="section-header-row">
            <button
              className="primary-button"
              onClick={handleAddAddress}
              disabled={address.length > 4}
              style={{ opacity: address.length > 4 ? 0.5 : 1, cursor: address.length > 4 ? "not-allowed" : "pointer" }}
            >
              <FaPlus className="icon-xs" />
              <span>Add New Address</span>
            </button>
          </div>


          <div className="address-grid">
            {address.length > 0 ? (
              address.map((addr, index) => (
                <div key={index} className="address-card">
                  <div className="address-content">
                    <FaLocationDot color="rgb(12, 131, 31)" size={20} />
                  </div>
                  <div className="address-body">
                    <h1>Address</h1>
                    <p>{addr.address}</p>
                  </div>
                  <div className="card-footer">
                    <RiDeleteBinFill size={20} onClick={() => handleDeleteAddress(index)} style={{ cursor: "pointer" }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No addresses available. Please add one.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default UserRefurbishedProduct;
