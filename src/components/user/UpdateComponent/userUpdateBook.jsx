import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { IoClose } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import Cookies from 'js-cookie';

import userUploadBooks from '../../../appWrite/UserUploadRefurbished/userUploadBooks.js';
import './userUpdateBook.css';

const UploadProduct = () => {
  const navigate = useNavigate();
  const productId = useParams('id');

  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [type, setType] = useState('books');
  const [classPopUp, setClassPopUp] = useState(false);
  const [subjectPopUp, setSubjectPopUp] = useState(false);
  const [boardPopUp, setBoardPopUp] = useState(false);
  const [languagePopUp, setLanguagePopUp] = useState(false);
  const [userData, setUserData] = useState('');
  const [allField, setallField] = useState(true);

  const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);

  const [formData, setFormData] = useState({
    class: 'class',
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
    pinCodes: '740001,740002,740003,742136'
  });
  const [images, setImages] = useState([null, null, null]);
  const [imagesToDelete, setImagesToDelete] = useState([]);


  useEffect(() => {
    const userSession = Cookies.get('BharatLinkerUser');
    if (userSession) {
      setUserData(JSON.parse(userSession));
    }
  }, []);

  const products = useSelector((state) => state.userAllRefurbishedProducts.allRefurbishedProducts);
  useEffect(() => {
    const fetchProductData = async () => {
      if (productId) {
        const filteredProducts = products.filter((product) => product.$id === productId.id);
        setFormData({
          class: filteredProducts[0]?.class,
          language: filteredProducts[0]?.language,
          board: filteredProducts[0]?.board,
          subject: filteredProducts[0]?.subject,
          title: filteredProducts[0]?.title,
          description: filteredProducts[0]?.description,
          price: filteredProducts[0]?.price,
          discountedPrice: filteredProducts[0]?.discountedPrice,
          keywords: filteredProducts[0]?.keywords.join(','),
          author: filteredProducts[0]?.author,
          buyingYear: '',
          pinCodes: '740001,740002,740003,742136'
        });

        const updatedImages = [...filteredProducts[0].images];
        for (let i = updatedImages.length; i < 3; i++) {
          updatedImages.push(null);
        }
        setImages(updatedImages);
        setImagesToDelete(updatedImages);

      }
    };
    fetchProductData();
  }, []);



  const handleImageChange = (index, files) => {
    if (files && files[0]) {
      const updatedImages = [...images];
      updatedImages[index] = files[0];
      setImages(updatedImages);
    }
  };

  const handleDrop = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    handleImageChange(index, files);
  };

  const triggerFileInput = (index) => {
    document.getElementById(`image-update-${index}`).click();
  };

  const removeImage = (index) => {
    if (typeof (images[index]) === 'string') {
      const publicId = images[index];
      setToDeleteImagesUrls((prevUrls) => [...prevUrls, publicId]);
    }
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

  const handleSubmit = () => {
    if (
      !formData.class ||
      !formData.language ||
      !formData.board ||
      !formData.subject ||
      !formData.title ||
      !formData.price ||
      !formData.discountedPrice
    ) {
      setallField(false);
      console.log("error")
      return;
    }
    try {
      console.log("here")
      const updatedData = formData;
      userUploadBooks.updateUserRefurbishedProduct(productId, toDeleteImagesUrls, updatedData, images);
    } catch (error) {
      console.log("error")
    }
  };

  const handleDelete = async () => {
    try {
      await userUploadBooks.deleteProduct(productId, imagesToDelete);
      alert("Delete successful");
    } catch (error) {
      console.error("Error in deleting product:", error);
    }
  };

  return (
    <>
      <div className='user-update-books-header'>
        <FaArrowLeft
          id='user-update-books-header-left-icon'
          size={25}
          onClick={() => navigate('/user/refurbished')}
          aria-label="User Account"
          tabIndex={0}
        />
        <div className='user-update-books-header-inner-div'>
          <p className='user-update-books-header-inner-div-p'>UPDATE {type?.toUpperCase()}</p>
          <div
            className={`user-update-books-header-inner-div-phn-div`}
            onClick={() => navigate('/pincode')}
            aria-label="Change Location"
            tabIndex={0}
          >
            {userData.phn}
          </div>
        </div>
      </div>

      <div className='user-update-book-type'>
        <div
          className={`user-update-book-type-book ${type === 'books' ? 'active' : ''}`}
          onClick={() => setType('books')}
        >
          {type}
        </div>

      </div>

      {type === 'books' && (
        <div className='book-update-form'>
          {/* Class Selection */}
          <div className={`book-update-form-group ${formData.class !== 'class' ? 'active' : ''}`} onClick={() => setClassPopUp(!classPopUp)}>
            <div className={`book-update-form-group-inner`}>
              <label className='book-update-form-group-label'>
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
          <div style={{ display: "flex", maxWidth: "90vw", gap: "3px" }}>
            <div className={`board-update-form-group ${formData.board !== 'board' ? 'active' : ''}`} onClick={() => setBoardPopUp(!boardPopUp)}>
              <div className='board-update-form-group-inner'>
                <label className='board-update-form-group-label'>
                  {formData?.board?.toUpperCase()}
                </label>
                *
              </div>
            </div>
            <div className={`lang-update-form-group  ${formData.language !== 'language' ? 'active' : ''}`} onClick={() => setLanguagePopUp(!languagePopUp)}>
              <div className='lang-update-form-group-inner'>
                <label className='lang-update-form-group-label'>
                  {formData?.language?.toUpperCase()}
                </label>
                *
              </div>
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
                      {boardItem?.toUpperCase()}
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
                      {languageItem.charAt(0)?.toUpperCase() + languageItem.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={`book-update-form-group   ${formData.subject !== 'subject' ? 'active' : ''}`} onClick={() => setSubjectPopUp(!subjectPopUp)}>
            <div className={`book-update-form-group-inner`}>
              <label className='book-update-form-group-label'>
                {formData?.subject?.toUpperCase()}
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
                      {subjectItem?.charAt(0)?.toUpperCase() + subjectItem.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <hr style={{ width: "0vw", backgroundColor: "white", margin: "20px 0px 10px 0px" }}></hr>

          <div className='book-update-form-group'>
            <div className='book-update-form-group-inner'>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                placeholder='Enter Title'
                className='book-update-title-input'
              />
              *
            </div>
          </div>

          <div className='book-update-form-group'>
            <div className='book-update-form-group-inner'>
              <input
                type='text'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Enter Description'
                className='book-update-description-input'
              />
            </div>
          </div>

          <div className='book-update-form-group'>
            <div className='book-update-form-group-inner'>
              <s>
                <input
                  type='number'
                  name='price'
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder='Enter Price'
                  className='book-update-price-input'
                />
              </s>
              *
            </div>
          </div>

          <div className='book-update-form-group'>
            <div className='book-update-form-group-inner'>
              <input
                type='number'
                name='discountedPrice'
                value={formData.discountedPrice}
                onChange={handleInputChange}
                placeholder='Enter Discounted Price'
                className='book-update-discounted-input'
              />
              *
            </div>
          </div>


          <hr style={{ width: "0vw", backgroundColor: "white", margin: "20px 0px 10px 0px" }}></hr>

          <p>Aditional Info</p>

          {/* Keywords Input */}
          <div className='book-update-form-group'>
            <div className='book-update-form-group-inner'>
              <input
                type='text'
                name='keywords'
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder='Book Keywords (seperated by comma)'
                className='book-update-keywords-input'
              />
            </div>
          </div>

          {/* Author Name Input */}
          <div className='book-update-form-group'>
            <div className='book-update-form-group-inner'>
              <input
                type='text'
                name='author'
                value={formData.author}
                onChange={handleInputChange}
                placeholder='Book Author Name'
                className='book-update-author-input'
              />
            </div>
          </div>

          {/* Buying Year Input */}
          <div className='book-update-form-group'>
            <div className='book-update-form-group-inner'>
              <input
                type='number'
                name='buyingYear'
                value={formData.buyingYear}
                onChange={handleInputChange}
                placeholder='Book Buying Year'
                className='book-update-year-input'
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
      )}


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
};

export default UploadProduct;

