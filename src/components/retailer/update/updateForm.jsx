import React, { useState, useEffect, useCallback } from 'react';
import { Oval } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct, deleteProduct } from '../../../appWrite/uploadProduct/upload.js';

import {deleteProductS } from '../../../redux/features/retailer/product.jsx';
import Cookies from 'js-cookie';


const UploadBooksModulesForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: productId } = useParams();
    
    const products = useSelector((state) => state.retailerProducts.products);
    const product = products.find((p) => p.$id === productId);

    const [status, setStatus] = useState({ loading: true, error: null, success: null });
    const [operation, setOperation] = useState(null);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    
    const initialFormState = {
        title: '',
        description: '',
        price: '',
        discountedPrice: '',
        keywords: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [images, setImages] = useState(Array(3).fill(null));

    useEffect(() => {
        const loadProductData = async () => {
            try {
                if (!product) {
                    navigate('/retailer/products');
                    return;
                }

                const { title, description, price, discountedPrice, keywords, images: productImages } = product;
                
                setFormData({ title, description, price, discountedPrice, keywords });
                setImages([...productImages, ...Array(3).fill(null)].slice(0, 3));
            } catch (error) {
                setStatus(prev => ({ ...prev, error: 'Failed to load product data' }));
            } finally {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        };

        Cookies.get('BharatLinkerShopData') && loadProductData();
    }, [product, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = useCallback((index, file) => {
        if (!file) return;
        
        setImages(prev => {
            const newImages = [...prev];
            newImages[index] = file;
            return newImages;
        });
    }, []);

    const removeImage = useCallback((index) => {
        setImages(prev => {
            const newImages = [...prev];
            if (typeof newImages[index] === 'string') {
                setImagesToDelete(prevUrls => [...prevUrls, newImages[index]]);
            }
            newImages[index] = null;
            return newImages;
        });
    }, []);

    const validateForm = () => {
        const requiredFields = ['title', 'description', 'price', 'discountedPrice'];
        return requiredFields.every(field => formData[field]?.trim());
    };

    const handleProductUpdate = async () => {
        if (!validateForm()) {
            setStatus({ error: 'Please fill all required fields', success: null });
            return;
        }

        setStatus(prev => ({ ...prev, loading: true }));
        
        try {
            await updateProduct(productId, imagesToDelete, formData, images);
            dispatch({ type: 'products/updateProduct', payload: { id: productId, ...formData } });
            setStatus({ loading: false, success: 'Product updated successfully!', error: null });
            setTimeout(() => navigate('/retailer/products'), 2000);
        } catch (error) {
            setStatus({ loading: false, error: 'Update failed. Please try again.', success: null });
        }
    };

    const handleProductDelete = async () => {
        setStatus(prev => ({ ...prev, loading: true }));
        
        try {
            await deleteProduct(productId, imagesToDelete);
            dispatch(deleteProductS(productId));
            setStatus({ loading: false, success: 'Product deleted successfully!', error: null });
            setTimeout(() => navigate('/retailer/products'), 1500);
        } catch (error) {
            setStatus({ loading: false, error: 'Deletion failed. Please try again.', success: null });
        }
    };

    const ImageUploadField = ({ image, index }) => (
        <div className="image-upload-field">
            {image ? (
                <div className="image-preview">
                    <img 
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                    />
                    <button 
                        type="button" 
                        className="remove-image"
                        onClick={() => removeImage(index)}
                    >
                        ×
                    </button>
                </div>
            ) : (
                <label className="upload-label">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                    />
                    <div className="upload-placeholder">
                        <span>+</span>
                        <p>Upload Image</p>
                    </div>
                </label>
            )}
        </div>
    );

    if (status.loading) {
        return (
            <div className="loader-container">
                <Oval color="#00BFFF" height={80} width={80} />
            </div>
        );
    }

    return (
        <div className="retailer-update-product-container">

            <div className="retailer-update-product-section">
                <label className="retailer-update-product-label">
                    Product Title
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="retailer-update-product-input"
                        
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
                    />
                </label>
            </div>

                

            <div className="retailer-update-product-image-upload">
                <h3>Product Images</h3>
                <div className="retailer-update-product-image-grid">
                    {images.map((image, index) => (
                        <ImageUploadField key={index} image={image} index={index} />
                    ))}
                </div>
            </div>

            <div className="retailer-update-product-actions">
                <button
                    type="button"
                    className="retailer-update-product-delete-btn"
                    onClick={() => setOperation('delete')}
                    disabled={status.loading}
                >
                    {status.loading && operation === 'delete' ? (
                        <Oval color="#FFF" height={20} width={20} />
                    ) : 'Delete Product'}
                </button>

                <button
                    type="button"
                    className="retailer-update-product-update-btn"
                    onClick={() => setOperation('update')}
                    disabled={status.loading}
                >
                    {status.loading && operation === 'update' ? (
                        <Oval color="#FFF" height={20} width={20} />
                    ) : 'Update Product'}
                </button>
            </div>  
        </div>
    );
};
export default UploadBooksModulesForm;