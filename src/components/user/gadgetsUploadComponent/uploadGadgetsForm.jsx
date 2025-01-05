import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import { Oval } from 'react-loader-spinner';
import userUploadGadgets from '../../../appWrite/UserUploadRefurbished/userUploadGadgets.js';

import { MdOutlineCategory } from "react-icons/md";
import { TbBrandAirtable } from "react-icons/tb";
import { TbWorldUpload } from "react-icons/tb";

import './gadgetsUpload.css'
const OPTIONS = {
    categories: [
        'Desktop', 'Ear Buds', 'Laptop', 'Mobile', 'Neck Band'
    ],
    brands: ['Oppo', 'Poco', 'Realme', 'Desktop', 'Ear Buds', 'Laptop', 'Mobile', 'Neck Band']
};

function UploadGadgetsForm({ userData }) {
    const [isUploading, setIsUploading] = useState(false);

    const [allFieldEntered, setAllFieldEntered] = useState(true);
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
        productType: 'gadget'
    });

    const [images, setImages] = useState([null, null, null]);
    const [popUps, setPopUps] = useState({
        category: false,
        brand: false
    });

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
        if (!category || category === 'category' || !brand || brand === 'brand' || !title || !price || !discountedPrice) {
            setAllFieldEntered(false);
            console.log("Please fill all required fields.");
            return;
        }

        const finalFormData = {
            ...formData,
            phn: `+91${userData.phn || ''}`,
            details: JSON.stringify(formData.details)
        };

        setIsUploading(true);
        try {
            await userUploadGadgets.uploadGadgetWithImages(finalFormData, images);
            console.log("Upload successful");
        } catch (error) {
            console.log("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const renderPopUp = (type, options) => (
        popUps[type] && (
            <div className='user-refurbished-gadgets-popup'>
                <IoClose size={25} className='user-refurbished-gadgets-popup-close' onClick={() => togglePopUp(type)} />
                <div className='user-refurbished-gadgets-popup-options'>
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`user-refurbished-gadgets-popup-option ${formData[type] === option ? 'user-refurbished-gadgets-selected-option' : ''
                                }`}
                            onClick={() => handleOptionSelect(type, option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        )
    );


    return (
        <>
            <div className='user-refurbished-gadgets-upload-form'>

                <div className='user-refurbished-product-category-brand-div'>
                    <div className='user-refurbished-product-category-brand-div-category' onClick={() => togglePopUp('category')}>
                        < MdOutlineCategory size={30} />
                    </div>

                    <div className='user-refurbished-product-category-brand-div-brand' onClick={() => togglePopUp('brand')}>
                        <TbBrandAirtable size={30} />
                    </div>
                </div>

                {renderPopUp('category', OPTIONS.categories)}
                {renderPopUp('brand', OPTIONS.brands)}

                <div className='user-refurbished-product-title-description-div'>
                    <textarea
                        type='text'
                        name='title'
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder='title'
                        style={{ maxWidth: "90vw", minHeight: "15vh" }}
                        className='user-refurbished-product-title-input'
                    />
                    <textarea
                        type='text'
                        name='description'
                        value={formData.description}
                        onChange={handleInputChange}
                        style={{ maxWidth: "90vw", minHeight: "30vh" }}
                        placeholder='description'
                        className='user-refurbished-product-description-input'
                    />
                </div >

                <div className='user-refurbished-product-price-discounted-div'>
                    <input
                        type='number'
                        name='price'
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder='Enter Original Price'
                        className='user-refurbished-gadgets-upload-price-input'
                    />
                    <input
                        type='number'
                        name='discountedPrice'
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder='discounted price'
                        className='user-refurbished-gadgets-upload-discounted-input'
                    />
                </div>

                <textarea
                    type='text'
                    name='keywords'
                    value={formData.keywords}
                    onChange={handleInputChange}

                    style={{ maxWidth: "90vw", minHeight: "20vh" }}
                    placeholder='Keywords (separated by commas)'
                    className='user-refurbished-gadgets-upload-keywords-input'
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

                <TbWorldUpload className='user-refurbished-gadgets-submit' size={35} onClick={handleSubmit} disabled={isUploading}/>
            </div >

            {!allFieldEntered && (
                <div className='user-refurbished-gadgets-all-fields-required-div'>
                    <div className='user-refurbished-gadgets-all-fields-required-div-inner'>
                        All the * marked fields are Required
                        <div
                            className='user-refurbished-gadgets-all-fields-required-div-inner-ok'
                            onClick={() => setAllFieldEntered(true)}
                        >
                            OK
                        </div>
                    </div>
                </div>
            )
            }
            {isUploading ? <div className='user-refurbished-gadgets-uploading-loader'><Oval height={20} width={20} color="#fff" /></div> : ""}
        </>

    );
}

export default UploadGadgetsForm;
