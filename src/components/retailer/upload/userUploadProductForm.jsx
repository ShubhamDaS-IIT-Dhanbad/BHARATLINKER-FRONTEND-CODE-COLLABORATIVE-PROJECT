import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandAirtable, TbWorldUpload } from "react-icons/tb";

import { Oval } from 'react-loader-spinner';
import {uploadProductWithImages} from '../../../appWrite/uploadProduct/upload.js';
import Cookies from 'js-cookie';

const UploadBooksModulesForm = () => {
    const [shopData, setShopData] = useState();
    const [popUpState, setPopUpState] = useState({
        classPopUp: false,
        subjectPopUp: false,
        languagePopUp: false,
        categoryPopUp: false,
        brandPopUp: false,
    });
    const [coordinates, setCoordinates] = useState({ lat: null, long: null });
    const [fetching, setFetching] = useState(false);


    const [uploadStatus, setUploadStatus] = useState({
        success: false,
        fail: false,
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        discountedPrice: '',
        keywords: '',
        brand: '',
        category: '',
        isInstock: true,
        shop: '',
    });

    const [images, setImages] = useState([null, null, null]);
    const [isUploading, setIsUploading] = useState(false);
    const [allFieldEntered, setAllFieldEntered] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDrop = (index, event) => {
        event.preventDefault();
        handleImageChange(index, event.dataTransfer.files);
    };


    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerShopData');
        if (userSession) {
            const parsedUserData = JSON.parse(userSession);
            setShopData(parsedUserData);
            if (parsedUserData.lat && parsedUserData.long) {
                setCoordinates({ lat: parsedUserData.lat, long: parsedUserData.long });
            }
        }
    }, [])



    const handleImageChange = (index, files) => {
        if (files && files[0]) {
            setImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[index] = files[0];
                return updatedImages;
            });
        }
    };







    const handleCategorySelect = (selectedCategory) => {
        setFormData(prevFormData => ({ ...prevFormData, category: selectedCategory }));
        setPopUpState(prevState => ({ ...prevState, categoryPopUp: false }));
    };
    const handleBrandSelect = (selectedBrand) => {
        setFormData(prevFormData => ({ ...prevFormData, brand: selectedBrand }));
        setPopUpState(prevState => ({ ...prevState, brandPopUp: false }));
    };








    const handleSubmit = async () => {
        const { title, description, price, discountedPrice, category, brand } = formData;
        const lat = formData.lat || coordinates.lat;
        const long = formData.long || coordinates.long;
    
        // Check if lat and long are valid
        if (!lat || !long) {
            alert('Your Address Location is not set or error in retrieving location -> go to PROFILE and set LOCATION'); // Popup message
            return;
        }
    
        // Prepare the final form data
        const finalFormData = {
            ...formData,
            shop: shopData.$id,
            lat,
            long,
        };
    
        // Start uploading
        setIsUploading(true);
        try {
            await uploadProductWithImages(finalFormData, images);
            setUploadStatus({ success: true, fail: false });
            resetForm(); // Assuming this resets the form correctly
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadStatus({ success: false, fail: true });
        } finally {
            setIsUploading(false);
        }
    };
    



    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            discountedPrice: '',
            keywords: '',
            brand: '',
            category: '',
            isInstock: true,
            shop:shopData?.$id,
        });
        setImages([null, null, null]);
    };

    const renderPopUp = (popUpKey, options, handleSelect) => {
        const kpopup = popUpKey.slice(0, -5);
        return (
            popUpState[popUpKey] && (
                <div className="refurbished-book-module-class-popup">
                    <div
                        className="refurbished-book-module-class-popup-close-popup"
                        onClick={() => setPopUpState(prevState => ({ ...prevState, [popUpKey]: false }))}
                    >
                        <IoClose size={25} />
                    </div>
                    <div style={{ color: "white" }}>
                        {`${kpopup.toUpperCase()}`}
                    </div>
                    <div className="refurbished-book-module-class-popup-options">
                        {options.map((item) => (
                            <div
                                key={item}
                                className={`${formData[kpopup] === item ? 'selected-green' : 'refurbished-book-module-class-popup-class-option'}`}
                                onClick={() => handleSelect(item)}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </div>
                        ))}
                    </div>
                </div>
            )
        );
    };



    const PopupSuccess = ({ message, onClose }) => (
        <div className="user-refurbished-book-module-success-popup">
            <div className="user-refurbished-book-module-success-popup-inner">
                <div className="user-refurbished-book-module-success-popup-message">
                    {message}
                </div>
                <div className="user-refurbished-book-module-success-popup-ok" onClick={onClose}>
                    Ok
                </div>
            </div>
        </div>
    );

    const PopupFail = ({ message, onClose }) => (
        <div className="user-refurbished-book-module-fail-popup">
            <div className="user-refurbished-book-module-fail-popup-inner">
                <div className="user-refurbished-book-module-fail-popup-message">
                    {message}
                </div>
                <div className="user-refurbished-book-module-fail-popup-ok" onClick={onClose}>
                    Ok
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="retailer-upload-product-form">

                <>
                    <div className='user-refurbished-product-category-brand-div' style={{ marginTop: "50px", display: 'flex', gap: '10px' }}>
                        <div
                            className={`retailer-upload-product-form-upload-category ${formData.category ? 'active' : ''}`}
                            onClick={() => setPopUpState(prevState => ({ ...prevState, categoryPopUp: !prevState.categoryPopUp }))}>
                            <MdOutlineCategory size={30} />
                        </div>
                        <div className={`retailer-upload-product-form-upload-brand ${formData.brand ? 'active' : ''}`}
                            onClick={() => setPopUpState(prevState => ({ ...prevState, brandPopUp: !prevState.brandPopUp }))}>
                            <TbBrandAirtable size={30} />
                        </div>
                    </div>
                </>


                {renderPopUp('categoryPopUp', ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty & Personal Care', 'Toys & Games', 'Sports & Outdoors', 'Automotive', 'Furniture', 'Health & Wellness', 'Office Supplies', 'Groceries'], handleCategorySelect)}
{renderPopUp('brandPopUp', ['Nike', 'Samsung', 'Apple', 'Sony', 'LG', 'Adidas', 'Microsoft', 'Philips', 'Lenovo', 'Puma', 'HP', 'Dell'], handleBrandSelect)}




                <div className='user-refurbished-product-title-description-div'>
                    <textarea
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter a relevant TITLE"
                        className='retailer-upload-product-form-textarea'
                        style={{ maxWidth: "90vw", minHeight: "10vh" }}
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter a relevant DESCRIPTION"
                        className='retailer-upload-product-form-textarea'
                        style={{ maxWidth: "90vw", minHeight: "20vh" }}
                    />
                </div>


                <div className='user-refurbished-product-price-discounted-div'>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter ORIGINAL PRICE"
                        style={{ maxWidth: "90vw", height: "4vh" }}
                        className='retailer-upload-product-form-textarea'
                    />
                    <input
                        type="number"
                        name="discountedPrice"
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder="Enter DISCOUNTED PRICE"
                        style={{ maxWidth: "90vw", height: "4vh" }}
                        className='retailer-upload-product-form-textarea'
                    />
                </div>

                <textarea
                    name="keywords"
                    placeholder="Keywords (separated by commas [,])"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className='retailer-upload-product-form-textarea'
                    style={{ maxWidth: "90vw", minHeight: "20vh" }}
                />

                <div className="user-refurbished-product-book-module-upload-form-image-section">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="user-refurbished-product-book-module-upload-form-image-container"
                            onDrop={(event) => handleDrop(index, event)}
                            onDragOver={(event) => event.preventDefault()}
                        >
                            {image ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    onClick={() => handleImageChange(index, [])}
                                    alt={`Uploaded ${index + 1}`}
                                    className="user-refurbished-product-book-module-upload-form-uploaded-image"
                                />
                            ) : (
                                <CiImageOn className="user-refurbished-product-book-module-upload-form-image-placeholder" onClick={() => document.getElementById(`image-upload-${index}`).click()} size={60} />

                            )}
                            <input
                                type="file"
                                id={`image-upload-${index}`}
                                style={{ display: 'none' }}
                                onChange={(event) => handleImageChange(index, event.target.files)}
                            />
                        </div>
                    ))}
                </div>

                <div
                    className={`retailer-upload-product-form-submit ${isUploading ? 'disabled' : ''}`}
                    onClick={isUploading ? null : handleSubmit}
                >
                    UPLOAD <TbWorldUpload size={35} />
                </div>


            </div>

            {!allFieldEntered && (
                <PopupFail message="All fields are required!" onClose={() => setAllFieldEntered(true)} isSuccess={false} />
            )}
            {isUploading && (
                <div className="user-refurbished-product-book-module-upload-form-loader">
                    <Oval height={40} width={40} color="#fff" />
                </div>
            )}
            {uploadStatus.success && (
                <PopupSuccess message={`product uploaded successfully!`} onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess={true} />
            )}
            {uploadStatus.fail && (
                <PopupFail message={`Failed to upload product. Please try again!`} onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess={false} />
            )}

        </>
    );
};

export default UploadBooksModulesForm;