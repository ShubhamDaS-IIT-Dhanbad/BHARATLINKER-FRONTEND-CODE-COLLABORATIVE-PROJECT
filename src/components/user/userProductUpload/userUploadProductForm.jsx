import React, { useState } from 'react';
import { FiUploadCloud, FiDollarSign, FiMapPin } from 'react-icons/fi';
import UserRefurbishedProduct from '../../../appWrite/UserRefurbishedProductService/userRefurbishedProduct.js';
import ProgressBar from '../progressBar.jsx';
import { Oval } from 'react-loader-spinner';
import { FaLocationDot } from "react-icons/fa6";
const UploadBooksModulesForm = ({ userData }) => {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [coordinates, setCoordinates] = useState();
  const [showLocationList, setShowLocationList] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountedPrice: '',
    keyword: '',
    phoneNumber: `91${userData.phoneNumber}`
  });
  const [files, setFiles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const steps = [
    { title: 'Product Info', icon: <FiUploadCloud /> },
    { title: 'Pricing', icon: <FiDollarSign /> },
    { title: 'Location', icon: <FiMapPin /> },
  ];

  const validateStep = (step) => {
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
        if (!coordinates) {alert("location not available!"); errors.location = 'Location required';}
        if (files.length < 1){alert("at least 1 image is  required!"); errors.images = 'At least one image required';}
        break;
      default:
        break;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      setIsUploading(true);
      try {
        await UserRefurbishedProduct.uploadProductWithImages({ ...formData, coordinates }, files);
        setUploadStatus('success');
        setFormData({
          title: '',
          description: '',
          price: '',
          discountedPrice: '',
          keyword: '',
          phoneNumber: `91${userData.phoneNumber}`
        });
        setFiles([]);
        setCoordinates();
        setCurrentStep(1);
      } catch (error) {
        setUploadStatus('error');
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  const handleLocationSelect = (location, index) => {
    setCoordinates({ latitude: location.latitude, longitude: location.longitude });
    setShowLocationList(false);
    setSelectedAddressIndex(index);
  };

  return (
    <div className="multi-step-form">
      <ProgressBar steps={steps} currentStep={currentStep} />

      <div className="form-container">
        {currentStep === 1 && (
          <div className="step-card">
            <div className="floating-input">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder=" "
                className={formErrors.title ? 'error' : ''}
              />
              <label>Product Title</label>
              {formErrors.title && <span className="error-hint">{formErrors.title}</span>}
            </div>

            <div className="floating-input textarea">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder=" "
                rows="4"
                className={formErrors.description ? 'error' : ''}
              />
              <label>Detailed Description</label>
              {formErrors.description && <span className="error-hint">{formErrors.description}</span>}
            </div>

            <div className="floating-input">
              <input
                type="text"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                placeholder=" "
                className={formErrors.keyword ? 'error' : ''}
              />
              <label>Keyword</label>
              {formErrors.keyword && <span className="error-hint">{formErrors.keyword}</span>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-card">
            <div className="price-inputs">
              <div className="floating-input">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder=" "
                  className={formErrors.price ? 'error' : ''}
                />
                <label>Original Price (₹)</label>
                {formErrors.price && <span className="error-hint">{formErrors.price}</span>}
              </div>

              <div className="floating-input">
                <input
                  type="number"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                  placeholder=" "
                  className={formErrors.discountedPrice ? 'error' : ''}
                />
                <label>Selling Price (₹)</label>
                {formErrors.discountedPrice && (
                  <span className="error-hint">{formErrors.discountedPrice}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-card">
            <div className="dropzone" onClick={() => document.getElementById('fileInput').click()}>
              <FiUploadCloud className="upload-icon" />
              <p>Click to select</p>
              <small>(Max 3 images, 5MB each)</small>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  setFiles((prevFiles) => [...prevFiles, ...selectedFiles].slice(0, 3));
                }}
              />
            </div>

            <div className="preview-grid">
                {files.map((file, index) => (
                  <div key={index} className="image-preview">
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles(files.filter((_, i) => i !== index));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>




            <div className="upload-choose-location" onClick={() => setShowLocationList(!showLocationList)}>
              Choose Location
              <FaLocationDot color="rgb(12, 131, 31)" size={20} />
            </div>
            {showLocationList && (
              <div className="address-grid">
                {userData.address.length > 0 ? (
                  userData.address.map((addr, index) => (
                    <div
                      key={index}
                      className={`address-card ${selectedAddressIndex === index ? 'selected' : ''}`}
                      onClick={() => handleLocationSelect(addr, index)}
                    >
                      <div className="address-content">
                        <FaLocationDot color="rgb(12, 131, 31)" size={20} />
                      </div>
                      <div className="address-body">
                        <h1>Address</h1>
                        <p>{addr.address}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No addresses available. Please add one.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button className="outline-button" onClick={() => setCurrentStep((prev) => prev - 1)}>
              Back
            </button>
          )}

          {currentStep < 3 ? (
            <button className="primary-button" onClick={handleNext}>
              Continue
            </button>
          ) : (
            <button className="primary-button" onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? (
               <Oval
               height={30}
               width={30}
               color="green"
               secondaryColor="white"
               ariaLabel="loading"
           />
              ) : (
                'Publish Listing'
              )}
            </button>
          )}
        </div>
      </div>

      {uploadStatus && (
        <div className={`status-toast ${uploadStatus}`}>
          {uploadStatus === 'success' ? (
            <>
              <span>🎉 Listing published successfully!</span>
              <button onClick={() => setUploadStatus(null)}>Ok</button>
            </>
          ) : (
            <>
              <span>❌ Upload failed. Please try again.</span>
              <button onClick={() => setUploadStatus(null)}>Dismiss</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadBooksModulesForm;
