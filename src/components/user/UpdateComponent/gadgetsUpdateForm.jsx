import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import userUploadGadgets from '../../../appWrite/UserUploadRefurbished/userUploadGadgets';
import Cookies from 'js-cookie';

function UpdateModuleForm() {
    const moduleId = useParams('id').id;

    const [categoryPopUp, setCategoryPopUp] = useState(false);
    const [detailsPopUp, setDetailsPopUp] = useState(false);
    const [brandPopUp, setBrandPopUp] = useState(false);
    const [languagePopUp, setLanguagePopUp] = useState(false);
    const [detailsKey, setDetailsKey] = useState('');
    const [detailsValue, setDetailsValue] = useState('');
    const [images, setImages] = useState([null, null, null]);
    const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);
    const [formData, setFormData] = useState({
        category: 'category',
        brand: 'brand',
        price: '',
        discountedPrice: '',
        description: '',
        title: '',
        details: {},
        keywords: '',
        buyingYear: '',
        model: '',
        productType: 'gadget',
    });
    const [userData, setUserData] = useState({});
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const products = useSelector((state) => state.userRefurbishedProducts.refurbishedProducts);

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUser');
        if (userSession) {
            setUserData(JSON.parse(userSession));
        }
    }, []);

    useEffect(() => {
        const fetchProductData = async () => {
            if (moduleId) {
                const selectedProduct = products.find((product) => product.$id === moduleId);
                if (selectedProduct) {
                    setFormData({
                        category: selectedProduct.category,
                        brand: selectedProduct.brand,
                        price: selectedProduct.price,
                        discountedPrice: selectedProduct.discountedPrice,
                        description: selectedProduct.description,
                        title: selectedProduct.title,
                        details: selectedProduct.details,
                        keywords: selectedProduct.keywords.join(','),
                        buyingYear: selectedProduct.buyingYear,
                        model:selectedProduct?.model
                    });
                    const updatedImages = [...selectedProduct.images];
                    for (let i = updatedImages.length; i < 3; i++) {
                        updatedImages.push(null);
                    }
                    setImages(updatedImages);
                    setImagesToDelete(updatedImages);
                }
            }
        };
        fetchProductData();
    }, [moduleId, products]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleDrop = (index, event) => {
        event.preventDefault();
        handleImageChange(index, event.dataTransfer.files);
    };

    const triggerFileInput = (index) => {
        document.getElementById(`image-update-${index}`).click();
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        const publicId = updatedImages[index];

        updatedImages[index] = null;
        if (typeof publicId === 'string') {
            setToDeleteImagesUrls((prevUrls) => [...prevUrls, publicId]);
        }
        setImages(updatedImages);
    };

    const handleImageChange = (index, files) => {
        if (files && files[0]) {
            const updatedImages = [...images];
            updatedImages[index] = files[0];
            setImages(updatedImages);
        }
    };

    const handleSubmit = async () => {

        try {
            await userUploadGadgets.updateUserRefurbishedGadget(moduleId,  toDeleteImagesUrls,formData, images);
        } catch (error) {
            console.error("Error uploading module with images:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await userUploadGadgets.deleteModule(moduleId, imagesToDelete);
            alert("Delete successful");
        } catch (error) {
            console.error("Error in deleting product:", error);
        }
    };

    return (
        <div className='upload-gadgets-user-form'>
            <div className={`upload-gadgets-user-form-group ${formData.category !== 'category' ? 'active' : ''}`} onClick={() => setCategoryPopUp(!categoryPopUp)}>
                <div className='upload-gadgets-user-form-group-inner'>
                    <label className='upload-gadgets-user-form-group-label'>
                        {formData.category}
                    </label>
                    *
                </div>
            </div>

            {categoryPopUp && (
                <div className='upload-gadgets-user-popup'>
                    <div className='upload-gadgets-user-popup-close' onClick={() => setCategoryPopUp(false)}>
                        <IoClose size={25} />
                    </div>
                    <div className='upload-gadgets-user-popup-options'>
                        <div className='upload-gadgets-user-popup-options-flex'>
                            {['Desktop', 'Ear Buds', 'Laptop', 'Mobile', 'Neck Band', 'PC', 'Smart TV', 'Smart watch', 'Speaker', 'Tablet', 'Wireless Speaker']
                                .map(item => (
                                    <div
                                        key={item}
                                        className='upload-gadgets-user-popup-option'
                                        onClick={() => handleCategorySelect(item)}
                                    >
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Brand & Model Selection */}
            <div style={{ display: "flex", maxWidth: "90vw", gap: "3px" }}>
                <div style={{ width: "45vw" }} className={`upload-gadgets-user-form-group ${formData.brand !== 'brand' ? 'active' : ''}`} onClick={() => setBrandPopUp(!brandPopUp)}>
                    <div className='upload-gadgets-user-form-group-inner'>
                        <label className='upload-gadgets-user-form-group-label'>
                            {formData.brand}
                        </label>
                        *
                    </div>
                </div>
                <div className={`upload-gadgets-user-form-group`} onClick={() => setLanguagePopUp(!languagePopUp)}>
                    <div className='upload-gadgets-user-form-group-inner'>
                        <input
                            type='text'
                            name='model'
                            value={formData.model}
                            onChange={handleInputChange}
                            placeholder='Model'
                            className='upload-gadgets-user-language-form-group-input'
                        />
                    </div>
                </div>
            </div>
            {brandPopUp && (
                <div className='refurbished-books-class-popup'>
                    <div className='refurbished-books-class-popup-close-popup' onClick={() => setBrandPopUp(false)}>
                        <IoClose size={25} />
                    </div>
                    <div className='refurbished-books-class-popup-options'>
                        <div className='refurbished-books-class-popup-options-flex'>
                            {['Oppo', 'Poco', 'Realme'].map(brandItem => (
                                <div
                                    key={brandItem}
                                    className='refurbished-books-class-popup-class-option'
                                    onClick={() => handleBrandSelect(brandItem)}
                                >
                                    {brandItem.charAt(0).toUpperCase() + brandItem.slice(1)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <hr style={{ width: "0vw", backgroundColor: "white", margin: "20px 0px 10px 0px" }} />

            {/* Title Input */}
            <div className='upload-gadgets-user-form-group'>
                <div className='upload-gadgets-user-form-group-inner'>
                    <input
                        type='text'
                        name='title'
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder='Title'
                        className='upload-gadgets-user-form-group-input'
                    />
                </div>
            </div>

            {/* Price Input */}
            <div className='upload-gadgets-user-form-group'>
                <div className='upload-gadgets-user-form-group-inner'>
                    <input
                        type='number'
                        name='price'
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder='Price'
                        className='upload-gadgets-user-form-group-input'
                    />
                </div>
            </div>

            {/* Discounted Price Input */}
            <div className='upload-gadgets-user-form-group'>
                <div className='upload-gadgets-user-form-group-inner'>
                    <input
                        type='number'
                        name='discountedPrice'
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder='Discounted Price'
                        className='upload-gadgets-user-form-group-input'
                    />
                </div>
            </div>

            {/* Description Input */}
            <div className='upload-gadgets-user-form-group'>
                <div className='upload-gadgets-user-form-group-inner'>
                    <textarea
                        name='description'
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder='Description'
                        className='upload-gadgets-user-form-group-input'
                    />
                </div>
            </div>

            {/* Keywords Input */}
            <div className='upload-gadgets-user-form-group'>
                <div className='upload-gadgets-user-form-group-inner'>
                    <input
                        type='text'
                        name='keywords'
                        value={formData.keywords}
                        onChange={handleInputChange}
                        placeholder='Keywords (comma separated)'
                        className='upload-gadgets-user-form-group-input'
                    />
                </div>
            </div>

            {/* Buying Year Input */}
            <div className='upload-gadgets-user-form-group'>
                <div className='upload-gadgets-user-form-group-inner'>
                    <input
                        type='number'
                        name='buyingYear'
                        value={formData.buyingYear}
                        onChange={handleInputChange}
                        placeholder='Buying Year'
                        className='upload-gadgets-user-form-group-input'
                    />
                </div>
            </div>

            {/* Image Uploads */}
            <div className='book-update-image-section'>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className='book-update-image-container'
                            onDrop={(event) => handleDrop(index, event)}
                            onDragOver={(event) => event.preventDefault()}

                        >
                            {image ? (
                                <>
                                    <img
                                        src={typeof (image) == 'string' ? image : URL.createObjectURL(image)}
                                        alt={`Uploaded ${index + 1}`}
                                        className='user-book-uploaded-image'
                                    />
                                    <div className='book-update-image-section-remove-image-div'>
                                        <IoClose
                                            size={25}
                                            className='remove-image-icon'
                                            onClick={() => removeImage(index)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className='user-update-image-placeholder' onClick={() => triggerFileInput(index)}><CiImageOn size={50} /></div>
                            )}
                            <input
                                type='file'
                                id={`image-update-${index}`}
                                style={{ display: 'none' }}
                                onChange={(event) => handleImageChange(index, event.target.files)}
                            />
                        </div>
                    ))}
                </div>


            {/* Submit and Delete Buttons */}
            <div className='upload-gadgets-user-form-buttons'>
                <button onClick={handleSubmit} className='upload-gadgets-user-form-button'>
                    Update Module
                </button>
                <button onClick={handleDelete} className='upload-gadgets-user-form-button delete-button'>
                    Delete Module
                </button>
            </div>
        </div>
    );
}

export default UpdateModuleForm;

