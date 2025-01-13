import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import conf from '../../../conf/conf.js'

const ShopManager = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([null, null, null]);
  const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    email: '',
    customerCare: '',
    lat: null,
    long: null,
  });

  useEffect(() => {
    setLoading(true);

    // Retrieve shop data from cookies
    const shopData = Cookies.get('BharatLinkerShopData');
    if (shopData) {
      const parsedShopData = JSON.parse(shopData);

      const {
        shopName,
        address,
        email,
        customerCare,
        lat,
        long,
        images: shopImages,
      } = parsedShopData;

      setFormData({
        shopName,
        address,
        email,
        customerCare,
        lat,
        long,
      });

      const paddedImages = [...(shopImages || []), null, null, null].slice(0, 3);
      setImages(paddedImages);
    } else {
      navigate('/retailer/login');
    }

    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      await userShopData.updateUserRefurbishedProduct(
        productId,
        toDeleteImagesUrls,
        { ...formData },
        images
      );
      alert('Shop details updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
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

          const apiKey = conf.opencageapikey;
          const apiUrl = `${conf.opencageapiurl}?key=${apiKey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;

          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const address = data.results[0]?.formatted;

            if (address) {
              setFormData((prevData) => ({
                ...prevData,
                address,
                lat: latitude,
                long: longitude,
              }));
            } else {
              console.error('Unable to fetch address.');
            }
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

  return (
    <div>
      <h1>Shop Manager</h1>
      <form>
        <label>
          Shop Name:
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Customer Care:
          <input
            type="text"
            name="customerCare"
            value={formData.customerCare}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleLocationClick}>
          {fetchingUserLocation ? 'Fetching location...' : 'Get Current Location'}
        </button>
        <button type="button" onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Shop'}
        </button>
      </form>
    </div>
  );
};

export default ShopManager;
