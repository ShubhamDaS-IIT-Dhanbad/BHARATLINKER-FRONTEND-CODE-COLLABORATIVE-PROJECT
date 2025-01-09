import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandAirtable, TbWorldUpload } from "react-icons/tb";

import { Oval } from 'react-loader-spinner';
import userRefurbishedProduct from '../../../appWrite/UserRefurbishedProductService/userRefurbishedProduct.js';

const UploadBooksModulesForm = ({ userData, productType }) => {
    const [popUpState, setPopUpState] = useState({
        classPopUp: false,
        subjectPopUp: false,
        languagePopUp: false,
        categoryPopUp: false,
        brandPopUp: false,
    });
    const [selected, setSelected] = useState("ADDRESS LOCATION");
    const [coordinates, setCoordinates] = useState({ lat: null, long: null });


    const [uploadStatus, setUploadStatus] = useState({
        success: false,
        fail: false,
    });

    const [formData, setFormData] = useState({
        class: '',
        language: '',
        subject: '',
        title: '',
        description: '',
        price: '',
        discountedPrice: '',
        keywords: '',
        pinCodes: '740001,740002,740003,742136',
        productType,
        brand: '',
        category: '',
        phn: `+91${userData.phn || ''}`,
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
    const handleCurrentLocationClick = () => {
        setSelected("CURRENT LOCATION");
    
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCoordinates({ lat: latitude, long: longitude });
              console.log("Latitude:", latitude, "Longitude:", longitude);
            },
            (error) => {
              console.error("Error retrieving location:", error.message);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      };
    const handleDrop = (index, event) => {
        event.preventDefault();
        handleImageChange(index, event.dataTransfer.files);
    };

    const handleImageChange = (index, files) => {
        if (files && files[0]) {
            setImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[index] = files[0];
                return updatedImages;
            });
        }
    };





    const handleClassSelect = (selectedClass) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            class: selectedClass,
        }));
        setPopUpState(prevState => ({ ...prevState, classPopUp: false }));
    };
    const handleLanguageSelect = (selectedLanguage) => {
        setFormData((prevFormData) => ({
            ...prevFormData, language: selectedLanguage,
        }));
        setPopUpState(prevState => ({ ...prevState, languagePopUp: false }));
    };
    const handleSubjectSelect = (selectedSubject) => {
        setFormData(prevFormData => ({ ...prevFormData, subject: selectedSubject }));
        setPopUpState(prevState => ({ ...prevState, subjectPopUp: false }));
    };
    const handleCategorySelect = (selectedCategory) => {
        setFormData(prevFormData => ({ ...prevFormData, category: selectedCategory }));
        setPopUpState(prevState => ({ ...prevState, categoryPopUp: false }));
    };
    const handleBrandSelect = (selectedBrand) => {
        setFormData(prevFormData => ({ ...prevFormData, brand: selectedBrand }));
        setPopUpState(prevState => ({ ...prevState, brandPopUp: false }));
    };








    const handleSubmit = () => {
        const { lat=coordinates.lat,long=coordinates.long,title, price, discountedPrice, class: selectedClass, language, category, brand } = formData;

        // Check if required fields are filled based on the product type
        const isModuleOrBookValid = (productType === 'module' || productType === 'book') &&
            [title, price, discountedPrice].every(Boolean);
        const isGadgetValid = productType === 'gadget' &&
            [title, price, discountedPrice].every(Boolean);

        // If fields are not valid, show error and return
        if (!isModuleOrBookValid && !isGadgetValid) {
            setAllFieldEntered(false);
            return;
        }

        // Prepare the final form data
        const finalFormData = {
            ...formData,
            phn: `+91${userData?.phn || ''}`,
        };

        // Start uploading
        setIsUploading(true);
        userRefurbishedProduct.uploadProductWithImages(finalFormData, images)
            .then(() => {
                setUploadStatus({ success: true, fail: false });
                resetForm();
            })
            .catch(() => {
                setUploadStatus({ success: false, fail: true });
            })
            .finally(() => {
                setIsUploading(false);
            });
    };


    const resetForm = () => {
        setFormData({
            class: '',
            language: '',
            subject: '',
            title: '',
            description: '',
            price: '',
            discountedPrice: '',
            keywords: '',
            pinCodes: '740001,740002,740003,742136',
            productType: 'module',
        });
        setImages([null, null, null]);
    };

    const renderPopUp = (popUpKey, options, handleSelect) => {
        const kpopup = popUpKey.slice(0, -5); // Remove the last 5 characters
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
            <div className="user-refurbished-product-book-module-upload-form">
                {productType != 'gadget' ?
                    <div style={{ display: "flex", gap: "5px", marginBottom: "17px" }}>
                        <div
                            className={`user-refurbished-product-book-module-upload-form-class ${formData.class && formData.class !== 'class' ? 'active' : ''}`}
                            onClick={() => setPopUpState(prevState => ({ ...prevState, classPopUp: !prevState.classPopUp }))}
                        >
                            C
                        </div>
                        <div
                            className={`user-refurbished-product-book-module-upload-form-subject ${formData.subject ? 'active' : ''}`}
                            onClick={() => setPopUpState(prevState => ({ ...prevState, subjectPopUp: !prevState.subjectPopUp }))}
                        >
                            S
                        </div>
                        <div
                            className={`user-refurbished-product-book-module-upload-form-language ${formData.language ? 'active' : ''}`}
                            onClick={() => setPopUpState(prevState => ({ ...prevState, languagePopUp: !prevState.languagePopUp }))}
                        >
                            L
                        </div>
                    </div>
                    :
                    <>
                        <div className='user-refurbished-product-category-brand-div' style={{ marginTop: "50px", display: 'flex', gap: '10px' }}>
                            <div
                                className={`user-refurbished-product-book-module-upload-form-category ${formData.category ? 'active' : ''}`}
                                onClick={() => setPopUpState(prevState => ({ ...prevState, categoryPopUp: !prevState.categoryPopUp }))}>
                                <MdOutlineCategory size={30} />
                            </div>
                            <div className={`user-refurbished-product-book-module-upload-form-brand ${formData.brand ? 'active' : ''}`}
                                onClick={() => setPopUpState(prevState => ({ ...prevState, brandPopUp: !prevState.brandPopUp }))}>
                                <TbBrandAirtable size={30} />
                            </div>
                        </div>
                    </>
                }


                {renderPopUp('classPopUp', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], handleClassSelect)}
                {renderPopUp('languagePopUp', ['Beng', 'Eng'], handleLanguageSelect)}
                {renderPopUp('subjectPopUp', ['math', 'science', 'history', 'english'], handleSubjectSelect)}
                {renderPopUp('categoryPopUp', ['category', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], handleCategorySelect)}
                {renderPopUp('brandPopUp', ['brand', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], handleBrandSelect)}




                <div className='user-refurbished-product-title-description-div'>
                    <textarea
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter a relevant title"
                        className='user-refurbished-product-book-module-upload-form-textarea'
                        style={{ maxWidth: "90vw", minHeight: "10vh" }}
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter a relevant description"
                        className='user-refurbished-product-book-module-upload-form-textarea'
                        style={{ maxWidth: "90vw", minHeight: "20vh" }}
                    />
                </div>


                <div className='user-refurbished-product-price-discounted-div'>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter original price"
                        style={{ maxWidth: "90vw", height: "4vh" }}
                        className='user-refurbished-product-book-module-upload-form-textarea'
                    />
                    <input
                        type="number"
                        name="discountedPrice"
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder="Enter discounted price"
                        style={{ maxWidth: "90vw", height: "4vh" }}
                        className='user-refurbished-product-book-module-upload-form-textarea'
                    />
                </div>

                <textarea
                    name="keywords"
                    placeholder="Keywords (separated by commas [,])"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className='user-refurbished-product-book-module-upload-form-textarea'
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
                <div id="user-refurbished-product-book-module-upload-location">
                    <div
                        className={`user-refurbished-product-book-module-upload-location-p ${selected === "CURRENT LOCATION" ? "selected" : ""
                            }`}
                        onClick={() =>{setSelected("CURRENT LOCATION");handleCurrentLocationClick();}}
                    >
                        CURRENT LOCATION
                    </div>
                    <div
                        className={`user-refurbished-product-book-module-upload-location-p ${selected === "ADDRESS LOCATION" ? "selected" : ""
                            }`}
                        onClick={() => setSelected("ADDRESS LOCATION")}
                    >
                        ADDRESS LOCATION
                    </div>
                </div>
                <div
                    className={`user-refurbished-product-book-module-upload-form-submit ${isUploading ? 'disabled' : ''}`}
                    onClick={isUploading ? null : handleSubmit}
                >
                    <TbWorldUpload size={35} />
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
                <PopupSuccess message={`${productType} uploaded successfully!`} onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess />
            )}
            {uploadStatus.fail && (
                <PopupFail message={`Failed to upload ${productType}. Please try again!`} onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess={false} />
            )}

        </>
    );
};

export default UploadBooksModulesForm;