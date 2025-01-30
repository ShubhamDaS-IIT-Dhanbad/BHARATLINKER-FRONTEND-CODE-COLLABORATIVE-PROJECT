import React, { useState, useEffect, useCallback } from 'react';
import { Oval } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct, deleteProduct } from '../../../appWrite/uploadProduct/upload.js';
import { CiImageOn } from 'react-icons/ci';
import { deleteProductSlice, updateProductSlice } from '../../../redux/features/retailer/product.jsx';
import Cookies from 'js-cookie';

const UploadBooksModulesForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: productId } = useParams();

    const products = useSelector((state) => state.retailerProducts.products);
    const product = products.find((p) => p.$id === productId);

    const [status, setStatus] = useState({ loading: true, error: null, success: null });
    const [isUpdating, setIsUpdating] = useState(false);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newImagesFiles, setNewImagesFiles] = useState(Array(3).fill(null));

    const initialFormState = {
        title: '',
        description: '',
        price: '',
        discountedPrice: '',
        keywords: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [images, setImages] = useState();

    useEffect(() => {
        const loadProductData = async () => {
            try {
                if (!product) {
                    navigate('/retailer/products');
                    return;
                }

                const { title, description, price, discountedPrice, keywords, images: productImages } = product;
                setFormData({ 
                    title, 
                    description, 
                    price, 
                    discountedPrice, 
                    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords 
                });
                setImages([...productImages, ...Array(3).fill(null)].slice(0, 3));
            } catch (error) {
                setStatus(prev => ({ ...prev, error: 'Failed to load product data' }));
            } finally {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        };

        if (Cookies.get('BharatLinkerShopData')) {
            loadProductData();
        }
    }, [product, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = useCallback((index, file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = reader.result;
                return newImages;
            });
        };
        reader.readAsDataURL(file);

        setNewImagesFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = file;
            return newFiles;
        });
    }, []);

    const handleDrop = useCallback((index, e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleImageChange(index, file);
    }, [handleImageChange]);

    const removeImage = useCallback((index) => {
        setImages(prev => {
            const newImages = [...prev];
            const currentImage = newImages[index];
            
            if (typeof currentImage === 'string' && !currentImage.startsWith('data:')) {
                setImagesToDelete(prevUrls => [...prevUrls, currentImage]);
            }
            
            newImages[index] = null;
            return newImages;
        });

        setNewImagesFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = null;
            return newFiles;
        });
    }, []);

    const validateForm = () => {
        const requiredFields = ['title', 'description', 'price', 'discountedPrice'];
        const isValid = requiredFields.every(field => formData[field]?.trim());
        const hasAtLeastOneImage = images.some(img => img !== null);
        
        if (!isValid) {
            setStatus(prev => ({ ...prev, error: 'Please fill all required fields' }));
            return false;
        }
        
        if (!hasAtLeastOneImage) {
            setStatus(prev => ({ ...prev, error: 'At least one image is required' }));
            return false;
        }
        
        return true;
    };

    const handleProductUpdate = async () => {
        const confirmUpdate = window.confirm('Are you sure you want to update this product?');
        if (!confirmUpdate) return;

        setIsUpdating(true);
        try { 
            const validImages = images.filter(img => 
                typeof img === 'string' && img.startsWith('https://res.cloudinary.com/')
            );
            const filesToUpload = newImagesFiles.filter(file => file !== null);
            const updatedData = await updateProduct(
                productId,
                imagesToDelete,
                { ...formData,images: validImages },
                filesToUpload
            );

            dispatch(updateProductSlice({ productId, updatedData }));
            setStatus({ loading: false, error: null, success: 'Product updated successfully!' });
            setTimeout(() => setStatus(prev => ({ ...prev, success: null })), 2000);
        } catch (error) {
            setStatus({ loading: false, error: 'Update failed. Please try again.', success: null });
        } finally {
            setIsUpdating(false);
            setImagesToDelete([]);
            setNewImagesFiles(Array(3).fill(null));
        }
    };

    const handleProductDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to permanently delete this product?');
        if (!confirmDelete) return;

        setStatus(prev => ({ ...prev, loading: true }));
        try {
            await deleteProduct(productId, imagesToDelete);
            dispatch(deleteProductSlice(productId));
            setStatus({ loading: false, success: 'Product deleted successfully!', error: null });
            setTimeout(() => navigate('/retailer/products'), 1500);
        } catch (error) {
            setStatus({ loading: false, error: 'Deletion failed. Please try again.', success: null });
        }
    };

    if (status.loading) {
        return (
            <div className="loader-container">
                <Oval color="#00BFFF" height={80} width={80} />
            </div>
        );
    }

    return (
        <div className="retailer-update-product-container">
            {status.error && (
                <div className="retailer-update-product-error">
                    {status.error}
                </div>
            )}
            
            {status.success && (
                <div className="retailer-update-product-success">
                    {status.success}
                </div>
            )}

            <div className="retailer-update-product-section">
                <label className="retailer-update-product-label">
                    Product Title
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="retailer-update-product-input"
                        required
                    />
                </label>

                <label className="retailer-update-product-label">
                    Description
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="retailer-update-product-textarea"
                        rows="6"
                        required
                    />
                </label>

                <label className="retailer-update-product-label">
                    Original Price (₹)
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="retailer-update-product-input"
                        required
                    />
                </label>

                <label className="retailer-update-product-label">
                    Discounted Price (₹)
                    <input
                        type="number"
                        name="discountedPrice"
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        className="retailer-update-product-input"
                        required
                    />
                </label>

                <label className="retailer-update-product-label">
                    Keywords (comma separated)
                    <input
                        type="text"
                        name="keywords"
                        value={formData.keywords}
                        onChange={handleInputChange}
                        className="retailer-update-product-input"
                        placeholder="e.g., fiction, bestseller, romance"
                    />
                </label>
            </div>

            <div className="retailer-upload-product-image-section">
                <label className="retailer-upload-product-input-label">
                    Product Images (minimum 1 required)
                </label>
                <div className="retailer-upload-product-image-grid">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="retailer-upload-product-image-upload-card"
                            onDrop={(e) => handleDrop(index, e)}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {image ? (
                                <div className="retailer-upload-product-image-preview-wrapper">
                                    <img
                                        src={image}
                                        alt={`Preview ${index + 1}`}
                                        className="retailer-upload-product-preview-image"
                                    />
                                    <button
                                        className="retailer-upload-product-remove-image-button"
                                        onClick={() => removeImage(index)}
                                        aria-label="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <label className="retailer-upload-product-image-upload-box">
                                    <CiImageOn className="retailer-upload-product-upload-icon" />
                                    <input
                                        type="file"
                                        hidden
                                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                                        accept="image/*"
                                    />
                                </label>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="retailer-update-product-actions">
                <button
                    type="button"
                    className={`retailer-update-product-delete-button ${isUpdating ? 'disabled' : ''}`}
                    onClick={handleProductDelete}
                    disabled={status.loading || isUpdating}
                >
                    {status.loading ? (
                        <Oval color="#FFF" height={20} width={20} />
                    ) : (
                        'Delete Product'
                    )}
                </button>

                <button
                    className={`retailer-upload-product-submit-button ${isUpdating ? 'uploading' : ''}`}
                    onClick={handleProductUpdate}
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <Oval color="#fff" height={24} width={24} />
                    ) : (
                        'Update Product'
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadBooksModulesForm;