import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';
import { Oval } from 'react-loader-spinner';
import { MdMyLocation } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { updateShopData, getShopData } from '../../../appWrite/shop/shop.js';
import conf from '../../../conf/conf.js';

import Navbar from '../navbarComponent/navbar.jsx';
import './dashboard.css';
const ShopManager = ({ retailerData }) => {
  const navigate = useNavigate();
  
  // States
  const [shopData, setShopData] = useState({});
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    email: '',
    customerCare: '',
    category: '',
    lat: '',
    long: '',
  });
  const [images, setImages] = useState([null, null, null]);
  const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize shop data
  const initializeShopData = async () => {
    const shopData = Cookies.get('BharatLinkerShopData');
    if (shopData) {
      const parsedShopData = JSON.parse(shopData);
      setShopData(parsedShopData);

      const {
        id = parsedShopData.$id,
        shopName = '',
        address = '',
        customerCare = '',
        category = '',
        email = parsedShopData?.email,
        phoneNumber = parsedShopData?.phoneNumber,
        lat = '',
        long = '',
        images = parsedShopData.shopImages || [],
      } = parsedShopData;

      setFormData({
        id: id ?? '',
        email ,
        phoneNumber,
        shopName: shopName ?? '',
        address: address ?? '',
        category: category ?? '',
        email: email ?? '',
        customerCare: customerCare ?? '',
        lat: lat ?? '',
        long: long ?? '',
      });

      setImages([...images, null, null, null].slice(0, 3));
    } else {
      navigate('/retailer/login');
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeShopData();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
  };

  // Refresh shop data
  const refreshShopData = async () => {
    try {
      const fetchShopData = await getShopData(shopData.phoneNumber);
      Cookies.set('BharatLinkerShopData', JSON.stringify(fetchShopData), { expires: 7 });
      initializeShopData();
    } catch (error) {
      console.error('Error updating shop data:', error);
    }
  };

  // Update shop data
  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const { id, ...shopDetails } = formData;
      const newFiles = images.filter((image) => image !== null);
      await updateShopData(id, toDeleteImagesUrls, shopDetails, newFiles);
      refreshShopData();
    } catch (error) {
      console.error('Error updating shop:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch location
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setFetchingUserLocation(true);
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;

          try {
            const apiUrl = `${conf.opencageapiurl}?key=${conf.opencageapikey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            const address = data.results[0]?.formatted;

            if (address) {
              setFormData((prev) => ({
                ...prev,
                address: address ?? '',
                lat: latitude.toString(),
                long: longitude.toString(),
              }));
            } else {
              alert('Unable to fetch address. Please try again.');
            }
          } catch (error) {
            console.error('Error fetching address:', error);
            alert('Failed to fetch location. Please try again later.');
          } finally {
            setFetchingUserLocation(false);
          }
        },
        (error) => {
          console.error('Error fetching current location:', error);
          alert('Location access denied or unavailable.');
          setFetchingUserLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Handle image change
  const handleImageChange = (index, file) => {
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const imageUrl = updatedImages[index];
    if (imageUrl) {
      setToDeleteImagesUrls((prev) => [...prev, imageUrl]);
    }
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  return (
    <>
      <Helmet>
        <title>{retailerData?.shopName} | Bharat Linker</title>
        <meta name="description" content="Manage your shop details on Bharat Linker." />
      </Helmet>

      <Navbar retailerData={retailerData} headerTitle="Dashboard" />

      <div className="dashboard-container">
        {loading ? (
          <Oval height={50} width={50} color="green" ariaLabel="loading" />
        ) : (
          <form className="shop-manager-form">
            <div className="form-group">
              <label>Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName ?? ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address ?? ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email ?? ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Customer Care</label>
              <input
                type="text"
                name="customerCare"
                value={formData.customerCare ?? ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <textarea
                name="category"
                value={formData.category ?? ''}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Latitude & Longitude</label>
              <div className="lat-long-container">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={formData.lat ?? ''}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={formData.long ?? ''}
                  readOnly
                />
                <button
                  type="button"
                  onClick={handleLocationClick}
                  disabled={fetchingUserLocation}
                >
                  {fetchingUserLocation ? 'Fetching...' : 'Use Current Location'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Shop Images</label>
              <div className="image-upload-container">
                {images.map((image, index) => (
                  <div key={index} className="image-upload">
                    {image ? (
                      <img
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        alt={`Uploaded ${index + 1}`}
                        onClick={() => removeImage(index)}
                      />
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Shop'}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default ShopManager;
