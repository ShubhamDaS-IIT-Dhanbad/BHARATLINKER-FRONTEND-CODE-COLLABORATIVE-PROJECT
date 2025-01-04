import React, { useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import Cookies from 'js-cookie';

import userUploadBooks from '../../../appWrite/UserUploadRefurbished/userUploadBooks.js';
import { deleteProduct } from '../../../redux/features/user/userAllRefurbishedProductsSlice.jsx';
import { resetUserRefurbishedProducts } from '../../../redux/features/user/userAllRefurbishedProductsSlice.jsx';

import './userUpdateRefurbishedBook.css';

const UploadProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productId = useParams('id');
  const products = useSelector((state) => state.userRefurbishedProducts.refurbishedProducts);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [deleteFail, setDeleteFail] = useState(false);
  const [updateFail, setUpdateFail] = useState(false);

  const [type, setType] = useState('books');
  const [classPopUp, setClassPopUp] = useState(false);
  const [subjectPopUp, setSubjectPopUp] = useState(false);
  const [boardPopUp, setBoardPopUp] = useState(false);
  const [languagePopUp, setLanguagePopUp] = useState(false);
  const [userData, setUserData] = useState('');
  const [allField, setAllField] = useState(true);

  const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);
  const [images, setImages] = useState([null, null, null]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [formData, setFormData] = useState({
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
    pinCodes: '740001,740002,740003,742136',
  });

  useEffect(() => {
    if (Cookies.get('BharatLinkerUser')) {
      setUserData(JSON.parse(Cookies.get('BharatLinkerUser')));
    }
  }, []);

  useEffect(() => {
    if (productId) {
      const product = products.find((product) => product.$id === productId.id);
      if (!product) { navigate('/user/refurbished') }
      if (product) {
        const {
          class: prodClass,
          language,
          board,
          subject,
          title,
          description,
          price,
          discountedPrice,
          keywords,
          author,
          images: productImages,
        } = product;

        setFormData({
          class: prodClass,
          language,
          board,
          subject,
          title,
          description,
          price,
          discountedPrice,
          keywords: keywords.join(','),
          author,
          buyingYear: '',
          pinCodes: '740001,740002,740003,742136',
        });
        setImages([...productImages, null].slice(0, 3));
        setImagesToDelete([...productImages, null].slice(0, 3));
      }
    }
  }, []);

  // Image handler
  const handleImageAction = (index, action, files = null) => {
    const updatedImages = [...images];
    switch (action) {
      case 'change':
        if (files && files[0]) {
          updatedImages[index] = files[0];
        }
        break;
      case 'remove':
        if (typeof updatedImages[index] === 'string') {
          const publicId = updatedImages[index];
          setToDeleteImagesUrls((prevUrls) => [...prevUrls, publicId]);
        }
        updatedImages[index] = null;
        break;
      default:
        return;
    }
    setImages(updatedImages);
  };

  const handleImageChange = (index, files) => handleImageAction(index, 'change', files);
  const handleDrop = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    handleImageAction(index, 'change', event.dataTransfer.files);
  };
  const triggerFileInput = (index) => document.getElementById(`image-update-${index}`).click();
  const removeImage = (index) => handleImageAction(index, 'remove');

  // Reusable handle select
  const handleSelect = (field, value, setPopUp) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    setPopUp(false);
  };

  const handleClassSelect = (selectedClass) => handleSelect('class', Number(selectedClass), setClassPopUp);
  const handleSubjectSelect = (selectedSubject) => handleSelect('subject', selectedSubject, setSubjectPopUp);
  const handleBoardSelect = (selectedBoard) => handleSelect('board', selectedBoard, setBoardPopUp);
  const handleLanguageSelect = (selectedLanguage) => handleSelect('language', selectedLanguage, setLanguagePopUp);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle update
  const handleUpdate = async () => {
    const { class: productClass, language, board, subject, title, price, discountedPrice } = formData;
    if (!productClass || !language || !board || !subject || !title || !price || !discountedPrice) {
      setIsUpdate(false);
      setAllField(false);
      return;
    }

    setIsUpdate(false);
    setIsUpdating(true);
    try {
      await userUploadBooks.updateUserRefurbishedProduct(productId, toDeleteImagesUrls, { ...formData }, images);
      setIsUpdateSuccessful(true);
      dispatch(resetUserRefurbishedProducts());
    } catch (error) {
      setUpdateFail(true);
      console.error("Error updating product:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsDelete(false);
    setIsDeleting(true);
    try {
      await userUploadBooks.deleteProduct(productId, imagesToDelete);
      dispatch(deleteProduct(productId));
      setIsDeleteSuccessful(true);

      console.log("Product deleted successfully.");
    } catch (error) {
      setDeleteFail(true);
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Reusable confirmation popup
  const ConfirmationPopup = ({ message, onClose, onConfirm, isDelete }) => (
    <div className={`user-book-${isDelete ? 'delete' : 'update'}-pop-up`}>
      <div className={`user-book-${isDelete ? 'delete' : 'update'}-pop-up-inner`}>
        <div className={`user-book-${isDelete ? 'delete' : 'update'}-pop-up-message`}>
          {message}
        </div>
        <div className={`user-book-${isDelete ? 'delete' : 'update'}-pop-up-options`}>
          <div className={`user-book-${isDelete ? 'delete' : 'update'}-option-no`} onClick={onClose}>No</div>
          <div className={`user-book-${isDelete ? 'delete' : 'update'}-option-yes`} onClick={onConfirm}>Yes</div>
        </div>
      </div>
    </div>
  );
 

  // Reusable error popup
  const PopupFail = ({ message, onClose }) => (
    <div className='user-book-delete-pop-up'>
      <div className='user-book-delete-pop-up-inner'>
        <div className='user-book-delete-pop-up-message'>
          {message}
        </div>
        <div className='user-refurbished-book-fail-popup' onClick={onClose}>
          ok
        </div>
      </div>
    </div>
  );
   //success pop up
  const PopupSuccess = ({ message, onClose }) => (
    <div className='user-book-delete-pop-up'>
      <div className='user-book-delete-pop-up-inner'>
        <div className='user-book-delete-pop-up-message'>
          {message}
        </div>
        <div className='user-refurbished-book-successful-popup' onClick={onClose}>
          Ok
        </div>
      </div>
    </div>
  );


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
                placeholder='Description'
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
                placeholder='Discounted price'
                className='book-update-discounted-input'
              />
              *
            </div>
          </div>


          <hr style={{ width: "0vw", backgroundColor: "white", margin: "20px 0px 10px 0px" }}></hr>

          <p>IMPORTANT FOR SEO</p>
          {/* Keywords Input */}
          <div className='book-update-form-group'>
            <div className='book-update-form-group-inner'>
              <input
                type='text'
                name='keywords'
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder='Keywords (seperated by comma)'
                className='book-update-keywords-input'
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
                      onClick={() => removeImage(index)}
                    />
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
        </div>
      )}



      {!allField && (
        <div className='use-book-update-all-field-required-div' >
          <div className='use-book-update-all-field-required-div-inner' >
            All the * mark field are Required
            <div className='use-book-update-all-field-required-div-inner-ok' onClick={() => setAllField(true)}>
              ok
            </div>
          </div>

        </div>)
      }
      {isUpdate && (
        <ConfirmationPopup
          message="Are you sure you want to update?"
          onClose={() => setIsUpdate(false)}
          onConfirm={handleUpdate}
          isDelete={false} // indicates it's for update, not delete
        />
      )}
      {isDelete && (
        <ConfirmationPopup
          message="Are you sure you want to delete?"
          onClose={() => setIsDelete(false)}
          onConfirm={handleDelete}
          isDelete={true} // indicates it's for delete
        />
      )}

      {isUpdateSuccessful && (
        <PopupSuccess
          message="product updated successfully!"
          onClose={() => { setIsUpdateSuccessful(false) }}
        />
      )}
      {isDeleteSuccessful && (
        <PopupSuccess
          message="product deleted successfully!"
          onClose={() => { navigate('/user/refurbished') }}
        />
      )}

      {deleteFail && (
        <PopupFail
          message="Failed to delete product!"
          onClose={() => setDeleteFail(false)}
        />
      )}
      {updateFail && (
        <PopupFail
          message="Failed to update product!"
          onClose={() => setUpdateFail(false)}
        />
      )}
      {isDeleting || isUpdating && (
        <div className='user-book-delete-pop-up'>
          <Oval
            height={40}
            width={40}
            color="#4A90E2"
            secondaryColor="#ddd"
            strokeWidth={4}
            strokeWidthSecondary={2}
          />
        </div>
      )}


      <div id='user-refurbished-book-update-footer-div'>
        <div id='user-refurbished-book-update-footer-update' onClick={() => setIsUpdate(true)}>  
          UPDATE
        </div>
        <div id='user-refurbished-book-update-footer-delete' onClick={() => setIsDelete(true)}>
          DELETE
        </div>
      </div>
    </>
  );
};

export default UploadProduct;

