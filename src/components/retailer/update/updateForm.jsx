import React, { useEffect, useState, useCallback } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { Oval } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import shopProduct from '../../../appWrite/shop/shopProduct.js';
import { updateProduct, deleteProduct } from '../../../redux/features/retailer/product.jsx';
import up1 from '../asset/up3.png';

const MAX_LENGTHS = { TITLE: 500, DESCRIPTION: 2000, KEYWORDS: 50 };
const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const UpdateForm = ({ shopData, product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', discountedPrice: '', keywords: '',
    shopId: '', isInStock: true, isActive: true,
  });
  const [files, setFiles] = useState([]);
  const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Prevent page refresh or close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isUploading || isDeleting) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your changes may not be saved.';
        return 'Are you sure you want to leave? Your changes may not be saved.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isUploading, isDeleting]);

  useEffect(() => { window.scrollTo(0, 0); }, [currentStep]);
  useEffect(() => {
    if (!product || !shopData) return;
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price ? Math.floor(product.price).toString() : '',
      discountedPrice: product.discountedPrice ? Math.floor(product.discountedPrice).toString() : '',
      keywords: product.keywords || '',
      shopId: shopData.shopId || '',
      isInStock: product.isInStock ?? true,
      isActive: product.isActive ?? true,
    });
    setFiles(product.images || []);
  }, [product, shopData]);

  const validateStep = useCallback((step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.title.trim()) errors.title = 'Product title is required';
      else if (formData.title.length > MAX_LENGTHS.TITLE) errors.title = `Title must be < ${MAX_LENGTHS.TITLE} chars`;
      if (!formData.description.trim()) errors.description = 'Description is required';
      else if (formData.description.length > MAX_LENGTHS.DESCRIPTION) errors.description = `Description must be < ${MAX_LENGTHS.DESCRIPTION} chars`;
      if (!formData.keywords.trim()) errors.keywords = 'Keywords are required';
      else if (formData.keywords.length > MAX_LENGTHS.KEYWORDS) errors.keywords = `Keywords must be < ${MAX_LENGTHS.KEYWORDS} chars`;
    } else if (step === 2) {
      if (!formData.price) errors.price = 'Original price is required';
      else if (!/^\d+$/.test(formData.price) || parseInt(formData.price) <= 0) errors.price = 'Price must be a positive whole number';
      if (!formData.discountedPrice) errors.discountedPrice = 'Selling price is required';
      else if (!/^\d+$/.test(formData.discountedPrice) || parseInt(formData.discountedPrice) <= 0) errors.discountedPrice = 'Selling price must be a positive whole number';
      else if (parseInt(formData.discountedPrice) >= parseInt(formData.price)) errors.discountedPrice = 'Selling price must be < original price';
    } else if (step === 3 && files.length === 0) {
      errors.images = 'At least one image is required';
      alert('At least 1 image is required!');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, files]);

  const handleInputChange = (e, field, maxLength) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (['price', 'discountedPrice'].includes(field)) {
      if (value === '' || /^\d+$/.test(value)) {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else if (['isInStock', 'isActive'].includes(field)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (!maxLength || value.length <= maxLength) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(file => {
      if (file.size > MAX_FILE_SIZE) { alert(`${file.name} exceeds 5MB limit`); return false; }
      return true;
    });
    setFiles(prev => [...prev, ...newFiles].slice(0, MAX_IMAGES));
  };

  const removeFile = (index) => {
    setFiles(prev => {
      const file = prev[index];
      if (typeof file === 'string' && file.startsWith('https://res.cloudinary.com')) {
        setToDeleteImagesUrls(prevUrls => [...prevUrls, file]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleNext = () => validateStep(currentStep) && setCurrentStep(prev => Math.min(prev + 1, 3));

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setIsUploading(true);
  
    try {
        const updatedFields = {};

        Object.entries(formData).forEach(([key, value]) => {
            const originalValue = product[key];
            let newValue = value;

            if (['price', 'discountedPrice'].includes(key)) {
                newValue = value === '' ? 0 : parseInt(value, 10); // Ensure integer conversion
            }

            if (newValue !== originalValue) {
                updatedFields[key] = newValue;
            }
        });

        // Add latitude and longitude to the updatedFields
        Object.assign(updatedFields, {
            latitude: shopData.shopLatitude,
            longitude: shopData.shopLongitude
        });
        // Update product in the shop
        const updatedData = await shopProduct.updateShopProduct(
            product.$id,
            toDeleteImagesUrls,
            updatedFields,
            files
        );
        dispatch(updateProduct({ productId: product.$id, updatedData }));

        setUploadStatus('success');
        setCurrentStep(1);
        setToDeleteImagesUrls([]);
    } catch (error) {
        setUploadStatus('error');
        console.error('Product update failed:', error);
    } finally {
        setIsUploading(false);
    }
};


  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setIsDeleting(true);
    try {
      await shopProduct.deleteShopProduct(product.$id, product.images);
      dispatch(deleteProduct({ productId: product.$id }));
      navigate(-1);
    } catch (error) {
      console.error('Product deletion failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStepContent = () => {
    return (
      <div className="shop-s1-step-card">
        {currentStep === 1 && (
          <>
            <div className="shop-upload-1-desc">Upload product details for an accurate and engaging presentation.</div>
            {['title', 'description', 'keywords'].map(field => (
              <fieldset key={field} className={`floating-input ${field === 'description' ? 'textarea' : ''}`}>
                <legend>{field.charAt(0).toUpperCase() + field.slice(1)}{field === 'keywords' && ' (comma-separated)'}</legend>
                {field === 'description' ? (
                  <textarea
                    value={formData[field]} onChange={(e) => handleInputChange(e, field, MAX_LENGTHS[field.toUpperCase()])}
                    rows="4" className={formErrors[field] ? 'error' : ''} disabled={isUploading}
                    placeholder="# for heading and * for points"
                  />
                ) : (
                  <input
                    type="text" value={formData[field]} onChange={(e) => handleInputChange(e, field, MAX_LENGTHS[field.toUpperCase()])}
                    className={formErrors[field] ? 'error' : ''} disabled={isUploading}
                    placeholder={`Enter product ${field}${field === 'keywords' ? ' e.g., electronics, phone, new' : ''}`}
                  />
                )}
                {formErrors[field] && <span className="error-hint">{formErrors[field]}</span>}
                <span className="user-upload-count" style={{ color: formData[field].length >= MAX_LENGTHS[field.toUpperCase()] ? 'red' : 'inherit' }}>
                  {formData[field].length}/{MAX_LENGTHS[field.toUpperCase()]}
                </span>
              </fieldset>
            ))}
          </>
        )}
        {currentStep === 2 && (
          <div className="price-inputs">
            {['price', 'discountedPrice', 'isInStock', 'isActive'].map(field => (
              <fieldset key={field} className="floating-input">
                <legend>{field === 'price' ? 'Original Price (₹)' : field === 'discountedPrice' ? 'Selling Price (₹)' : field === 'isInStock' ? 'Is In Stock' : 'Status'}</legend>
                {['isInStock', 'isActive'].includes(field) ? (
                  <div className="toggle-switch">
                    <input type="checkbox" checked={formData[field]} onChange={(e) => handleInputChange(e, field)} disabled={isUploading} />
                    <span>{formData[field] ? (field === 'isInStock' ? 'In Stock' : 'Active') : (field === 'isInStock' ? 'Out of Stock' : 'Deactivated')}</span>
                  </div>
                ) : (
                  <input
                    type="number" // Changed to number type for better UX
                    value={formData[field]} onChange={(e) => handleInputChange(e, field)} className={formErrors[field] ? 'error' : ''}
                    disabled={isUploading} placeholder={`Enter ${field === 'price' ? 'original' : 'selling'} price`} min="0" step="1"
                  />
                )}
                {formErrors[field] && <span className="error-hint">{formErrors[field]}</span>}
              </fieldset>
            ))}
          </div>
        )}
        {currentStep === 3 && (
          <>
            <div className="dropzone" onClick={() => !isUploading && files.length < MAX_IMAGES && document.getElementById('fileInput')?.click()}>
              <FiUploadCloud className="upload-icon" />
              <p>Click to select</p>
              <small>(Max {MAX_IMAGES} images, 5MB each)</small>
              <input id="fileInput" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileChange} disabled={isUploading || files.length >= MAX_IMAGES} />
            </div>
            {formErrors.images && <span className="error-hint">{formErrors.images}</span>}
            <div className="preview-grid">
              {files.map((file, index) => (
                <div key={index} className="image-preview">
                  <img src={file instanceof File ? URL.createObjectURL(file) : file} alt={`Preview ${index}`} onError={(e) => { e.target.src = up1; }} />
                  <button onClick={() => removeFile(index)} disabled={isUploading} aria-label="Remove image">×</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="multi-step-form">
      {isUploading && <div className="overlay" />}
      <div className="shop-upload-pic-header"><img src={up1} className="shop-upload-pic" alt="Shop header" /></div>
      <div className="shop-s1-form-container">
        {renderStepContent()}
        <div className="form-navigation">
          {currentStep > 1 ? (
            <button className="outline-button" onClick={() => setCurrentStep(prev => prev - 1)} disabled={isUploading}>BACK</button>
          ) : (
            <button className="order-detail-cancel" onClick={handleDelete} disabled={isDeleting || isUploading}>
              {isDeleting ? <Oval height={20} width={20} color="white" secondaryColor="#b41818" ariaLabel="loading" /> : 'DELETE'}
            </button>
          )}
          {currentStep < 3 ? (
            <button className="primary-button" onClick={handleNext} disabled={isUploading}>CONTINUE</button>
          ) : (
            <button className="primary-button" onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? <Oval height={30} width={30} color="white" secondaryColor="#2874f0" ariaLabel="loading" /> : 'UPDATE'}
            </button>
          )}
        </div>
      </div>
      {uploadStatus && (
        <div className="shop-popup-overlay">
          <div className="shop-popup-card">
            <div className="shop-popup-pointer"></div>
            <h2 className="shop-popup-title">{uploadStatus === 'success' ? 'Update Successful!' : 'Update Failed'}</h2>
            <div style={{ fontSize: '13px' }} className="shop-popup-text">
              {uploadStatus === 'success' ? 'Your product has been successfully updated.' : 'There was an error updating your product. Please try again.'}
            </div>
            <div className="shop-popup-buttons">
              <button className="shop-popup-btn-primary" onClick={() => setUploadStatus(null)}>OK</button>
              {uploadStatus === 'error' && <button className="shop-popup-btn-secondary" onClick={() => setUploadStatus(null)}>Close</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateForm;