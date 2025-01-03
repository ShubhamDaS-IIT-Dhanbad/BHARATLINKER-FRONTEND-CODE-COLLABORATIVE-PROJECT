import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import userUploadBooks from '../../../appWrite/UserUploadRefurbished/userUploadBooks.js';
import Cookies from 'js-cookie'
function UpdateModuleForm() {
    const { id: moduleId } = useParams();
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [allField, setallField] = useState(true);


    const [classPopUp, setClassPopUp] = useState(false);
    const [subjectPopUp, setSubjectPopUp] = useState(false);
    const [languagePopUp, setLanguagePopUp] = useState(false);
    const [images, setImages] = useState([null, null, null]);
    const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);
    const [formData, setFormData] = useState({
        class: 'class',
        language: 'language',
        subject: 'subject',
        title: '',
        description: '',
        price: '',
        discountedPrice: '',
        keywords: '',
        author: '',
        buyingYear: '',
        pinCodes: '740001,740002,740003,742136',
        coachingInstitute: '',
        exam: '',
        productType: 'module',
    });

    const [userData, setUserData] = useState({});
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const products = useSelector((state) =>state.userRefurbishedProducts.refurbishedProducts);

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUser');
        if (userSession) {
            setUserData(JSON.parse(userSession));
        }
    }, []);

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            phn: `+91${userData.phn}`,
        }));
    }, [userData]);

    useEffect(() => {
        const fetchProductData = async () => {
            if (moduleId) {
                const selectedProduct = products.find((product) => product.$id === moduleId);
                if (selectedProduct) {
                    setFormData({
                        class: selectedProduct.class || 'class',
                        language: selectedProduct.language || 'language',
                        subject: selectedProduct.subject || 'subject',
                        title: selectedProduct.title || '',
                        description: selectedProduct.description || '',
                        price: selectedProduct.price || '',
                        discountedPrice: selectedProduct.discountedPrice || '',
                        keywords: selectedProduct.keywords.join(',') || '',
                        author: selectedProduct.author || '',
                        buyingYear: selectedProduct.buyingYear || '',
                        pinCodes: '740001,740002,740003,742136',
                        coachingInstitute: selectedProduct.coachingInstitute || '',
                        exam: selectedProduct.exam || ''
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

        if (
            !formData.language ||
            !formData.subject ||
            !formData.title ||
            !formData.price 
          ) {
            setallField(false);
            console.log("error")
            return;
          }


        try {
            await userUploadBooks.updateModuleWithImages(formData, moduleId, toDeleteImagesUrls, images);
        } catch (error) {
            console.error("Error uploading module with images:", error);
        }
    };




    // Separate handlers for each input field
    const handleTitleChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            title: value,
        }));
    };

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            description: value,
        }));
    };

    const handlePriceChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            price: value,
        }));
    };

    const handleDiscountedPriceChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            discountedPrice: value,
        }));
    };

    const handleKeywordsChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            keywords: value,
        }));
    };

    const handleAuthorChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            author: value,
        }));
    };

    const handleBuyingYearChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            buyingYear: value,
        }));
    };

    const handleExamChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            exam: value,
        }));
    };

    const handleCoachingInstituteChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            coachingInstitute: value,
        }));
    };
    const handleDelete = async () => {
        try {
            userUploadBooks.deleteModule(moduleId,imagesToDelete);
            alert("Delete successful");
        } catch (error) {
            console.error("Error in deleting product:", error);
        }
    };
    return (
        <>
            <div className='book-upload-form'>
                <div
                    className={`book-upload-form-group ${formData.class !== 'class' ? 'active' : ''}`}
                    onClick={() => setClassPopUp(!classPopUp)}
                >
                    <div className='book-upload-form-group-inner'>
                        <label className='book-upload-form-group-label'>{formData.class}</label> *
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
                                    <div key={classItem} className='refurbished-books-class-popup-class-option' onClick={() => handleClassSelect(classItem)}>
                                        {classItem}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ display: "flex", maxWidth: "90vw", gap: "3px" }}>
                    <div
                        style={{ width: "45vw" }}
                        className={`book-upload-form-group ${formData.subject !== 'subject' ? 'active' : ''}`}
                        onClick={() => setSubjectPopUp(!subjectPopUp)}
                    >
                        <div className='book-upload-form-group-inner'>
                            <label className='book-upload-form-group-label'>{formData.subject.toUpperCase()}</label> *
                        </div>
                    </div>

                    <div
                        className={`lang-upload-form-group ${formData.language !== 'language' ? 'active' : ''}`}
                        onClick={() => setLanguagePopUp(!languagePopUp)}
                    >
                        <div className='lang-upload-form-group-inner'>
                            <label className='lang-upload-form-group-label'>{formData.language.toUpperCase()}</label> *
                        </div>
                    </div>
                </div>

                {languagePopUp && (
                    <div className='refurbished-books-class-popup'>
                        <div className='refurbished-books-class-popup-close-popup' onClick={() => setLanguagePopUp(false)}>
                            <IoClose size={25} />
                        </div>
                        <div className='refurbished-books-class-popup-options'>
                            <div className='refurbished-books-class-popup-options-flex'>
                                {['Beng', 'Eng'].map((languageItem) => (
                                    <div key={languageItem} className='refurbished-books-class-popup-class-option' onClick={() => handleLanguageSelect(languageItem)}>
                                        {languageItem.charAt(0).toUpperCase() + languageItem.slice(1)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {subjectPopUp && (
                    <div className='refurbished-books-class-popup'>
                        <div className='refurbished-books-class-popup-close-popup' onClick={() => setSubjectPopUp(false)}>
                            <IoClose size={25} />
                        </div>
                        <div className='refurbished-books-class-popup-options'>
                            <div className='refurbished-books-class-popup-options-flex'>
                                {['math', 'science', 'history', 'english'].map((subjectItem) => (
                                    <div key={subjectItem} className='refurbished-books-class-popup-class-option' onClick={() => handleSubjectSelect(subjectItem)}>
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
                            onChange={handleTitleChange}
                            placeholder='Enter Title'
                            className='book-upload-title-input'
                        /> *
                    </div>
                </div>

                <div className='book-upload-form-group'>
                    <div className='book-upload-form-group-inner'>
                        <input
                            type='text'
                            name='description'
                            value={formData.description}
                            onChange={handleDescriptionChange}
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
                            onChange={handlePriceChange}
                            placeholder='Enter Price'
                            className='book-upload-price-input'
                        /> *
                    </div>
                </div>

                <div className='book-upload-form-group'>
                    <div className='book-upload-form-group-inner'>
                        <input
                            type='number'
                            name='discountedPrice'
                            value={formData.discountedPrice}
                            onChange={handleDiscountedPriceChange}
                            placeholder='Enter Discounted Price'
                            className='book-upload-discounted-input'
                        /> *
                    </div>
                </div>

                <hr style={{ width: "0vw", backgroundColor: "white", margin: "20px 0px 10px 0px" }} />

                <p>Additional Info</p>

                <div className='book-upload-form-group'>
                    <div className='book-upload-form-group-inner'>
                        <input
                            type='text'
                            name='keywords'
                            value={formData.keywords}
                            onChange={handleKeywordsChange}
                            placeholder='Book Keywords (separated by comma)'
                            className='book-upload-keywords-input'
                        />
                    </div>
                </div>

                <div className='book-upload-form-group'>
                    <div className='book-upload-form-group-inner'>
                        <input
                            type='text'
                            name='coachingInstitute'
                            value={formData.coachingInstitute}
                            onChange={handleCoachingInstituteChange}
                            placeholder='Coaching Institute Name'
                            className='book-upload-coaching-input'
                        />
                    </div>
                </div>

                <div className='book-upload-form-group'>
                    <div className='book-upload-form-group-inner'>
                        <input
                            type='text'
                            name='exam'
                            value={formData.exam}
                            onChange={handleExamChange}
                            placeholder='Exam Name'
                            className='book-upload-exam-input'
                        />
                    </div>
                </div>

                <div className='book-upload-form-group'>
                    <div className='book-upload-form-group-inner'>
                        <input
                            type='text'
                            name='author'
                            value={formData.author}
                            onChange={handleAuthorChange}
                            placeholder='Book Author Name'
                            className='book-upload-author-input'
                        />
                    </div>
                </div>

                <div className='book-upload-form-group'>
                    <div className='book-upload-form-group-inner'>
                        <input
                            type='number'
                            name='buyingYear'
                            value={formData.buyingYear}
                            onChange={handleBuyingYearChange}
                            placeholder='Book Buying Year'
                            className='book-upload-year-input'
                        />
                    </div>
                </div>


                {/* Image Upload */}
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


                <div className='user-update-book-submit-button-container' onClick={() => setIsUpdate(true)} >
                    Update
                </div>or
                <div className='user-update-book-delete-button-container' onClick={() => setIsDelete(true)}>
                    Delete
                </div>
            </div>






            {!allField && (
                <div className='use-book-update-all-field-required-div' >
                    <div className='use-book-update-all-field-required-div-inner' onClick={() => setallField(true)}>
                        All the * mark field are Required
                        <div className='use-book-update-all-field-required-div-inner-ok'>
                            ok
                        </div>
                    </div>

                </div>)
            }

            {isUpdate && (
                <div className='user-book-update-pop-up'>
                    <div className='user-book-update-pop-up-inner'>
                        <div className='user-book-update-pop-up-message'>
                            Are you sure you want to update?
                        </div>
                        <div className='user-book-update-pop-up-options'>
                            <div className='user-book-update-option-no' onClick={() => setIsUpdate(false)}>
                                No
                            </div>
                            <div className='user-book-update-option-yes' onClick={handleSubmit}>
                                Yes
                            </div>
                        </div>
                    </div>
                </div>
            )}




            {isDelete &&
                <div className='user-book-delete-pop-up'>
                    <div className='user-book-delete-pop-up-inner'>
                        <div className='user-book-delete-pop-up-message'>
                            Are you sure you want to delete?
                        </div>
                        <div className='user-book-delete-pop-up-options'>
                            <div className='user-book-delete-option-no' onClick={() => setIsDelete(false)}>
                                No
                            </div>
                            <div className='user-book-delete-option-yes' onClick={handleDelete}>
                                Yes
                            </div>
                        </div>
                    </div>
                </div>
            }


        </>



    );
}

export default UpdateModuleForm;

