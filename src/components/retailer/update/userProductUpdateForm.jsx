import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { Oval } from 'react-loader-spinner';
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandAirtable } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {updateProduct, deleteProduct} from '../../../appWrite/uploadProduct/upload.js'
import { resetProducts,deleteProductS } from '../../../redux/features/retailer/product.jsx';

import Cookies from 'js-cookie';
const UploadBooksModulesForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selected, setSelected] = useState("");
    const [coordinates, setCoordinates] = useState({ lat: null, long: null });
    const [fetching, setFetching] = useState(false);


    const productId = useParams('id');
    const products = useSelector((state) => state.retailerProducts.products);

    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);
    const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);

    const [deleteFail, setDeleteFail] = useState(false);
    const [updateFail, setUpdateFail] = useState(false);

    const [toDeleteImagesUrls, setToDeleteImagesUrls] = useState([]);

    const [popUpState, setPopUpState] = useState({
        classPopUp: false,
        subjectPopUp: false,
        languagePopUp: false,
        categoryPopUp: false,
        brandPopUp: false,
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
        category: '', // Ensure this is initialized
        brand: ''
    });

    const [images, setImages] = useState([null, null, null]);

    useEffect(() => {
        setLoading(true);

        // Retrieve user data from cookies
        const userSession = Cookies.get('BharatLinkerShopData');

        if (userSession) {
            const parsedUserData = JSON.parse(userSession);
            if (parsedUserData.lat && parsedUserData.long) {
                setCoordinates({ lat: parsedUserData.lat, long: parsedUserData.long });
            }
        }

        // Check product ID and load product data
        if (productId) {
            const product = products.find((product) => product.$id === productId.id);

            if (!product) {
                navigate('/retailer/products');
            } else {
                const {
                    title,
                    description,
                    price,
                    discountedPrice,
                    keywords,
                    category,
                    brand,
                    images: productImages,
                } = product;

                setFormData({
                    title,
                    description,
                    price,
                    category,
                    brand,
                    discountedPrice,
                    keywords,
                });

                const paddedImages = [...productImages, null, null, null].slice(0, 3);
                setImages(paddedImages);
            }
        }

        setLoading(false);

    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleCurrentLocationClick = () => {

        setFetching(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoordinates({ lat: latitude, long: longitude });
                    console.log("Latitude:", latitude, "Longitude:", longitude);
                },
                (error) => {
                    setSelected("SHOP LOCATION");
                    console.error("Error retrieving location:", error.message);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setSelected("SHOP LOCATION");
        }
        setFetching(false);
    };
    

    const handleCategorySelect = (selectedCategory) => {
        setFormData((prevFormData) => ({ ...prevFormData, category: selectedCategory }));
        setPopUpState((prevState) => ({ ...prevState, categoryPopUp: false }));
    };

    const handleBrandSelect = (selectedBrand) => {
        setFormData((prevFormData) => ({ ...prevFormData, brand: selectedBrand }));
        setPopUpState((prevState) => ({ ...prevState, brandPopUp: false }));
    };

    const [allFieldEntered, setAllFieldEntered] = useState(true);

    const handleUpdate = async () => {
        setIsUpdate(false);
        setIsUpdating(true);
        const { title, price, discountedPrice } = formData;
        if (![title, price, discountedPrice].every(Boolean)) {
            setAllFieldEntered(false);
            return;
        }

        if (!coordinates.lat || !coordinates.long) {
            alert('Your Address Location is not set or error in retriving location -> go to PROFILE and set LOCATION');  // Popup message
            return;
        }

        try {
            await updateProduct(productId, toDeleteImagesUrls, { ...formData, lat: coordinates.lat, long: coordinates.long }, images);
            setIsUpdateSuccessful(true);
            dispatch(resetProducts());
        } catch (error) {
            setUpdateFail(true);
            console.error('Error updating product:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setIsDelete(false);
        try {
            await deleteProduct(productId, toDeleteImagesUrls);
            dispatch(deleteProductS(productId));
            setIsDeleteSuccessful(true);
            console.log('Product deleted successfully.');
        } catch (error) {
            setDeleteFail(true);
            console.error('Error deleting product:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const ConfirmationPopup = ({ message, onClose, onConfirm, isDelete }) => (
        <div className={`user-refurbished-book-module-${isDelete ? 'delete' : 'update'}-popup`}>
            <div className={`user-refurbished-book-module-${isDelete ? 'delete' : 'update'}-popup-inner`}>
                <div className={`user-refurbished-book-module-${isDelete ? 'delete' : 'update'}-popup-message`}>
                    {message}
                </div>
                <div className={`user-refurbished-book-module-${isDelete ? 'delete' : 'update'}-popup-options`}>
                    <div className={`user-refurbished-book-module-${isDelete ? 'delete' : 'update'}-popup-option-no`} onClick={onClose}>
                        No
                    </div>
                    <div className={`user-refurbished-book-module-${isDelete ? 'delete' : 'update'}-popup-option-yes`} onClick={onConfirm}>
                        Yes
                    </div>
                </div>
            </div>
        </div>
    );

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
                                {/^[a-zA-Z]/.test(item)
                                    ? item.charAt(0).toUpperCase() + item.slice(1)
                                    : item}
                            </div>
                        ))}
                    </div>
                </div>
            )
        );
    };

    const handleImageChange = (index, file) => {
        if (file) {
            const updatedImages = [...images];
            updatedImages[index] = file; // Store the file
            setImages(updatedImages);
        }
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        const imageUrl = updatedImages[index];
        if (imageUrl && isValidUrl(imageUrl)) {
            setToDeleteImagesUrls((prevUrls) => [...prevUrls, imageUrl]);
        }
        updatedImages[index] = null;
        setImages(updatedImages);
    };
    const isValidUrl = (url) => {
        const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return regex.test(url);
    };



    return (
        <>




            <div className="user-refurbished-product-book-module-update-form">




                <>
                    <div className='user-refurbished-product-category-brand-div' style={{ display: "flex", gap: "5px", marginTop: "90px", marginBottom: "17px" }}>
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
                {renderPopUp('categoryPopUp', ['category', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], handleCategorySelect)}
                {renderPopUp('brandPopUp', ['brand', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], handleBrandSelect)}



                <div className='user-refurbished-product-title-description-div'>
                    <textarea
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter book title"
                        className='user-refurbished-product-book-module-update-form-textarea'
                        style={{ maxWidth: "90vw", minHeight: "10vh" }}
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter description"
                        className='user-refurbished-product-book-module-update-form-textarea'
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
                        className='user-refurbished-product-book-module-update-form-textarea'
                    />
                    <textarea
                        type="number"
                        name="discountedPrice"
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder="Enter discounted price"
                        style={{ maxWidth: "90vw", height: "4vh" }}
                        className='user-refurbished-product-book-module-update-form-textarea'
                    />
                </div>

                <textarea
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className='user-refurbished-product-book-module-update-form-textarea'
                    style={{ maxWidth: "90vw", minHeight: "20vh" }}
                />

                <div className="user-refurbished-product-book-module-update-form-image-section">
                    {images.map((image, index) => (
                        <div key={index} className="user-refurbished-product-book-module-update-form-image-container">
                            {image ? (
                                <img
                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                    className="user-refurbished-product-book-module-update-form-uploaded-image"
                                    alt={`Uploaded ${index + 1}`}
                                    onClick={() => removeImage(index)}
                                    onLoad={(e) => {
                                        if (typeof image !== 'string') URL.revokeObjectURL(e.target.src);
                                    }}
                                />
                            ) : (
                                <div
                                    className="user-refurbished-product-book-module-update-form-image-placeholder"
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

                <div id="user-refurbished-product-book-module-upload-location">
                    <div
                        className={`user-refurbished-product-book-module-upload-location-p ${selected === "CURRENT LOCATION" ? "selected" : ""
                            }`}
                        onClick={() => { setSelected("CURRENT LOCATION"); handleCurrentLocationClick(); }}
                    >
                        {fetching ? 'Fetching...' : 'CURRENT LOCATION'}
                    </div>
                    <div
                        className={`user-refurbished-product-book-module-upload-location-p ${selected === "ADDRESS LOCATION" ? "selected" : ""
                            }`}
                        onClick={() => setSelected("ADDRESS LOCATION")}
                    >
                        SHOP LOCATION
                    </div>
                </div>



                <div id='user-refurbished-book-product-footer'>
                    <div id='user-refurbished-book-product-update' onClick={() => setIsUpdate(true)}>
                        UPDATE
                    </div>
                    <div id='user-refurbished-book-product-delete' onClick={() => setIsDelete(true)}>
                        DELETE
                    </div>
                </div>


            </div>

            {!allFieldEntered && (
                <PopupSuccess message="All fields are required!" onClose={() => { setAllFieldEntered(true) }} isSuccess={false} />
            )}
            {(loading || isDeleting || isUpdating) && (
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


            {isDelete && (
                <ConfirmationPopup
                    message="Are you sure you want to delete this product?"
                    onClose={() => setIsDelete(false)}
                    onConfirm={handleDelete}
                    isDelete
                />
            )}

            {isUpdate && (
                <ConfirmationPopup
                    message="Are you sure you want to update this product?"
                    onClose={() => setIsUpdate(false)}
                    onConfirm={handleUpdate}
                    isDelete={false}
                />
            )}

            {isDeleteSuccessful && (<PopupSuccess message="Product deleted successfully!" onClose={() => navigate('/retailer/products')} />)}
            {isUpdateSuccessful && (<PopupSuccess message="Product updated successfully!" onClose={() => setIsUpdateSuccessful(false)} />)}

            {deleteFail && <PopupFail message="Failed to delete product. Please try again!" onClose={() => setDeleteFail(false)} />}
            {updateFail && <PopupFail message="Failed to update product. Please try again!" onClose={() => setUpdateFail(false)} />}
        </>
    );
};

export default UploadBooksModulesForm;
