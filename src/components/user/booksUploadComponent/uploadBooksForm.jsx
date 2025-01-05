import React, { useState, useEffect } from 'react'

import { IoClose } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import userUploadBooks from '../../../appWrite/UserUploadRefurbished/userUploadBooks.js';

function uploadBooksForm({ userData }) {

    const [classPopUp, setClassPopUp] = useState(false);
    const [subjectPopUp, setSubjectPopUp] = useState(false);
    const [boardPopUp, setBoardPopUp] = useState(false);
    const [languagePopUp, setLanguagePopUp] = useState(false);

    const [isUploadingBook, setIsUploading] = useState(false);


    const [formData, setFormData] = useState({
        class: 'CLASS',
        language: 'language',
        board: 'board',
        subject: 'subject',
        title: '', // for title
        description: '', // for description
        price: '', // for price
        discountedPrice: '', // for discounted price
        keywords: '', // for keywords
        author: '', // for author name
        buyingYear: '',
        phn: `+91` + `${userData.phn}`,
        pinCodes: '740001,740002,740003,742136',
        productType: 'book'
    });
    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            phn: `+91` + `${userData.phn}`,
        }));
    }, [userData])

    const [images, setImages] = useState([null, null, null]);
    const handleDrop = (index, event) => {
        event.preventDefault();
        event.stopPropagation();
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
    const handleClassSelect = (selectedClass) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            class: Number(selectedClass),
        }));
        setClassPopUp(false);
    };

    const handleSubjectSelect = (selectedSubject) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            subject: selectedSubject,
        }));
        setSubjectPopUp(false);
    };

    const handleBoardSelect = (selectedBoard) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            board: selectedBoard,
        }));
        setBoardPopUp(false);
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            language: selectedLanguage,
        }));
        setLanguagePopUp(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (
            !formData.class ||
            !formData.language ||
            !formData.board ||
            !formData.subject ||
            !formData.title ||
            !formData.price ||
            !formData.discountedPrice ||
            images.every(image => image === null)
        ) {
            setAllField(false);
            console.log("All required fields are not filled");
            return;
        }

        // Prepare formData with additional information
        setFormData((prevFormData) => ({
            ...prevFormData,
            phn: `+91${userData.phn}`,
        }));

        try {
            setIsUploading(true);
            const uploadedBook = await userUploadBooks.uploadProductWithImages(formData, images);
            setFormData({
                class: 'class',
                language: 'language',
                board: 'board',
                subject: 'subject',
                title: '',
                description: '',
                price: '',
                discountedPrice: '',
                keywords: '',
                author: '',
                buyingYear: '',
                phn: `+91` + `${userData.phn}`,
                pinCodes: '740001,740002,740003,742136',
                productType: 'book'
            })
            setImages([null, null, null]);
            console.log("Upload successful");
        } catch (error) {
            console.log("Error uploading product:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageChange = (index, files) => {
        if (files && files[0]) {
            const updatedImages = [...images];
            updatedImages[index] = files[0];
            setImages(updatedImages);
        }
    };

    return (
        <div className='book-upload-form'>
            <div className={`book-upload-form-group ${formData.class !== 'CLASS' ? 'active' : ''}`} onClick={() => setClassPopUp(!classPopUp)}>
                <div className={`book-upload-form-group-inner`}>
                    <label className='book-upload-form-group-label'>
                        {formData.class}
                    </label>
                    *
                </div>
            </div>

            {classPopUp && (
                <div className='refurbished-books-class-popup'>
                    <div className='refurbished-books-class-popup-close-popup' onClick={() => setClassPopUp(false)}>
                        <IoClose size={25} />
                    </div>
                    <div className='refurbished-books-class-popup-options'>
                        <div className='refurbished-books-class-popup-options-flex'>
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((classItem) => (
                                <div
                                    key={classItem}
                                    className='refurbished-books-class-popup-class-option'
                                    onClick={() => handleClassSelect(classItem)}
                                >
                                    {classItem}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Board & Language Selection */}
            <div style={{ display: "flex", width: "90vw", gap: "3px" }}>
                <div className={`board-upload-form-group ${formData.board !== 'board' ? 'active' : ''}`} onClick={() => setBoardPopUp(!boardPopUp)}>
                    <label className='board-upload-form-group-label'>
                        {formData.board.toUpperCase()}
                    </label>
                    *
                </div>
                <div className={`lang-upload-form-group ${formData.language !== 'language' ? 'active' : ''}`} onClick={() => setLanguagePopUp(!languagePopUp)}>
                    <label className='lang-upload-form-group-label'>
                        {formData.language.toUpperCase()}
                    </label>
                    *
                </div>
            </div>



            {boardPopUp && (
                <div className='refurbished-books-class-popup'>
                    <div className='refurbished-books-class-popup-close-popup' onClick={() => setBoardPopUp(false)}>
                        <IoClose size={25} />
                    </div>
                    <div className='refurbished-books-class-popup-options'>
                        <div className='refurbished-books-class-popup-options-flex'>
                            {['cbse', 'icse'].map((boardItem) => (
                                <div
                                    key={boardItem}
                                    className='refurbished-books-class-popup-class-option'
                                    onClick={() => handleBoardSelect(boardItem)}
                                >
                                    {boardItem.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {languagePopUp && (
                <div className='refurbished-books-class-popup'>
                    <div className='refurbished-books-class-popup-close-popup' onClick={() => setLanguagePopUp(false)}>
                        <IoClose size={25} />
                    </div>
                    <div className='refurbished-books-class-popup-options'>
                        <div className='refurbished-books-class-popup-options-flex'>
                            {['Beng', 'Eng'].map((languageItem) => (
                                <div
                                    key={languageItem}
                                    className='refurbished-books-class-popup-class-option'
                                    onClick={() => handleLanguageSelect(languageItem)}
                                >
                                    {languageItem.charAt(0).toUpperCase() + languageItem.slice(1)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className={`book-upload-form-group   ${formData.subject !== 'subject' ? 'active' : ''}`} onClick={() => setSubjectPopUp(!subjectPopUp)}>
                <div className={`book-upload-form-group-inner`}>
                    <label className='book-upload-form-group-label'>
                        {formData.subject.toUpperCase()}
                    </label>
                    *
                </div>
            </div>

            {subjectPopUp && (
                <div className='refurbished-books-class-popup'>
                    <div className='refurbished-books-class-popup-close-popup' onClick={() => setSubjectPopUp(false)}>
                        <IoClose size={25} />
                    </div>
                    <div className='refurbished-books-class-popup-options'>
                        <div className='refurbished-books-class-popup-options-flex'>
                            {['math', 'science', 'history', 'english'].map((subjectItem) => (
                                <div
                                    key={subjectItem}
                                    className='refurbished-books-class-popup-class-option'
                                    onClick={() => handleSubjectSelect(subjectItem)}
                                >
                                    {subjectItem.charAt(0).toUpperCase() + subjectItem.slice(1)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <hr style={{ width: "0vw", backgroundColor: "white", margin: "20px 0px 10px 0px" }}></hr>

            <div className='book-upload-form-group'>
                <div className='book-upload-form-group-inner'>
                    <input
                        type='text'
                        name='title'
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder='Enter Title'
                        className='book-upload-title-input'
                    />
                    *
                </div>
            </div>

            <div className='book-upload-form-group'>
                <div className='book-upload-form-group-inner'>
                    <input
                        type='text'
                        name='description'
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder='Enter Description'
                        className='book-upload-description-input'
                    />
                </div>
            </div>

            <div className='book-upload-form-group'>
                <div className='book-upload-form-group-inner'>
                        <input
                            type='number'
                            name='price'
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder='Enter Price'
                            className='book-upload-price-input'
                        />
                    *
                </div>
            </div>

            <div className='book-upload-form-group'>
                <div className='book-upload-form-group-inner'>
                    <input
                        type='number'
                        name='discountedPrice'
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder='Enter Discounted Price'
                        className='book-upload-discounted-input'
                    />
                    *
                </div>
            </div>


            <hr style={{ width: "0vw", backgroundColor: "white", margin: "20px 0px 10px 0px" }}></hr>

            <p>ADITIONAL INFO</p>

            {/* Keywords Input */}
            <div className='book-upload-form-group'>
                <div className='book-upload-form-group-inner'>
                    <input
                        type='text'
                        name='keywords'
                        value={formData.keywords}
                        onChange={handleInputChange}
                        placeholder='Book Keywords (seperated by comma)'
                        className='book-upload-keywords-input'
                    />
                </div>
            </div>

            {/* Author Name Input */}
            <div className='book-upload-form-group'>
                <div className='book-upload-form-group-inner'>
                    <input
                        type='text'
                        name='author'
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder='Book Author Name'
                        className='book-upload-author-input'
                    />
                </div>
            </div>

            {/* Buying Year Input */}
            <div className='book-upload-form-group'>
                <div className='book-upload-form-group-inner'>
                    <input
                        type='number'
                        name='buyingYear'
                        value={formData.buyingYear}
                        onChange={handleInputChange}
                        placeholder='Book Buying Year'
                        className='book-upload-year-input'
                    />
                </div>
            </div>


            {/* Image Upload */}
            <div className='book-upload-image-section'>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className='book-upload-image-container'
                        onDrop={(event) => handleDrop(index, event)}
                        onDragOver={(event) => event.preventDefault()}

                    >
                        {image ? (
                            <>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Uploaded ${index + 1}`}
                                    className='user-book-uploaded-image'
                                />
                                <IoClose
                                    size={20}
                                    className='remove-image-icon'
                                    onClick={() => removeImage(index)}
                                />
                            </>
                        ) : (
                            <div className='user-upload-image-placeholder' onClick={() => triggerFileInput(index)}><CiImageOn size={50} /></div>
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
            <div
                className='user-upload-book-submit-button-container'
                style={{
                    pointerEvents: isUploadingBook ? "none" : "auto",
                    opacity: isUploadingBook ? 0.6 : 1,
                }}
                onClick={!isUploadingBook ? handleSubmit : null}
            >
                {isUploadingBook ? "UPLOADING..." : "UPLOAD"}
            </div>


        </div>
    )
}

export default uploadBooksForm
