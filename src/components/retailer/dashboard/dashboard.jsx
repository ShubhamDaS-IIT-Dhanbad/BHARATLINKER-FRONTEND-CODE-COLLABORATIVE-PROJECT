import React, { useEffect, useState, useReducer } from 'react';
import conf from '../../../conf/conf.js';
import { Helmet } from 'react-helmet-async';
import { updateShopData } from '../../../appWrite/shop/shop.js';
import Navbar from '../navbarComponent/navbar.jsx';
import './dashboard.css';
import Cookies from 'js-cookie';


import { RiRefreshLine } from "react-icons/ri";
import { IoSaveOutline } from "react-icons/io5";
import { TiInfoOutline } from "react-icons/ti";
import { SlLocationPin } from 'react-icons/sl';
import { MdMyLocation } from 'react-icons/md';
import { Oval } from 'react-loader-spinner';
import { IoSearch } from 'react-icons/io5';

import { BiMessageSquareEdit } from "react-icons/bi";
import useLocationFromCookie from '../../../hooks/useLocationFromCookie.jsx';


const i1 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737885176/yjev692kuftvpxzbzpcj.jpg';

const initialState = {
  formData: {
    shopName: '',
    phoneNumber: '',
    address: '',
    email: '',
    customerCare: '',
    category: '',
    description: '',
    lat: '',
    long: '',
  },
  images: [null, null, null],
  toDeleteImagesUrls: [],
  fetchingUserLocation: false,
  isUpdating: false,
  loading: true,
  isEditing: {},
  changedFields: {},
  initialData: {},
};

function shopReducer(state, action) {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return { ...state, formData: action.payload };
    case 'SET_IMAGES':
      return { ...state, images: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_IS_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_CHANGED_FIELDS':
      return { ...state, changedFields: action.payload };
    case 'SET_INITIAL_DATA':
      return { ...state, initialData: action.payload };
    case 'SET_FETCHING_USER_LOCATION':
      return { ...state, fetchingUserLocation: action.payload };
    case 'SET_IS_UPDATING':
      return { ...state, isUpdating: action.payload };
    case 'SET_TO_DELETE_IMAGES':
      return { ...state, toDeleteImagesUrls: action.payload };
    default:
      return state;
  }
}









const ShopManager = ({ retailerData }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  const fetchCurrentLocationHook = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const apiUrl = `${conf.opencageapiurl}?key=${conf.opencageapikey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const data = await response.json();
        const address = data.results[0]?.formatted;

        if (address) {
          return { latitude, longitude, address };
        } else {
          throw new Error('Unable to fetch address. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        alert('Failed to fetch location. Please try again later.');
        return null;
      }
    } else {
      alert('Geolocation is not supported by your browser.');
      return null;
    }
  };

  useEffect(() => {
    if (retailerData) {
      const data = {
        shopName: retailerData?.shopName || '',
        phoneNumber: retailerData?.phoneNumber || '',
        email: retailerData?.email || '',
        customerCare: retailerData?.customerCare || '',
        category: retailerData?.category || '',
        description: retailerData?.description || '',
      };
      dispatch({ type: 'SET_FORM_DATA', payload: data });
      dispatch({ type: 'SET_INITIAL_DATA', payload: data });
      dispatch({
        type: 'SET_IS_EDITING',
        payload: Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      });
      dispatch({ type: 'SET_CHANGED_FIELDS', payload: {} });
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({
        type: 'SET_IMAGES',
        payload: [...retailerData?.shopImages, null, null, null].slice(0, 3),
      });
    }
  }, [retailerData]);

  const handleEditClick = (field) => {
    dispatch({
      type: 'SET_IS_EDITING',
      payload: { ...state.isEditing, [field]: true },
    });
  };

  const handleSaveClick = (field) => {
    dispatch({
      type: 'SET_IS_EDITING',
      payload: { ...state.isEditing, [field]: false },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'SET_FORM_DATA',
      payload: { ...state.formData, [name]: value },
    });
    dispatch({
      type: 'SET_CHANGED_FIELDS',
      payload: { ...state.changedFields, [name]: value },
    });
  };


  const handleImageChange = (index, file) => {
    if (file) {
      const updatedImages = [...state.images];
      updatedImages[index] = file;

      dispatch({ type: 'SET_IMAGES', payload: updatedImages });
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...state.images];
    const imageUrl = updatedImages[index];
    if (imageUrl) {
      dispatch({
        type: 'SET_TO_DELETE_IMAGES',
        payload: [...state.toDeleteImagesUrls, imageUrl],
      });
    }
    updatedImages[index] = null;
    dispatch({ type: 'SET_IMAGES', payload: updatedImages });
  };

  const handleLocationClick = async () => {
    dispatch({ type: 'SET_FETCHING_USER_LOCATION', payload: true });
    const location = await fetchCurrentLocationHook();
    if (location) {
      dispatch({
        type: 'SET_FORM_DATA',
        payload: {
          ...state.formData,
          lat: location.latitude,
          long: location.longitude,
          address: location.address,
        },
      });
      dispatch({
        type: 'SET_CHANGED_FIELDS',
        payload: {
          ...state.changedFields,
          lat: location.latitude,
          long: location.longitude,
          address: location.address,
        },
      });
    }
    dispatch({ type: 'SET_FETCHING_USER_LOCATION', payload: false });
  };

  const handleUpdate = async () => {
    dispatch({ type: 'SET_IS_UPDATING', payload: true });
    try {
      const newFiles = state.images.filter((image) => image !== null);
      const retailerDataP = await updateShopData(
        retailerData?.$id,
        state.toDeleteImagesUrls,
        state.changedFields,
        newFiles
      ); console.log(retailerDataP, "pppppppp")
      Cookies.set('BharatLinkerShopData', JSON.stringify(retailerDataP), { expires: 7, path: '' });
      dispatch({ type: 'SET_CHANGED_FIELDS', payload: {} });
    } catch (error) {
      console.error('Error updating shop:', error);
    } finally {
      dispatch({ type: 'SET_IS_UPDATING', payload: false });
    }
  };

  const handleReset = () => {
    dispatch({ type: 'SET_FORM_DATA', payload: state.initialData });
    dispatch({ type: 'SET_CHANGED_FIELDS', payload: {} });
    dispatch({
      type: 'SET_IS_EDITING',
      payload: Object.keys(state.initialData).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      ),
    });
  };

  const handleResetField = (field) => {
    dispatch({
      type: 'SET_FORM_DATA',
      payload: { ...state.formData, [field]: state.initialData[field] }, // Reset only that field
    });
    dispatch({
      type: 'SET_CHANGED_FIELDS',
      payload: { ...state.changedFields, [field]: state.initialData[field] }, // Reset change tracking
    });
    dispatch({
      type: 'SET_IS_EDITING',
      payload: { ...state.isEditing, [field]: false }, // Disable editing after reset
    });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
  const [showi, setShowi] = useState(false);

  const [suggestions, setSuggestions] = useState([]);

  const { fetchLocationSuggestions } = useLocationFromCookie();
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
  const handleAddressClick = async (suggestion) => {
    setSearchQuery(suggestion.label);
    setSuggestions([]);

    dispatch({ type: 'SET_FETCHING_USER_LOCATION', payload: true });
    console.log(suggestion)
    const location = suggestion;

    if (location) {
      dispatch({
        type: 'SET_FORM_DATA',
        payload: {
          ...state.formData,
          lat: location.lat,
          long: location.lon,
          address: location.label,
        },
      });
      dispatch({
        type: 'SET_CHANGED_FIELDS',
        payload: {
          ...state.changedFields,
          lat: location.lat,
          long: location.lon,
          address: location.label,
        },
      });
    }

    dispatch({ type: 'SET_FETCHING_USER_LOCATION', payload: false });
  };

  return (
    <>
      <Helmet>
        <title>{retailerData?.shopName || 'Shop Manager'} | Bharat Linker</title>
        <meta name="description" content="Manage your shop details on Bharat Linker." />
      </Helmet>
      {state.loading ? (
        <div className="fallback-loading">
          <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
        </div>
      ) : (<>
        <Navbar retailerData={retailerData} headerTitle="Dashboard" />
        <div className="dashboard-container" style={{ marginTop: '65px' }}>

          <form className="retailer-profile-div">
            {Object.keys(state.formData).map((key) => {
              if (["lat", "long", "address"].includes(key)) return null;
              return (
                <div
                  className={`retailer-profile-field-parent ${key === 'shopName' ? 'shopname-field' :
                    key === 'phoneNumber' ? 'phonenumber-field' :
                      key === 'email' ? 'email-field' :
                        key === 'customerCare' ? 'customercare-field' :
                          key === 'category' ? 'category-field' :
                            key === 'description' ? 'description-field' : ''
                    }`}
                  key={key}
                >
                  <label
                    className={`retailer-profile-field-label ${key === 'shopName' ? 'shopname-field' :
                      key === 'phoneNumber' ? 'phonenumber-field' :
                        key === 'email' ? 'email-field' :
                          key === 'customerCare' ? 'customercare-field' :
                            key === 'category' ? 'category-field' :
                              key === 'description' ? 'description-field' : ''
                      }`}
                  >
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </label>
                  <div
                    className={`retailer-profile-field ${key === 'shopName' ? 'shopname-field' :
                      key === 'phoneNumber' ? 'phonenumber-field' :
                        key === 'email' ? 'email-field' :
                          key === 'customerCare' ? 'customercare-field' :
                            key === 'category' ? 'category-field' :
                              key === 'description' ? 'description-field' : ''
                      }`}
                  >
                    {key === 'description' ? (
                      <textarea
                        name={key}
                        placeholder="
(# HEADING) AND (* DETAILS)
Mention any notable issues or refurbishments.Be clear and concise for better understanding.

Example:-
#Condition: 
    *Refurbished - Like New
#Features: 
    *16GB RAM, 512GB SSD
#Includes:
    *Original charger and carrying case
#Issues: 
    *Minor scratches on the outer casing
                        "
                        
                        value={state.formData['description']}
                        onChange={handleInputChange}
                        disabled={!state.isEditing[key]}
                        className={`retailer-profile-form-textarea ${key === 'description' ? 'description-textarea' : 'category-textarea'}`}
                      />
                    ) : (
                      <input
                        type={key === 'email' ? 'email' : 'text'}
                        name={key}
                        value={state.formData[key]}
                        onChange={handleInputChange}
                        disabled={!state.isEditing[key]}
                        className={`retailer-profile-form-input ${key === 'shopName' ? 'shopname-input' :
                          key === 'phoneNumber' ? 'phonenumber-input' :
                            key === 'email' ? 'email-input' :
                              key === 'customerCare' ? 'customercare-input' : ''
                          }`}
                      />
                    )}
                    <div style={{ display: "flex" }}
                      className={`retailer-dashboard-edit-container ${key === 'description' ? 'description-edit' :
                        key === 'phoneNumber' ? '' : ''}`}>
                      {!state.isEditing[key] && (
                        <BiMessageSquareEdit size={23} onClick={() => handleEditClick(key)} />
                      )}
                      {state.isEditing[key] && (
                        <IoSaveOutline
                          onClick={() => handleSaveClick(key)}
                          size={20}
                        />
                      )}
                      {true && (
                        <RiRefreshLine
                          onClick={() => handleResetField(key)}
                          size={22}
                        />
                      )}
                    </div>
                  </div>
                </div>


              );
            })}



            {/* Address, Latitude, and Longitude */}
            <div>
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
                  {state.formData?.address || retailerData?.address || 'This location [latitude : longitude] will be used to show your refurbished product to other users'}
                </div>
                <TiInfoOutline size={25} onClick={() => setShowi(!showi)} />
              </div>

              {/* Info box toggle */}
              {showi && (
                <div className="info-box">
                  This location will be used to display your shop to other users in your area.
                  Your latitude and longitude are stored for accurate location tracking.
                </div>
              )}

              <div style={{ display: 'flex', width: '98%' }}>
                <div className="user-profile-lat-input">{state.formData.lat || retailerData?.lat || 'Not available' || 'LATITUDE'}</div>
                <div className="user-profile-lat-input">{state.formData.long || retailerData?.long || 'Not available' || 'LONGITUDE'}</div>
              </div>

              <div
                className="user-location-tab-bottom-div-current-location"
                onClick={handleLocationClick}
                aria-label="Use current location"
                style={{ marginTop: '10px' }}
              >
                {fetchingUserLocation ? (
                  <Oval height={20} width={20} color="white" secondaryColor='green' ariaLabel="loading" />
                ) : (
                  <>
                    <MdMyLocation size={23} />
                    Use current location
                  </>
                )}
              </div>
            </div>





            {/* Image Upload */}
            <div className='retailer-profile-shop-image'>
              {state.images.map((image, index) => (
                <div className='retailer-profile-shop-image-divs' key={index}>
                  {image ? (
                    // Display image if it's a URL or a file
                    <>
                      <img
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        className='retailer-profile-shop-image-divs-img'
                        alt={`Shop Image ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="retailer-profile-shop-image-label"
                        onClick={() => removeImage(index)}
                        disabled={!image}
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <img
                        src={i1}
                        className='retailer-profile-shop-image-divs-img'
                        alt={`Shop Image ${index + 1}`}
                      />
                      <input
                        className="retailer-profile-shop-image-divs-chose-file"
                        type="file"
                        accept="image/*"
                        id={`file-input-${index}`}
                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                      />
                      <label
                        className="retailer-profile-shop-image-label"
                        htmlFor={`file-input-${index}`}
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              ))}
            </div>






            {/* Save and Reset Buttons */}
            <div className="actions">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={state.isUpdating}
              >

              </button>
              <button type="button" onClick={handleReset} disabled={state.isUpdating}>
                <RiRefreshLine />
              </button>
            </div>



            <div
              className={`user-profile-form-button ${name && address ? 'active' : 'disabled'}`}
              disabled={state.isUpdating}
              onClick={() => { handleUpdate() }}
            >
              {state.isUpdating ? (
                <Oval height={20} width={20} color="white" ariaLabel="loading" />
              ) : (
                'UPDATE SHOP DATA'
              )}
            </div>
          </form>

        </div>
      </>)}
    </>
  );
};

export default ShopManager;
