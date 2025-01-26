import React, { useState, useEffect } from 'react';
import { Oval } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct, deleteProduct } from '../../../appWrite/uploadProduct/upload.js';
import { resetProducts, deleteProductS } from '../../../redux/features/retailer/product.jsx';
import Cookies from 'js-cookie';

import '../upload/upload.css';

const UploadBooksModulesForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const [formData, setFormData] = useState({
        class: '',
        language: '',
        subject: '',
        title: '',
        description: '',
        price: '',
        discountedPrice: '',
        keywords: ''
    });

    const [images, setImages] = useState([null, null, null]);

    useEffect(() => {
        setLoading(true);
        const userSession = Cookies.get('BharatLinkerShopData');


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
                    images: productImages,
                } = product;

                setFormData({
                    title,
                    description,
                    price,
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


    const handleUpdate = async () => {
        setIsUpdate(false);
        setIsUpdating(true);
        const { title, description, price, discountedPrice } = formData;
        if (![title, price, discountedPrice, description].every(Boolean)) {
            setAllFieldEntered(false);
            return;
        } const updatedData = formData;

        try {
            await updateProduct(productId, toDeleteImagesUrls, updatedData, images);
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

    const ConfirmationPopup = ({ message, onClose, onConfirm }) => (
        <div className='logout-pop-up'>
            <div className='logout-pop-up-inner-div'>
                <div className='logout-pop-up-inner-div-logout-statement'>
                    {message}
                </div>
                <div className='logout-pop-up-inner-div-no-yes'>
                    <div className='logout-pop-up-inner-div-no' onClick={onClose}>
                        No
                    </div>
                    <div className='logout-pop-up-inner-div-yes' onClick={onConfirm}>

                        Yes

                    </div>
                </div>
            </div>
        </div>
    );

    const PopupSuccess = ({ message, onClose }) => (
        <div className='logout-pop-up'>
            <div className='logout-pop-up-inner-div-pop-up-success'>
                <div className='logout-pop-up-inner-div-pop-up-success-msg'>
                    {message}
                </div>
                <div className='logout-pop-up-inner-div-ok' onClick={onClose}>
                    ok
                </div>
            </div>
        </div>
    );

    const PopupFail = ({ message, onClose }) => (
        <div className='logout-pop-up'>
            <div className='logout-pop-up-inner-div-pop-up-fail'>
                <div className='logout-pop-up-inner-div-pop-up-fail-msg'>
                    {message}
                </div>
                <div className='logout-pop-up-inner-div-ok' onClick={onClose}>
                    ok
                </div>
            </div>
        </div>
    );

    const handleImageChange = (index, file) => {
        if (file) {
            const updatedImages = [...images];
            updatedImages[index] = file;
            setImages(updatedImages);
            console.log(updatedImages, file)
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
            <div className="retailer-upload-product-form" style={{ marginTop: "37px" }}>
                <div className='user-refurbished-product-title-description-div'>
                    <textarea
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter book title"
                        className='retailer-upload-product-form-textarea'
                        style={{ maxWidth: "90vw", minHeight: "10vh" }}
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter book description"
                        className='retailer-upload-product-form-textarea'
                        style={{ maxWidth: "90vw", minHeight: "90vh" }}
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
                        className='retailer-upload-product-form-textarea'
                    />
                    <textarea
                        type="number"
                        name="discountedPrice"
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder="Enter discounted price"
                        style={{ maxWidth: "90vw", height: "4vh" }}
                        className='retailer-upload-product-form-textarea'
                    />
                </div>

                <div className="product-keywords">
                    <textarea
                        type="text"
                        name="keywords"
                        value={formData.keywords || ""
                        }
                        onChange={handleInputChange}
                        placeholder="Enter product keywords (comma-separated)"
                        style={{ maxWidth: "90vw", height: "10vh" }}
                        className="retailer-upload-product-form-textarea"
                    />
                </div>



                <div className="retailer-upload-form-image-section">
                    {images.map((image, index) => (
                        <div key={index} className="product-image-upload">
                            {!image ? (<>

                                <div className="retailer-upload-form-uploaded-image-container">
                                    <img
                                        src="https://res.cloudinary.com/demc9mecm/image/upload/v1737885176/yjev692kuftvpxzbzpcj.jpg"

                                        alt={`Uploaded ${index + 1}`}
                                        className="retailer-upload-form-uploaded-image"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                                    />
                                </div>

                            </>
                            ) : (
                                <div className="retailer-upload-form-uploaded-image-container">
                                    <img
                                        className="retailer-upload-form-uploaded-image"
                                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                        alt={`Product Image ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="remove-image-button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>




                <div
                    className={`retailer-upload-product-form-delete`}
                    onClick={() => setIsDelete(true)}
                >
                    {isDeleting ? <Oval height={20} width={20} color="white" visible={true} /> : "Delete Product"}
                </div>
                <div
                    className={`retailer-upload-product-form-submit`}
                    onClick={() => setIsUpdate(true)}
                >
                    {isUpdating ? <Oval height={20} width={20} color="white" visible={true} /> : "Update Product"}
                </div>
            </div>


            <div className="form-actions">
                {isDelete && (
                    <ConfirmationPopup
                        message="Are you sure you want to delete this product?"
                        onClose={() => setIsDelete(false)}
                        onConfirm={handleDelete}
                        isDelete={true}
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

                {isUpdateSuccessful && (
                    <PopupSuccess
                        message="Product updated successfully!"
                        onClose={() => setIsUpdateSuccessful(false)}
                    />
                )}

                {isDeleteSuccessful && (
                    <PopupSuccess
                        message="Product deleted successfully!"
                        onClose={() => setIsDeleteSuccessful(false)}
                    />
                )}

                {updateFail && (
                    <PopupFail
                        message="Failed to update product. Please try again."
                        onClose={() => setUpdateFail(false)}
                    />
                )}

                {deleteFail && (
                    <PopupFail
                        message="Failed to delete product. Please try again."
                        onClose={() => setDeleteFail(false)}
                    />
                )}
            </div>
        </>
    );
};

export default UploadBooksModulesForm;

