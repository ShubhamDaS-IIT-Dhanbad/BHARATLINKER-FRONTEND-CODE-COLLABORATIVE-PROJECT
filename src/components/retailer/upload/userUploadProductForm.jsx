import React, { useState, useEffect } from 'react';
import { CiImageOn } from 'react-icons/ci';
import { TbWorldUpload } from 'react-icons/tb';
import { Oval } from 'react-loader-spinner';
import { uploadProductWithImages } from '../../../appWrite/uploadProduct/upload.js';
import { useNavigate } from 'react-router-dom';

const UploadBooksModulesForm = ({ retailerData }) => {
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState({ lat: null, long: null });
  const [uploadStatus, setUploadStatus] = useState({ success: false, fail: false });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountedPrice: '',
    keywords: '',
    isInstock: true,
    shop: '',
  });
  const [images, setImages] = useState([null, null, null]);
  const [isUploading, setIsUploading] = useState(false);
  const [allFieldEntered, setAllFieldEntered] = useState(true);

  useEffect(() => {
    if (retailerData) {
      if (retailerData.lat && retailerData.long) {
        setCoordinates({ lat: retailerData.lat, long: retailerData.long });
      } else {
        alert('AT FIRST SET SHOP LOCATION');
        navigate('/retailer/dashboard');
      }
    }
    window.scrollTo(0, 0); // Scrolls to the top
  }, [retailerData, navigate]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (index, files) => {
    if (files && files[0]) {
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index] = files[0];
        console.log(files)
        return updatedImages;
      });
    }
  };

  const handleDrop = (index, event) => {
    event.preventDefault();
    handleImageChange(index, event.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = null;
      return updatedImages;
    });
  };

  const validateForm = () => {
    const { title, description, price, discountedPrice, keywords } = formData;
    return title && description && price && discountedPrice && keywords && coordinates.lat && coordinates.long;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setAllFieldEntered(false);
      return;
    }

    setIsUploading(true);
    const finalFormData = {
      ...formData,
      shop: retailerData?.$id,
      lat: coordinates.lat,
      long: coordinates.long,
    };

    try {
      await uploadProductWithImages(finalFormData, images);
      setUploadStatus({ success: true, fail: false });
      resetForm();
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus({ success: false, fail: true });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      discountedPrice: '',
      keywords: '',
      isInstock: true,
      shop: retailerData?.$id,
    });
    setImages([null, null, null]);
  };

  const Popup = ({ message, onClose, isSuccess }) => (
    <div className={`retailer-product-upload-${isSuccess ? 'success' : 'fail'}-popup`}>
      <div className={`retailer-product-upload-${isSuccess ? 'success' : 'fail'}-popup-inner`}>
        <div className={`retailer-product-upload-${isSuccess ? 'success' : 'fail'}-popup-message`}>{message}</div>
        <div className={`retailer-product-upload-${isSuccess ? 'success' : 'fail'}-popup-ok`} onClick={onClose}>
          Ok
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="retailer-upload-product-form">
        <div className="user-refurbished-product-title-description-div">
          <textarea
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a relevant TITLE"
            className="retailer-upload-product-form-textarea"
            style={{ maxWidth: '90vw', minHeight: '10vh' }}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="(# HEADING) AND (* DETAILS)
Mention any notable issues or refurbishments.Be clear and concise for better understanding.
 
Example:-
#Condition: 
    *Refurbished - Like New
#Features: 
    *16GB RAM, 512GB SSD
#Includes:
    *Original charger and carrying case
#Issues: 
    *Minor scratches on the outer casing"
            className="retailer-upload-product-form-textarea"
            style={{ maxWidth: '90vw', minHeight: '70vh' }}
          />
        </div>

        <div className="user-refurbished-product-price-discounted-div">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter ORIGINAL PRICE"
            style={{ maxWidth: '90vw', height: '4vh' }}
            className="retailer-upload-product-form-textarea"
          />
          <input
            type="number"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleInputChange}
            placeholder="Enter DISCOUNTED PRICE"
            style={{ maxWidth: '90vw', height: '4vh' }}
            className="retailer-upload-product-form-textarea"
          />
        </div>

        <textarea
          name="keywords"
          placeholder="Keywords (separated by commas [,])"
          value={formData.keywords}
          onChange={handleInputChange}
          className="retailer-upload-product-form-textarea"
          style={{ maxWidth: '90vw', minHeight: '20vh' }}
        />

        <div className="retailer-upload-form-image-section">
          {images.map((image, index) => (
            <div
              key={index}
              onDrop={(event) => handleDrop(index, event)}
              onDragOver={(event) => event.preventDefault()}
            >
              {image ? (
                <div  className="retailer-upload-form-uploaded-image-container">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded ${index + 1}`}
                    className="retailer-upload-form-uploaded-image"
                  />
                  <button onClick={() => removeImage(index)} className="retailer-remove-image-button">
                    Remove
                  </button>
                </div>
              ) : (
                <div  className="retailer-upload-form-uploaded-image-container">
                  <img
                  src="https://res.cloudinary.com/demc9mecm/image/upload/v1737885176/yjev692kuftvpxzbzpcj.jpg"

                    alt={`Uploaded ${index + 1}`}
                    className="retailer-upload-form-uploaded-image"
                    
                  onClick={() => document.getElementById(`image-upload-${index}`).click()}
                  />
                </div>
              )}
              <input
                type="file"
                id={`image-upload-${index}`}
                style={{ display: 'none' }}
                onChange={(event) => handleImageChange(index, event.target.files)}
              />
            </div>
          ))}
        </div>

        <div
          className={`retailer-upload-product-form-submit ${isUploading ? 'disabled' : ''}`}
          onClick={isUploading ? null : handleSubmit}
        >
          UPLOAD PRODUCT
        </div>
      </div>

      {!allFieldEntered && <Popup message="All fields are required!" onClose={() => setAllFieldEntered(true)} isSuccess={false} />}
      {isUploading && (
        <div className="retailer-upload-form-loader">
          <Oval height={40} width={40} color="#fff" />
        </div>
      )}
      {uploadStatus.success && <Popup message="Product uploaded successfully!" onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess={true} />}
      {uploadStatus.fail && <Popup message="Failed to upload product. Please try again!" onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess={false} />}
    </>
  );
};

export default UploadBooksModulesForm;
