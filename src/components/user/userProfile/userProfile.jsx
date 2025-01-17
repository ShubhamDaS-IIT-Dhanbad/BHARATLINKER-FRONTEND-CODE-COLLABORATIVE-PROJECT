import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
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

function UserRefurbishedProduct() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fetchingUserLocation, setFetchingUserLocation] = useState(false);

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
    if (!query) {
      setSuggestions([]);
      return;
    }

    const apiKey = conf.geoapifyapikey;
    const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${apiKey}&lang=en`;

    setLoading(true);

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const formattedSuggestions = data.features
          .filter((feature) => feature.properties.country === 'India' && feature.properties.state)
          .map((feature) => ({
            label: feature.properties.formatted,
            lat: feature.geometry.coordinates[1],
            lon: feature.geometry.coordinates[0],
            country: feature.properties.country,
            state: feature.properties.state,
          }));
        setSuggestions(formattedSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchSuggestions(searchQuery);

  const handleAddressClick = (suggestion) => {
    setSearchQuery(suggestion.label);
    setSuggestions([]);
    setAddress(suggestion.label);
    setLat(suggestion.lat);
    setLong(suggestion.lon);
  };

  useEffect(() => {
    const userSession = Cookies.get('BharatLinkerUserData');
    if (userSession ) {
      const parsedUserData = userSession ? JSON.parse(userSession) : {};
      setUserData({
        ...parsedUserData,
        phn: parsedUserData.phoneNumber ||'',
      });
      setName(parsedUserData.name || '');
      setAddress(parsedUserData.address || '');
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
            {userData?.phoneNumber && (
              <div
                className="user-refurbished-product-page-header-phn-div"
                onClick={() => navigate('/pincode')}
                aria-label="Change Location"
                role="button"
              >
                {userData.phoneNumber}
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
          <label htmlFor="address" className="user-profile-form-label">
            HOMR ADDRESS <span className="required">*</span>thisaddress will be used in your refurbished product for your locality searching feature
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className="user-profile-form-input"
            required
          />
        </div>

        <div className="user-profile-location" onClick={handleLocationClick}>
          USE CURRENT LOCATION AS HOME LOCATION
          <MdMyLocation
            size={20}
            color={locationAvailable ? 'green' : 'gray'}
            style={{ cursor: 'pointer' }}
            aria-label="Get Current Location"
          />
        </div>
        OR
        <div className="location-tab-bottom-div-input-div">
          <IoSearch onClick={handleSearch} size={20} />
          <input
            className="location-tab-bottom-div-input"
            placeholder="Search your city/village/town"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>

        {loading && (
          <div className="location-tab-loader">
            <RotatingLines
              width="50"
              height="50"
              color="#00BFFF"
              ariaLabel="rotating-lines-loading"
            />
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
                <p className="location-tab-location-info-inner-div-2">
                  {suggestion.label}
                </p>
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

      {(isUpdating || fetchingUserLocation) && (
        <div className='user-book-delete-pop-up'>
          <Oval
            height={40}
            width={40}
            color="#4A90E2"
            secondaryColor="#ddd"
            strokeWidth={4}
            strokeWidthSecondary={2}
          />
        </div>
      )}
    </div>
  );
}

export default UserRefurbishedProduct;
