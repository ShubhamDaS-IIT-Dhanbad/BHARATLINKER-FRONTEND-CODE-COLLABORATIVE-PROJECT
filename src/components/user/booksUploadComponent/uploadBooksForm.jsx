import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { TbWorldUpload } from 'react-icons/tb';
import { Oval } from 'react-loader-spinner';

import { MdOutlineClass } from "react-icons/md";
import { MdOutlineSubject } from "react-icons/md";

import userUploadBooks from '../../../appWrite/UserUploadRefurbished/userUploadBooks.js';

const UploadBooksModulesForm = ({ userData, productType }) => {
    const [popUpState, setPopUpState] = useState({
        classPopUp: false,
        subjectPopUp: false,
        languagePopUp: false,
    });

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

    const handleSubjectSelect = (selectedSubject) => {
        setFormData(prevFormData => ({ ...prevFormData, subject: selectedSubject }));
        setPopUpState(prevState => ({ ...prevState, subjectPopUp: false }));
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setFormData(prevFormData => ({ ...prevFormData, language: selectedLanguage }));
        setPopUpState(prevState => ({ ...prevState, languagePopUp: false }));
    };

    const handleSubmit = () => {
        const { title, price, discountedPrice, class: selectedClass, language } = formData;

        if (![title, price, discountedPrice, selectedClass, language].every(Boolean)) {
            setAllFieldEntered(false);
            return;
        }

        const finalFormData = {
            ...formData,
            phn: `+91${userData?.phn || ''}`,
        };

        setIsUploading(true);
        userUploadBooks.uploadModuleWithImages(finalFormData, images)
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
    const handleClassSelect = (selectedClass) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            class: Number(selectedClass),
        }));
        setPopUpState(prevState => ({ ...prevState, classPopUp: false }));
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
                    <div style={{color:"white"}}>
                        {`${kpopup.toUpperCase()}`}
                    </div>
                    <div className="refurbished-book-module-class-popup-options">
                        {options.map((item) => (
                            <div
                                key={item}
                                className="refurbished-book-module-class-popup-class-option"
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



    const Popup = ({ message, onClose, isSuccess }) => (
        <div className="user-refurbished-gadgets-upload-pop-up">
            <div className="user-refurbished-gadgets-upload-pop-up-inner">
                <div className="user-refurbished-gadgets-upload-pop-up-message">{message}</div>
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
            <div className="user-refurbished-product-book-module-upload-form">

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

                {renderPopUp('classPopUp', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], handleClassSelect)}
                {renderPopUp('languagePopUp', ['Beng', 'Eng'], handleLanguageSelect)}
                {renderPopUp('subjectPopUp', ['math', 'science', 'history', 'english'], handleSubjectSelect)}

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
                    <textarea
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter original price"
                        style={{ maxWidth: "90vw", height: "4vh" }}
                        className='user-refurbished-product-book-module-upload-form-textarea'
                    />
                    <textarea
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

                <div
                    className={`user-refurbished-product-book-module-upload-form-submit ${isUploading ? 'disabled' : ''}`}
                    onClick={isUploading ? null : handleSubmit}
                >
                    <TbWorldUpload size={35} />
                </div>


            </div>

            {!allFieldEntered && (
                <Popup message="All fields are required!" onClose={() => setAllFieldEntered(true)} isSuccess={false} />
            )}
            {isUploading && (
                <div className="user-refurbished-product-book-module-upload-form-loader">
                    <Oval height={40} width={40} color="#fff" />
                </div>
            )}
            {uploadStatus.success && (
                <Popup message={`${productType} uploaded successfully!`} onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess />
            )}
            {uploadStatus.fail && (
                <Popup message={`Failed to upload ${productType}. Please try again!`} onClose={() => setUploadStatus({ success: false, fail: false })} isSuccess={false} />
            )}

        </>
    );
};

export default UploadBooksModulesForm;