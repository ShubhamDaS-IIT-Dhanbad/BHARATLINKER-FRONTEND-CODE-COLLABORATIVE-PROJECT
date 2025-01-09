import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import { SlLocationPin } from "react-icons/sl";

import './userProfile.css';

function UserRefurbishedProduct() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [locationAvailable, setLocationAvailable] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleLocationClick = () => {
    if (!lat || !long) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLong(longitude);
          setLocationAvailable(true);
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  };

  useEffect(() => {
    const userSession = Cookies.get('BharatLinkerUserData');
    if (userSession) {
      const parsedUserData = JSON.parse(userSession);
      setUserData(parsedUserData);
      if (parsedUserData.lat && parsedUserData.long) {
        setLat(parsedUserData.lat);
        setLong(parsedUserData.long);
        setLocationAvailable(true);
      }
    }
  }, []);

  useEffect(() => {
    const userSession = Cookies.get('BharatLinkerUser');
    if (userSession) {
      const parsedUserData = JSON.parse(userSession);
      setUserData((prevState) => ({
        ...prevState,
        phn: parsedUserData.phn || prevState.phn, // Ensure the phone number is added
      }));
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
            tabIndex={0}
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
                tabIndex={0}
                role="button"
              >
                {userData.phn}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="user-profile-div">
        <form className="user-profile-form" onSubmit={handleSubmit}>
          <div className="user-profile-form">
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

          <div className="user-profile-form">
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
            />
          </div>

          <button
            type="submit"
            className={`user-profile-form-button ${name && email ? "active" : "disabled"}`}
            disabled={!name || !email}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserRefurbishedProduct;
