import React, { useEffect, useState } from 'react';
import { FiUploadCloud, FiDollarSign, FiMapPin } from 'react-icons/fi';
import UserRefurbishedProduct from '../../../appWrite/UserRefurbishedProductService/userRefurbishedProduct.js';
import ProgressBar from '../progressBar.jsx';
import { Oval } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import '../upload/userProductUpload.css';
import {updateProduct} from '../../../redux/features/user/userAllRefurbishedProductsSlice.jsx'

const UpdateForm = ({ userData, product }) => {
  const dispatch=useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || '',
    discountedPrice: product?.discountedPrice || '',
    keyword: product?.keyword || '',
    phoneNumber: `91${userData?.phoneNumber || ''}`
  });
  useEffect(() => {
    setFormData({
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || '',
      discountedPrice: product?.discountedPrice || '',
      keyword: product?.keyword || '',
      phoneNumber: `91${userData?.phoneNumber || ''}`
    });
    setFiles(product.image);
  }, [product, userData]);

  const [files, setFiles] = useState([]);
  const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);
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
        if (files.length < 1) { alert("at least 1 image is  required!"); errors.images = 'At least one image required'; }
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
        const updatedFields = Object.keys(formData).reduce((acc, key) => {
          if (formData[key] !== product[key]) {
            acc[key] = formData[key];
          }
          return acc;
        }, {});
  
        const updatedData=await UserRefurbishedProduct.updateUserProduct(
          product.$id,
          toDeleteImagesUrls,
          { ...updatedFields },
          files
        );
        dispatch(updateProduct({productId:product.$id,updatedData}));
        setUploadStatus('success');
        setCurrentStep(1);
      } catch (error) {
        setUploadStatus('error');
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  



  const MAX_TITLE_LENGTH = 500;
  const MAX_DESCRIPTION_LENGTH = 2000;
  const MAX_KEYWORD_LENGTH = 50;
  const handleInputChange = (e, field, maxLength) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setFormData({ ...formData, [field]: value });
    }
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
                onChange={(e) => handleInputChange(e, 'title', MAX_TITLE_LENGTH)}
                placeholder=" "
                className={formErrors.title ? 'error' : ''}
              />
              <label>Product Title</label>
              {formErrors.title && <span className="error-hint">{formErrors.title}</span>}
              <span className='user-upload-count' style={{ color: formData.title.length === MAX_TITLE_LENGTH ? 'red' : 'inherit' }}>
                {formData.title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>

            <div className="floating-input textarea">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange(e, 'description', MAX_DESCRIPTION_LENGTH)}
                placeholder="use # for heading and * for points"
                rows="4"
                className={formErrors.description ? 'error' : ''}
              />
              <label>Detailed Description</label>
              {formErrors.description && <span className="error-hint">{formErrors.description}</span>}
              <span className='user-upload-count' style={{ color: formData.description.length === MAX_DESCRIPTION_LENGTH ? 'red' : 'inherit' }}>
                {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>

            <div className="floating-input">
              <input
                type="text"
                value={formData.keyword}
                onChange={(e) => handleInputChange(e, 'keyword', MAX_KEYWORD_LENGTH)}
                placeholder=" "
                className={formErrors.keyword ? 'error' : ''}
              />
              <label>Keyword separated by comma</label>
              {formErrors.keyword && <span className="error-hint">{formErrors.keyword}</span>}
              <span className='user-upload-count' style={{ color: formData.keyword.length === MAX_KEYWORD_LENGTH ? 'red' : 'inherit' }}>
                {formData.keyword.length}/{MAX_KEYWORD_LENGTH}
              </span>
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
              {files.map((file, index) => {
                const imageUrl = file instanceof File ? URL.createObjectURL(file) : file;
                return (
                  <div key={index} className="image-preview">
                    <img src={imageUrl} alt={`Preview ${index}`} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof file === "string" && file.startsWith("https://res.cloudinary.com")) {
                          setToDeleteImagesUrls((prev) => [...prev, file]);
                        }
                        setFiles(files.filter((_, i) => i !== index));
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
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
                'Update'
              )}
            </button>
          )}
        </div>
      </div>

      {uploadStatus && (
        <div className={`status-toast ${uploadStatus}`}>
          {uploadStatus === 'success' ? (
            <>
              <span>🎉 updated successfully!</span>
              <button onClick={() => setUploadStatus(null)}>Ok</button>
            </>
          ) : (
            <>
              <span>❌ Update failed. Please try again.</span>
              <button onClick={() => setUploadStatus(null)}>Dismiss</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateForm;
