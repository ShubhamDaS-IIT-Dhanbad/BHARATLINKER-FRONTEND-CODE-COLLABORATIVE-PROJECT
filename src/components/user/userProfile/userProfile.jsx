import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../a.navbarComponent/navbar.jsx';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import { SlLocationPin } from 'react-icons/sl';
import { MdMyLocation } from 'react-icons/md';
import { Oval } from 'react-loader-spinner';
import { IoSearch } from 'react-icons/io5';
import { RotatingLines } from 'react-loader-spinner';
import './userProfile.css';
import { updateUserByPhoneNumber } from '../../../appWrite/userData/userData.js';
import conf from '../../../conf/conf.js';
import useUserAuth from '../../../hooks/userAuthHook.jsx';

import useLocationFromCookie from '../../../hooks/useLocationFromCookie.jsx';
function UserRefurbishedProduct() {
  const navigate = useNavigate();
  const { getUserDataFromCookie } = useUserAuth();
  const [userData, setUserData] = useState(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
  const { location, updateLocation, fetchLocationSuggestions, fetchCurrentLocation } = useLocationFromCookie();

  useEffect(() => {
    const fetchUserData = () => {
      const data = getUserDataFromCookie();
      setUserData(data);
    };
    if (userData) {
      setName(userData?.name ? userData?.name : '');
      setAddress(userData?.address ? userData?.address : '');
      setLat(userData?.lat ? userData?.lat : null);
      setLong(userData?.long ? userData?.long : "");
    } else {
      fetchUserData();
    }
  }, [userData]);






  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setFetchingUserLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const apiKey = conf.opencageapikey;
          const apiUrl = `${conf.opencageapiurl}?key=${apiKey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;

          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const address = data.results[0].formatted;
            setAddress(address);
            setLat(latitude);
            setLong(longitude);
          } catch (error) {
            console.error('Error fetching address:', error);
          } finally {
            setFetchingUserLocation(false);
          }
        },
        (error) => {
          console.error('Error fetching current location:', error);
          setFetchingUserLocation(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setFetchingUserLocation(false);
    }
  };
  const fetchSuggestions = async (query) => {
    if (!query) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const response = await fetchLocationSuggestions(query);
      setSuggestions(response);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  const handleAddressClick = (suggestion) => {
    setSearchQuery(suggestion.label);
    setAddress(suggestion.label);
    setLat(suggestion.lat);
    setLong(suggestion.lon);
    setSuggestions([]);
  };
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
        <Navbar headerTitle={"USER PROFILE"} />
      </header>

      <div className="user-profile-div">
        <div className="user-profile-field">
          <input
            type="text"
            id="name"
            value={name ? name : ""}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="user-profile-form-input"
            required
          />
        </div>

        <div className="user-profile-field">
          <div
            id="address"
            className="user-profile-form-input"
          >{address ? address : "This location [latitude : longitude] will be used to show your refurbished product to other users"}</div>
        </div>
        <div style={{ display: "flex", width: '98%' }}>
          <div className="user-profile-lat-input">{lat ? lat : "LATITUDE"}</div>
          <div className="user-profile-lat-input">{long ? long : "LONGITUDE"}</div>
        </div>




        <div
          className="user-location-tab-bottom-div-current-location"
          onClick={handleLocationClick}
          aria-label="Use current location"
        >
          {fetchingUserLocation ?  <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />
                                :
            <>
              <MdMyLocation size={23} />
              Use current location
            </>}

        </div>

        <div className="location-tab-bottom-div-input-div">
          <IoSearch onClick={() => fetchSuggestions(searchQuery)} size={20} />
          <input
            className="location-tab-bottom-div-input"
            placeholder="Search your city/village/town"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className="location-tab-loader">
            <RotatingLines width="50" height="50" color="#00BFFF" />
          </div>
        )}
        {!loading && suggestions.length > 0 && (
          <div className="location-tab-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                className="location-tab-suggestion-info-div"
                key={index}
                onClick={() => handleAddressClick(suggestion)}
              >
                <SlLocationPin size={17} />
                <p>{suggestion.label}</p>
              </div>
            ))}
          </div>
        )}

        <button
          className={`user-profile-form-button ${name && address ? 'active' : 'disabled'}`}
          onClick={updateUserData}
          disabled={!name || !address}
        >
          Submit
        </button>
      </div>

      {(isUpdating) && (
        <div className="user-book-delete-pop-up">
          <Oval height={40} width={40} color="#4A90E2" />
        </div>
      )}
    </div>
  );
}

export default UserRefurbishedProduct;














const updateUserData = () => {
  if (!name || !address) {
    alert('Please fill in all required fields.');
    return;
  }
  const updatedData = { name, address, lat, long, phn: userData?.phoneNumber };
  setIsUpdating(true);
  updateUserByPhoneNumber(updatedData)
    .then(() => {
      Cookies.set('BharatLinkerUserData', JSON.stringify({
        ...userData,
        name,
        address,
        lat,
        long,
      }), { expires: 7 });
    })
    .catch((error) => {
      console.error('Error updating user data:', error.message);
      alert('Failed to update user data.');
    })
    .finally(() => {
      setIsUpdating(false);
    });
};






