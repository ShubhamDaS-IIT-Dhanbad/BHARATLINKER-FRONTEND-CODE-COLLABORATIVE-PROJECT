import React, {useEffect, useState, useCallback, useMemo } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import shopProduct from '../../../appWrite/shop/shopProduct.js';
import { Oval } from 'react-loader-spinner';

import up1 from '../asset/up3.png';


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 3;
const MAX_TITLE_LENGTH = 300;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_KEYWORD_LENGTH = 50;

const Upload = ({ shopData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [coordinates] = useState({
    latitude: shopData.shopLatitude,
    longitude: shopData.shopLongitude,
  });
  const [formData, setFormData] = useState({
    shopId: shopData.shopId,
    title: '',
    description: '',
    price: '',
    discountedPrice: '',
    keyword: '',
  });
  const [files, setFiles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

   useEffect(()=>{
      window.scrollTo(0,0);
    },[currentStep])
  const validateStep = useCallback((step) => {
    const errors = {};
    switch (step) {
      case 1:
        if (!formData.title.trim()) errors.title = 'Product title required';
        if (!formData.description.trim()) errors.description = 'Description required';
        if (!formData.keyword.trim()) errors.keyword = 'Keyword required';
        break;
      case 2:
        if (!formData.price) errors.price = 'Original price required';
        if (!formData.discountedPrice) errors.discountedPrice = 'Selling price required';
        if (parseFloat(formData.discountedPrice) >= parseFloat(formData.price)) {
          errors.discountedPrice = 'Must be less than original price';
        }
        break;
      case 3:
        if (!coordinates.latitude || !coordinates.longitude) {
          errors.location = 'Location required';
        }
        if (files.length === 0) {
          errors.images = 'At least one image required';
        }
        break;
      default:
        break;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, coordinates, files]);

  const handleInputChange = useCallback((e, field, maxLength) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files)
      .filter(file => file.size <= MAX_FILE_SIZE)
      .slice(0, MAX_FILES - files.length);

    if (selectedFiles.length < e.target.files.length) {
      alert('Some files were rejected due to size limit (5MB) or max file count (3)');
    }

    setFiles(prev => [...prev, ...selectedFiles]);
  }, [files.length]);

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;

    setIsUploading(true);
    try {
      const maxShopProduct = 50;
      await shopProduct.uploadShopProduct({ ...formData, coordinates }, files, maxShopProduct);
      setUploadStatus('success');
      setFormData({
        shopId: shopData.shopId,
        title: '',
        description: '',
        price: '',
        discountedPrice: '',
        keyword: '',
      });
      setFiles([]);
      setCurrentStep(1);
    } catch (error) {
      setUploadStatus('error'); 
      setUploadError(error.message);
      console.log(error)
      console.error('Upload failed:', error.message);
    } finally {
      setIsUploading(false);
    }
  }, [formData, coordinates, files, validateStep, shopData.shopId]);

  const handleClosePopup = useCallback(() => {
    setUploadStatus(null);
  }, []);

  const renderStepContent = useMemo(() => ({
    1: (
      <div className="step-card">

        <div className="shop-upload-1-desc">
          Upload product details, including images, specifications, pricing, and other relevant
          information to ensure an accurate and engaging presentation for potential customers.
        </div>
        <fieldset className="floating-input">
          <legend>PRODUCT TITLE</legend>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange(e, 'title', MAX_TITLE_LENGTH)}
            className={formErrors.title ? 'error' : ''}
            disabled={isUploading}
            placeholder="Enter product title"
          />
          {formErrors.title && <span className="error-hint">{formErrors.title}</span>}
          <span className="user-upload-count" style={{ color: formData.title.length === MAX_TITLE_LENGTH ? 'red' : 'inherit' }}>
            {formData.title.length}/{MAX_TITLE_LENGTH}
          </span>
        </fieldset>

        <fieldset className="floating-input textarea">
          <legend>PRODUCT DESCRIPTION</legend>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange(e, 'description', MAX_DESCRIPTION_LENGTH)}
            rows="4"
            className={formErrors.description ? 'error' : ''}
            disabled={isUploading}
            placeholder="# for heading and * for points"
          />
          {formErrors.description && <span className="error-hint">{formErrors.description}</span>}
          <span className="user-upload-count" style={{ color: formData.description.length === MAX_DESCRIPTION_LENGTH ? 'red' : 'inherit' }}>
            {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </fieldset>

        <fieldset className="floating-input">
          <legend>KEYWORDS (comma-separated)</legend>
          <input
            type="text"
            value={formData.keyword}
            onChange={(e) => handleInputChange(e, 'keyword', MAX_KEYWORD_LENGTH)}
            className={formErrors.keyword ? 'error' : ''}
            disabled={isUploading}
            placeholder="e.g., electronics, phone, new"
          />
          {formErrors.keyword && <span className="error-hint">{formErrors.keyword}</span>}
          <span className="user-upload-count" style={{ color: formData.keyword.length === MAX_KEYWORD_LENGTH ? 'red' : 'inherit' }}>
            {formData.keyword.length}/{MAX_KEYWORD_LENGTH}
          </span>
        </fieldset>
      </div>
    ),
    2: (
      <div className="step-card">
        <div className="price-inputs">
          <fieldset className="floating-input">
            <legend>Original Price (₹)</legend>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className={formErrors.price ? 'error' : ''}
              disabled={isUploading}
              placeholder="Enter original price"
              min="0"
              step="0.01"
            />
            {formErrors.price && <span className="error-hint">{formErrors.price}</span>}
          </fieldset>

          <fieldset className="floating-input">
            <legend>Selling Price (₹)</legend>
            <input
              type="number"
              value={formData.discountedPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, discountedPrice: e.target.value }))}
              className={formErrors.discountedPrice ? 'error' : ''}
              disabled={isUploading}
              placeholder="Enter selling price"
              min="0"
              step="0.01"
            />
            {formErrors.discountedPrice && <span className="error-hint">{formErrors.discountedPrice}</span>}
          </fieldset>
        </div>
      </div>
    ),
    3: (
      <div className="step-card">

        <div className="dropzone" onClick={() => !isUploading && document.getElementById('fileInput')?.click()}>
          <FiUploadCloud className="upload-icon" />
          <p>Click to select</p>
          <small>(Max 3 images, 5MB each)</small>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        <div className="preview-grid">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="image-preview">
              <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} loading="lazy" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                disabled={isUploading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {formErrors.images && <span className="error-hint">{formErrors.images}</span>}
      </div>
    ),
  }), [formData, formErrors, files, isUploading, coordinates, handleInputChange, handleFileChange, removeFile]);

  return (
    <>
      {isUploading && <div className="overlay" />}

      <div className="multi-step-form">
        <div className="shop-upload-pic-header">
          <img src={up1} className="shop-upload-pic" alt="Shop" />
        </div>
        <div className="form-container">
          {renderStepContent[currentStep]}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                className="outline-button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isUploading}
              >
                Back
              </button>
            )}

            {currentStep < 3 ? (
              <button
                className="primary-button"
                onClick={handleNext}
                disabled={isUploading}
              >
                Continue
              </button>
            ) : (
              <button
                className="primary-button"
                onClick={handleSubmit}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Oval
                    height={30}
                    width={30}
                    color="white" 
                    secondaryColor="#2874f0" 
                    ariaLabel="loading"
                  />
                ) : (
                  'UPLOAD'
                )}
              </button>
            )}
          </div>
        </div>

        {uploadStatus && (
          <div className="shop-popup-overlay">
            <div className="shop-popup-card">
              <div className="shop-popup-pointer"></div>
              <h2 className="shop-popup-title">
                {uploadStatus === 'success' ? 'Upload Successful!' : 'Upload Failed'}
              </h2>
              <div style={{ fontSize: "13px" }} className="shop-popup-text">
                {uploadStatus === "success"
                  ? "Your product has been successfully listed in the shop."
                  : uploadError
                    ? uploadError
                    : "There was an error uploading your product. Please try again."}
              </div>

              <div className="shop-popup-buttons">
                <button
                  className="shop-popup-btn-primary"
                  onClick={handleClosePopup}
                >
                  OK
                </button>
                {uploadStatus === 'error' && (
                  <button
                    className="shop-popup-btn-secondary"
                    onClick={handleClosePopup}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Upload;