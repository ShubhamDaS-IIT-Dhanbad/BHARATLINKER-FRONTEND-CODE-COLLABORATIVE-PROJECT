import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CiImageOn } from 'react-icons/ci';  // Ensure CiImageOn is imported correctly
import { Oval } from 'react-loader-spinner';
import { FaArrowLeft } from 'react-icons/fa';
import { updateShopData, getShopData } from '../../../appWrite/shop/shop.js';
import conf from '../../../conf/conf.js';

import './dashboard.css'
const ShopManager = () => {
  const navigate = useNavigate();


  const [shopData, setShopData] = useState({});
  const [images, setImages] = useState([null, null, null]);
  const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    email: '',
    customerCare: '',
    category: '',
    lat: '',
    long: '',
  });

  useEffect(() => {
    const shopData = Cookies.get('BharatLinkerShopData');

    if (shopData) {
      const parsedShopData = JSON.parse(shopData);
      setShopData(parsedShopData);

      const {
        id = parsedShopData.$id,
        phoneNumber,
        shopName = '',
        address = '',
        customerCare = '',
        category = '',
        email = '',
        lat = '',
        long = '',
        images = parsedShopData.shopImages || [],
      } = parsedShopData;

      setFormData({
        id,
        shopName,
        phoneNumber,
        address,
        category,
        email,
        customerCare,
        lat,
        long,
      });

      // Set images from the shop data, ensuring exactly 3 images
      setImages([...images, null, null, null].slice(0, 3));
    } else {
      navigate('/retailer/login');
    }

    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const { id, ...shopDetails } = formData;
      const newFiles = images.filter(image => image !== null); // Filter out null values
      const toDeleteImages = toDeleteImagesUrls; // Images to be deleted

      // Update shop data in the database
      await updateShopData(id, toDeleteImages, shopDetails, newFiles);

      // Fetch updated shop data
      const fetchShopData = await getShopData(shopData.phoneNumber);  // Assuming phoneNumber is available

      // Set updated shop data in Cookies
      Cookies.set('BharatLinkerShopData', JSON.stringify(fetchShopData), { expires: 7 });

      // Update form data with the new data
      setFormData({
        ...formData,
        ...fetchShopData,
        images: fetchShopData.shopImages || formData.images,
      });

      // Reset images and toDeleteImagesUrls after successful update
      setImages([null, null, null]);  // Reset the images state
      setToDeleteImagesUrls([]);  // Reset the URLs to delete

      alert('Shop details updated successfully!');
    } catch (error) {
      console.error('Error updating shop:', error);
      alert('Failed to update shop details.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setFetchingUserLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (!conf.opencageapikey || !conf.opencageapiurl) {
            console.error('API Key or URL for geolocation is missing in configuration.');
            setFetchingUserLocation(false);
            return;
          }

          const apiUrl = `${conf.opencageapiurl}?key=${conf.opencageapikey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;

          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const address = data.results[0]?.formatted;

            if (address) {
              setFormData((prevData) => ({
                ...prevData,
                address,
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

  const handleImageChange = (index, file) => {
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = file; // Store the file
      setImages(updatedImages);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const imageUrl = updatedImages[index];
    if (imageUrl && isValidUrl(imageUrl)) {
      setToDeleteImagesUrls((prevUrls) => [...prevUrls, imageUrl]);
    }
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  const isValidUrl = (url) => {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return regex.test(url);
  };

  return (
    <>
      <header>
        <div className="retailer-dashboard-page-header-upper-div">
          <FaArrowLeft
            id="user-refurbished-product-page-left-icon"
            size={25}
            onClick={() => navigate('/retailer')}
            aria-label="Go back to User Account"
            role="button"
          />
          <div className="user-refurbished-product-page-header-inner">
            <h1 className="user-refurbished-product-page-header-text">
              RETAILER DASHBOARD
            </h1>
            {shopData?.phoneNumber && (
              <div
                className="user-refurbished-product-page-header-phn-div"
              >
                {shopData?.phoneNumber}
              </div>
            )}
          </div>
        </div>
      </header>
      {loading ? (
        <div className='retailer-dashboard-loader'>
           <Oval height={40} width={45} color="white" secondaryColor="gray" ariaLabel="loading" />           
        </div>
      ) : (
        <div className='retailer-dashboard-div'>
          <form className='retailer-dashboard-div-form'>

            <label className='retailer-dashboard-div-form-label'>
              <p className='retailer-dashboard-div-form-label-p'>SHOP NAME</p>
              <textarea
                type="text"
                name="shopName"
                className='retailer-dashboard-div-form-label-input'
                value={formData.shopName || ''}
                onChange={handleInputChange}
              />
            </label>

            <label className='retailer-dashboard-div-form-label'>
              SHOP ADDRESS
              <textarea
                type="text"
                name="address"
                style={{minHeight:"30px"}}
                value={formData.address || ''}
                className='retailer-dashboard-div-form-label-input'
                onChange={handleInputChange}
              />
            </label>
            <div className='retailer-dashboard-shop-location'onClick={handleLocationClick} disabled={fetchingUserLocation}>
              {fetchingUserLocation ? 'Fetching location...' : 'Get Current Location'}
            </div>
            <label className='retailer-dashboard-div-form-label'>
              EMAIL
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                className='retailer-dashboard-div-form-label-input'
                onChange={handleInputChange}
              />
            </label>
            <label className='retailer-dashboard-div-form-label'>
              CUSTOMER CARE
              <input
                type="text"
                name="customerCare"
                value={formData.customerCare || ''}
                className='retailer-dashboard-div-form-label-input'
                onChange={handleInputChange}
              />
            </label>

            {/* Category Input */}
            <label className='retailer-dashboard-div-form-label'>
              CATEGORY OF YOUR SHOP
              <textarea
                type="text"
                name="category"
                style={{minHeight:"30px"}}
                value={formData.category || ''}
                className='retailer-dashboard-div-form-label-input'
                onChange={handleInputChange}
              />
            </label>

            {/* Image Uploads */}
            <div className="retailer-dashboard-form-image-section-div">
              <label >SHOP IMAGES</label>
              <div className="retailer-dashboard-form-image-section">
                {images.map((image, index) => (
                  <div key={index} className="user-refurbished-product-book-module-update-form-image-container">
                    {image ? (
                      <img
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        className="user-refurbished-product-book-module-update-form-uploaded-image"
                        alt={`Uploaded ${index + 1}`}
                        onClick={() => removeImage(index)}
                        onLoad={(e) => {
                          if (typeof image !== 'string') URL.revokeObjectURL(e.target.src);
                        }}
                      />
                    ) : (
                      <div
                        className="user-refurbished-product-book-module-update-form-image-placeholder"
                        onClick={() => document.getElementById(`image-upload-${index}`).click()}
                      >
                        <CiImageOn size={50} />
                      </div>
                    )}
                    <input
                      type="file"
                      id={`image-upload-${index}`}
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageChange(index, e.target.files[0])}
                    />
                  </div>
                ))}
              </div>
            </div>
           

            <div className='retailer-dashboard-shop-update' onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'UPDATE SHOP DATA'}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ShopManager;
