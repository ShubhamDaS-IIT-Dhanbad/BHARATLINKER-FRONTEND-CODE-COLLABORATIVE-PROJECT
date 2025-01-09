import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import { SlLocationPin } from "react-icons/sl";
import './userProfile.css';

import updateUserByPhoneNumber from '../../../appWrite/userData/userData.js';

function UserRefurbishedProduct() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [locationAvailable, setLocationAvailable] = useState(false);

  const updateUserData = () => {
    const updatedData = { name, address: email, lat, long, phn: userData?.phn };
    console.log("Updating user data:", updatedData);
    updateUserByPhoneNumber(updatedData);
  };

  const handleLocationClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLong(longitude);
        setLocationAvailable(true);
      },
      (error) => {
        console.error("Error getting location:", error.message);
      }
    );
  };

  useEffect(() => {
    const userSession = Cookies.get('BharatLinkerUserData');
    const userPhoneSession = Cookies.get('BharatLinkerUser');
    if (userSession || userPhoneSession) {
      const parsedUserData = userSession ? JSON.parse(userSession) : {};
      const parsedPhoneData = userPhoneSession ? JSON.parse(userPhoneSession) : {};
      setUserData({
        ...parsedUserData,
        phn: parsedPhoneData.phn || parsedUserData.phn || '',
      });
      setName(parsedUserData.name || '');
      setEmail(parsedUserData.email || '');
      setLat(parsedUserData.lat || null);
      setLong(parsedUserData.long || null);
      setLocationAvailable(!!(parsedUserData.lat && parsedUserData.long));
    }
  }, []);

  return (
    <div className="user-product-page-body">
      <Helmet>
        <title>Your Refurbished Products | Bharat Linker</title>
        <meta
          name="description"
          content="Browse and search for refurbished products offered by Bharat Linker."
        />
        <meta
          name="keywords"
          content="refurbished products, buy refurbished, Bharat Linker"
        />
      </Helmet>

      <header>
        <div className="user-refurbished-product-page-header-upper-div">
          <FaArrowLeft
            id="user-refurbished-product-page-left-icon"
            size={25}
            onClick={() => navigate('/user')}
            aria-label="Go back to User Account"
            role="button"
          />
          <div className="user-refurbished-product-page-header-inner">
            <h1 className="user-refurbished-product-page-header-text">
              USER DATA
            </h1>
            {userData?.phn && (
              <div
                className="user-refurbished-product-page-header-phn-div"
                onClick={() => navigate('/pincode')}
                aria-label="Change Location"
                role="button"
              >
                {userData.phn}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="user-profile-div">
        <div className="user-profile-field">
          <label htmlFor="name" className="user-profile-form-label">
            NAME <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="user-profile-form-input"
            required
          />
        </div>

        <div className="user-profile-field">
          <label htmlFor="email" className="user-profile-form-label">
            ADDRESS <span className="required">*</span>
          </label>
          <textarea
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your address"
            className="user-profile-form-input"
            required
          />
        </div>

        <div className="user-profile-location">
          <SlLocationPin
            size={30}
            color={locationAvailable ? "green" : "gray"}
            onClick={handleLocationClick}
            style={{ cursor: 'pointer' }}
            aria-label="Get Current Location"
          />
        </div>

        <div
          className={`user-profile-form-button ${name && email ? "active" : "disabled"}`}
          onClick={updateUserData}
          style={{
            cursor: name && email ? 'pointer' : 'not-allowed',
          }}
        >
          Submit
        </div>
      </div>
    </div>
  );
}

export default UserRefurbishedProduct;

