import React, { useEffect, useState } from 'react';
import Navbar from '../a.navbarComponent/navbar.jsx';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import { SlLocationPin } from 'react-icons/sl';
import { MdMyLocation } from 'react-icons/md';
import { Oval } from 'react-loader-spinner';
import { IoSearch } from 'react-icons/io5';
import './userProfile.css';
import conf from '../../../conf/conf.js';
import useUserAuth from '../../../hooks/userAuthHook.jsx';
import useLocationFromCookie from '../../../hooks/useLocationFromCookie.jsx';

function UserRefurbishedProduct() {
  const { updateUserData, getUserDataFromCookie } = useUserAuth();
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
  const { fetchLocationSuggestions } = useLocationFromCookie();

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
            const fetchedAddress = data.results[0]?.formatted || '';
            setAddress(fetchedAddress);
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
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetchLocationSuggestions(query);
      setSuggestions(response || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
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

  const handleUpdateUserData = async () => {
    if (!name || !address) return;
    setIsUpdating(true);

    const updatedData = { ...userData, name, address, lat, long };

    try {
      await updateUserData(updatedData);
      setUserData(updatedData);
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setIsUpdating(false);
    }
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
        <Navbar headerTitle="USER PROFILE" />
      </header>

      <div className="user-profile-div">
        <div className="user-profile-field">
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

        <div className="user-location-tab-bottom-div-input-div" style={{ marginTop: '20px' }}>
          <IoSearch onClick={() => fetchSuggestions(searchQuery)} size={20} />
          <input
            className="user-location-tab-bottom-div-input"
            placeholder="Search location"
            value={searchQuery}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchSuggestions(searchQuery);
              }
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className="location-tab-loader" style={{ margin: '15px 0' }}>
            <Oval height={20} width={20} color="green" ariaLabel="loading" />
          </div>
        )}
        {!loading && suggestions.length > 0 && (
          <div className="user-location-tab-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                className="user-location-tab-suggestion-info-div"
                key={index}
                onClick={() => handleAddressClick(suggestion)}
              >
                <SlLocationPin size={17} />
                <p>{suggestion.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="user-profile-field">
          <div id="address" className="user-profile-form-input">
            {address || 'This location [latitude : longitude] will be used to show your refurbished product to other users'}
          </div>
        </div>

        <div style={{ display: 'flex', width: '98%' }}>
          <div className="user-profile-lat-input">{lat || 'LATITUDE'}</div>
          <div className="user-profile-lat-input">{long || 'LONGITUDE'}</div>
        </div>

        <div
          className="user-location-tab-bottom-div-current-location"
          onClick={handleLocationClick}
          aria-label="Use current location"
          style={{ marginTop: '10px' }}
        >
          {fetchingUserLocation ? (
            <Oval height={20} width={20} color="green" ariaLabel="loading" />
          ) : (
            <>
              <MdMyLocation size={23} />
              Use current location
            </>
          )}
        </div>
      </div>

      <div
        className={`user-profile-form-button ${name && address ? 'active' : 'disabled'}`}
        onClick={handleUpdateUserData}
      >
        {isUpdating ? (
          <Oval height={20} width={20} color="green" ariaLabel="loading" />
        ) : (
          'UPDATE USER DATA'
        )}
      </div>
    </div>
  );
}

export default UserRefurbishedProduct;






