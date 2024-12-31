import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import userUploadGadgets from '../../../appWrite/UserUploadRefurbished/userUploadGadgets.js';

function UploadBooksForm({ userData }) {
    const [categoryPopUp, setCategoryPopUp] = useState(false);
    const [detailsPopUp, setDetailsPopUp] = useState(false);
    const [brandPopUp, setBrandPopUp] = useState(false);
    const [languagePopUp, setLanguagePopUp] = useState(false);

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
        phn: `+91${userData?.phn || ''}`,
        pinCodes: '740001,740002,740003,742136',
        productType:'gadget'
    });

    const [images, setImages] = useState([null, null, null]);
    const [detailsKey, setDetailsKey] = useState('');
    const [detailsValue, setDetailsValue] = useState('');

    // Image handling
    const handleDrop = (index, event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleImageChange(index, files);
    };

    const triggerFileInput = (index) => {
        document.getElementById(`image-upload-${index}`).click();
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages[index] = null;
        setImages(updatedImages);
    };

    const handleImageChange = (index, files) => {
        if (files && files[0]) {
            const updatedImages = [...images];
            updatedImages[index] = files[0];
            setImages(updatedImages);
        }
    };

    // Form data handling
    const handleCategorySelect = (selectedClass) => {
        setFormData(prev => ({ ...prev, category: selectedClass }));
        setCategoryPopUp(false);
    };

    const handleBrandSelect = (selectedBrand) => {
        setFormData(prev => ({ ...prev, brand: selectedBrand }));
        setBrandPopUp(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Details entry handling
    const handleDetailsKeyChange = (e) => {
        setDetailsKey(e.target.value);
    };

    const handleDetailsValueChange = (e) => {
        setDetailsValue(e.target.value);
    };

    const addDetailsEntry = () => {
        if (detailsKey && detailsValue) {
            setFormData(prev => ({
                ...prev,
                details: { ...prev.details, [detailsKey]: detailsValue },
            }));
            setDetailsKey('');
            setDetailsValue('');
        }
    };

    // Submit handling
    const handleSubmit = () => {
        const { category, language, brand, title, price, discountedPrice } = formData;

        // Validate required fields
        if (!category || category === 'category' ||
            !brand || brand === 'brand' ||
            !title || !price || !discountedPrice) {console.log("Please fill all required fields.");return;}

        // Prepare formData for upload
        const finalFormData = {
            ...formData,
            phn: `+91${userData.phn || ''}`,
            details: JSON.stringify(formData.details),
        };

        try {console.log(finalFormData)
            userUploadGadgets.uploadGadgetWithImages(finalFormData, images);
            console.log("Upload successful");
        } catch (error) {
            console.log("Upload error:", error);
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
                        placeholder='Enter Title'
                        className='upload-gadgets-user-title-input'
                    />
                    *
                </div>
            </div>

            {/* Description Input */}
            <div className='upload-gadgets-user-form-group'>
                <div className='upload-gadgets-user-form-group-inner'>
                    <input
                        type='text'
                        name='description'
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder='Enter Description'
                        className='upload-gadgets-user-description-input'
                    />
                </div>
            </div>

            {/* Price & Discounted Price Inputs */}
            <div style={{ display: "flex", maxWidth: "90vw", gap: "3px" }}>
                <div style={{ width: "45vw" }} className='upload-gadgets-user-form-group'>
                    <div className='upload-gadgets-user-form-group-inner'>
                        <input
                            type='text'
                            name='price'
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder='Enter Price'
                            className='upload-gadgets-user-price-input'
                        />
                    </div>
                </div>

                <div style={{ width: "44vw" }} className='upload-gadgets-user-form-group'>
                    <div className='upload-gadgets-user-form-group-inner'>
                        <input
                            type='text'
                            name='discountedPrice'
                            value={formData.discountedPrice}
                            onChange={handleInputChange}
                            placeholder='Enter Discounted Price'
                            className='upload-gadgets-user-discounted-price-input'
                        />
                    </div>
                </div>
            </div>

            <hr style={{ width: "0vw", backgroundColor: "white", margin: "20px 0px 10px 0px" }} />
            <p>Additional Info</p>

            {/* Keywords Input */}
            <div className='upload-gadgets-user-form-group'>
                <div className='upload-gadgets-user-form-group-inner'>
                    <input
                        type='text'
                        name='keywords'
                        value={formData.keywords}
                        onChange={handleInputChange}
                        placeholder='Keywords (separated by comma)'
                        className='upload-gadgets-user-keywords-input'
                    />
                </div>
            </div>

            {/* Details Input */}
            <div className='upload-gadgets-user-form-group' onClick={() => setDetailsPopUp(!detailsPopUp)}>
                <div className='upload-gadgets-user-form-group-inner'>
                    <label className='upload-gadgets-user-form-group-label'>
                        Details
                    </label>
                </div>
            </div>

            {detailsPopUp && (
                <div className='upload-gadgets-user-popup'>
                    <div className='upload-gadgets-user-popup-close' onClick={() => setDetailsPopUp(false)}>
                        <IoClose size={25} />
                    </div>
                    <div className='upload-gadgets-user-popup-options'>
                        <input
                            type='text'
                            value={detailsKey}
                            onChange={handleDetailsKeyChange}
                            placeholder='Enter Key'
                            className='upload-gadgets-user-details-key-input'
                        />
                        <input
                            type='text'
                            value={detailsValue}
                            onChange={handleDetailsValueChange}
                            placeholder='Enter Value'
                            className='upload-gadgets-user-details-value-input'
                        />
                        <button onClick={addDetailsEntry} className='upload-gadgets-user-details-add-button'>
                            Add Detail
                        </button>
                        <pre className='json-display'>
                            {JSON.stringify(formData.details, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            {/* Image Upload */}
            <div className='upload-gadgets-user-image-section'>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className='upload-gadgets-user-image-container'
                        onDrop={(event) => handleDrop(index, event)}
                        onDragOver={(event) => event.preventDefault()}
                    >
                        {image ? (
                            <>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Uploaded ${index + 1}`}
                                    className='upload-gadgets-user-uploaded-image'
                                />
                                <IoClose
                                    size={20}
                                    className='upload-gadgets-user-remove-image-icon'
                                    onClick={() => removeImage(index)}
                                />
                            </>
                        ) : (
                            <div className='upload-gadgets-user-image-placeholder' onClick={() => triggerFileInput(index)}>
                                <CiImageOn size={50} />
                            </div>
                        )}
                        <input
                            type='file'
                            id={`image-upload-${index}`}
                            style={{ display: 'none' }}
                            onChange={(event) => handleImageChange(index, event.target.files)}
                        />
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <div className='upload-gadgets-user-submit-button' onClick={handleSubmit}>
                Submit
            </div>

        </div>

    );
}

export default UploadBooksForm;

