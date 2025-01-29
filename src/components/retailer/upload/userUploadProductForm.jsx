import React, { useState, useEffect } from 'react';
import { CiImageOn } from 'react-icons/ci';
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
        alert('Please set your shop location first');
        navigate('/retailer/dashboard');
      }
    }
    window.scrollTo(0, 0);
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
    setAllFieldEntered(true);
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
    <div className="upload-product-container">
      <div className="form-section">
        <label className="input-label">Product Title*</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter product title"
          className="text-input"
        />
      </div>

      <div className="form-section">
        <label className="input-label">Description*</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Provide detailed description..."
          className="description-textarea"
          rows={4}
        />
        <div className="formatting-hint">
          Use # for headings and * for bullet points
        </div>
      </div>

      <div className="price-section">
        <div className="price-input-wrapper">

          <div className="price-input-group">
            <label className="input-label">Original Price ($)*</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="price-input"
              min="0"
            />
          </div>

          <div className="price-input-group">
            <label className="input-label">Discounted Price ($)*</label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleInputChange}
              className="price-input"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="input-label">Keywords*</label>
        <input
          name="keywords"
          value={formData.keywords}
          onChange={handleInputChange}
          placeholder="fiction, science, bestseller..."
          className="text-input"
        />
      </div>

      <div className="image-section">
        <label className="input-label">Upload Images (3 required)*</label>
        <div className="image-grid">
          {images.map((image, index) => (
            <div
              key={index}
              className="image-upload-card"
              onDrop={(e) => handleDrop(index, e)}
              onDragOver={(e) => e.preventDefault()}
            >
              {image ? (
                <div className="image-preview-wrapper">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="preview-image"
                  />
                  <button
                    className="remove-image-button"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="image-upload-box">
                  <CiImageOn className="upload-icon" />
                  <span className="upload-text">Tap to upload</span>
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange(index, e.target.files)}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        {!allFieldEntered && (
          <div className="error-message">Please fill all required fields</div>
        )}
        {uploadStatus.success && (
          <div className="success-message">
            Product uploaded successfully!
          </div>
        )}

        {uploadStatus.fail && (
          <div className="error-message">
            Upload failed. Please check your connection and try again.
          </div>
        )}
        <button
          className={`submit-button ${isUploading ? 'uploading' : ''}`}
          onClick={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? (
            <Oval color="#fff" height={24} width={24} />
          ) : (
            'Publish Product'
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadBooksModulesForm;