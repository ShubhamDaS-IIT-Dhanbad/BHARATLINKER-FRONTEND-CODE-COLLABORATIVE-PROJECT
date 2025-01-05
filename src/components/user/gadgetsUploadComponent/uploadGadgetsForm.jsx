import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import { Oval } from 'react-loader-spinner';
import userUploadGadgets from '../../../appWrite/UserUploadRefurbished/userUploadGadgets.js';

import { MdOutlineCategory } from "react-icons/md";
import { TbBrandAirtable, TbWorldUpload } from "react-icons/tb";

import './gadgetsUpload.css';

const OPTIONS = {
    categories: ['Desktop', 'Ear Buds', 'Laptop', 'Mobile', 'Neck Band'],
    brands: ['Oppo', 'Poco', 'Realme', 'Desktop', 'Ear Buds', 'Laptop', 'Mobile', 'Neck Band']
};

function UploadGadgetsForm({ userData }) {
    const [isUploading, setIsUploading] = useState(false);
    const [allFieldEntered, setAllFieldEntered] = useState(true);
    const [uploadStatus, setUploadStatus] = useState({ success: false, fail: false });
    const [formData, setFormData] = useState({
        category: 'category',
        brand: 'brand',
        price: '',
        discountedPrice: '',
        description: '',
        title: '',
        keywords: '',
        phn: `+91${userData?.phn || ''}`,
        pinCodes: '740001,740002,740003,742136',
        productType: 'gadget'
    });
    const [images, setImages] = useState([null, null, null]);
    const [popUps, setPopUps] = useState({ category: false, brand: false });

    const togglePopUp = (type) => {
        setPopUps((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionSelect = (type, value) => {
        setFormData((prev) => ({ ...prev, [type]: value }));
        togglePopUp(type);
    };

    const handleImageChange = (index, file) => {
        const updatedImages = [...images];
        updatedImages[index] = file;
        setImages(updatedImages);
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages[index] = null;
        setImages(updatedImages);
    };

    const handleSubmit = async () => {
        const { category, brand, title, price, discountedPrice } = formData;
        if (!userData.phn || !category || category === 'category' || !brand || brand === 'brand' || !title || !price || !discountedPrice) {
            setAllFieldEntered(false);
            console.log("Please fill all required fields.");
            return;
        }
        const finalFormData = {
            ...formData,
            phn: `+91${userData?.phn || ''}`
        };
        setIsUploading(true);
        try {

            await userUploadGadgets.uploadGadgetWithImages(finalFormData, images);
            setUploadStatus({ success: true, fail: false });
            setFormData({
                category: 'category',
                brand: 'brand',
                price: '',
                discountedPrice: '',
                description: '',
                title: '',
                keywords: '',
                buyingYear: '',
                phn: `+91${userData?.phn || ''}`,
                pinCodes: '740001,740002,740003,742136',
                productType: 'gadget'
            });
            setImages([null, null, null]);
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus({ success: false, fail: true });
        } finally {
            setIsUploading(false);
        }
    };

    const renderPopUp = (type, options) => {
        return (
            popUps[type] && (
                <div className='user-refurbished-gadgets-popup'>
                    <IoClose size={25} className='user-refurbished-gadgets-popup-close' onClick={() => togglePopUp(type)} />
                    <div style={{color:"white"}}>
                        {`${type.toUpperCase()}`}
                    </div>
                    <div className='user-refurbished-gadgets-popup-options'>
                        {options.map((option) => (
                            <div
                                key={option}
                                className={`user-refurbished-gadgets-popup-option ${formData[type] === option ? 'user-refurbished-gadgets-selected-option' : ''}`}
                                onClick={() => handleOptionSelect(type, option)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )
        );
    };
    

    const Popup = ({ message, onClose, isSuccess }) => (
        <div className='user-refurbished-gadgets-upload-pop-up'>
            <div className='user-refurbished-gadgets-upload-pop-up-inner'>
                <div className='user-refurbished-gadgets-upload-pop-up-message'>{message}</div>
                <div
                    className={isSuccess ? 'user-refurbished-gadgets-upload-successful-popup' : 'user-refurbished-gadgets-upload-fail-popup'}
                    onClick={onClose}
                >
                    OK
                </div>
            </div>
        </div>

    );

    return (
        <>
            <div className='user-refurbished-gadgets-upload-form'>
                <div className='user-refurbished-product-category-brand-div'>
                    <div className='user-refurbished-product-category-brand-div-category' onClick={() => togglePopUp('category')}>
                        <MdOutlineCategory size={30} />
                    </div>
                    <div className='user-refurbished-product-category-brand-div-brand' onClick={() => togglePopUp('brand')}>
                        <TbBrandAirtable size={30} />
                    </div>
                </div>
                {renderPopUp('category', OPTIONS.categories)}
                {renderPopUp('brand', OPTIONS.brands)}

                <div className='user-refurbished-product-title-description-div'>
                    <textarea
                        name='title'
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder='Enter a relevant title'
                        className='user-refurbished-product-title-input'
                        style={{ maxWidth: "90vw", minHeight: "15vh" }}
                    />
                    <textarea
                        name='description'
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder='Enter a relevant description'
                        className='user-refurbished-product-description-input'
                        style={{ maxWidth: "90vw", minHeight: "30vh" }}
                    />
                </div>

                <div className='user-refurbished-product-price-discounted-div'>
                    <input
                        type='number'
                        name='price'
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder='Enter original price'
                        className='user-refurbished-gadgets-upload-price-input'
                    />
                    <input
                        type='number'
                        name='discountedPrice'
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder='Enter discounted price'
                        className='user-refurbished-gadgets-upload-discounted-input'
                    />
                </div>

                <textarea
                    name='keywords'
                    value={formData.keywords}
                    onChange={handleInputChange}
                    placeholder='Keywords (separated by commas [,])'
                    className='user-refurbished-gadgets-upload-keywords-input'
                    style={{ maxWidth: "90vw", minHeight: "20vh" }}
                />

                <div className='user-refurbished-gadgets-upload-image-section'>
                    {images.map((image, index) => (
                        <div key={index}>
                            {image ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    className='user-refurbished-gadgets-uploaded-image'
                                    alt={`Uploaded ${index + 1}`}
                                    onClick={() => removeImage(index)}
                                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                />
                            ) : (
                                <div
                                    className='user-refurbished-gadgets-uploaded-image'
                                    onClick={() => document.getElementById(`image-upload-${index}`).click()}
                                >
                                    <CiImageOn size={50} />
                                </div>
                            )}
                            <input
                                type='file'
                                id={`image-upload-${index}`}
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageChange(index, e.target.files[0])}
                            />
                        </div>
                    ))}
                </div>

                <div
                    className={`user-refurbished-gadgets-submit ${isUploading ? 'disabled' : ''}`}
                    onClick={isUploading ? null : handleSubmit}
                >
                    <TbWorldUpload size={35} />
                </div>
            </div>

            {!allFieldEntered && (
                <Popup message="All fields are required!" onClose={() => setAllFieldEntered(true)} isSuccess={false} />
            )}
            {isUploading && (
                <div className='user-refurbished-gadgets-uploading-loader'>
                    <Oval height={40} width={40} color="#fff" />
                </div>
            )}
            {uploadStatus.success && (
                <Popup message="Gadget uploaded successfully!" onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess />
            )}
            {uploadStatus.fail && (
                <Popup message="Failed to upload gadget. Please try again!" onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess={false} />
            )}
        </>
    );
}

export default UploadGadgetsForm;








