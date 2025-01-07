import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "./singleRefurbishedProduct.css";

import { useDispatch, useSelector } from 'react-redux';
import SingleRefurbishedProductSearchBar from './singleRefurbishedProductSearchBar.jsx';
import LoadingSingleProduct from "../loading/loadingSingleProduct.jsx";

const ProductDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { refurbishedProducts } = useSelector((state) => state.refurbishedproducts);
    const { refurbishedId } = useParams();

    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            let product = refurbishedProducts.find((product) => product.$id === refurbishedId);
            if (product) {
                setProductDetails(product);
                setSelectedImage(product.images[0] || 'http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp');
            } else {
                navigate('/refurbished');
            }
            setLoading(false);
        };

        fetchProductDetails();
    }, [refurbishedProducts, refurbishedId, navigate]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePhoneClick = () => {
        if (productDetail && productDetail.phn) {
            window.location.href = `tel:${productDetail.phn}`;
        }
    };

    const handleWhatsappClick = () => {
        if (productDetail && productDetail.phn) {
            window.location.href = `https://wa.me/${productDetail.phn}`;
        }
    };

    const handleImageClick = (index) => {
        setSelectedImage(productDetail.images[index]);
    };

    const toggleDescription = () => setShowDescription(!showDescription);

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) : text;
    };

    return (
        <Fragment>
            <SingleRefurbishedProductSearchBar />

            {loading ? (
                <LoadingSingleProduct />
            ) : (
                <Fragment>
                    {productDetail ? (
                        <div id="refurbishedProductDetails-container">
                            <div id="refurbishedProductDetails-img">
                                <img src={selectedImage} alt="Selected Product" id="refurbishedProductDetails-img-selected" />
                            </div>
                            {/* Image dots */}
                            <div id="shop-details-thumbnails">
                                {productDetail.images.map((image, index) => (
                                    <span
                                        key={index}
                                        className={`single-refurbished-product-image-dot ${selectedImage === image ? 'selected' : 'unselected'}`}
                                        onClick={() => handleImageClick(index)}
                                    ></span>
                                ))}
                            </div>
                            <div id="refurbishedProductDetails-info">
                                <span id="refurbishedProductDetails-trending-deals">Trending deal</span>
                                <p id="refurbishedProductDetails-pid">Product # {productDetail.$id}</p>
                                <div id="refurbishedProductDetails-title">
                                    {productDetail.title}
                                </div>
                            </div>

                            <div id="refurbishedProductDetails-price-button">
                                <div id="refurbishedProductDetails-price-button-inner">
                                    <p id="refurbishedProductDetails-price">₹{productDetail.price}</p>
                                    <p id="refurbishedProductDetails-discounted-price">₹{productDetail.discountedPrice}</p>
                                </div>
                                <div id='refurbishedProductDetails-on-sale'>
                                    ON SALE
                                </div>
                            </div>

                            <div className="refurbishedProductDetails-description">
                                <div className="refurbishedProductDetails-description-text">DESCRIPTION</div>
                                
                                    {showDescription ? productDetail.description : truncateText(productDetail.description, 100)}
                                    <span onClick={toggleDescription} id="refurbishedProductDetails-description-read-more-text">
                                        {showDescription ? " ..read less" : "  read more.."}
                                    </span>
                                
                            </div>
                        </div>
                    ) : (
                        <p>Product not found.</p>
                    )}
                </Fragment>
            )}

            <div id='refurbishedProductSearchPage-footer'>
                <div id='refurbishedProductSearchPage-footer-sortby' onClick={handlePhoneClick}>
                    PHONE
                </div>
                <div id='refurbishedProductSearchPage-footer-filterby' onClick={handleWhatsappClick}>
                    WHATSAPP
                </div>
            </div>
        </Fragment>
    );
};

export default ProductDetails;


{/* <div id="refurbishedProductDetail-about" onClick={toggleDescription}>
                                About Product
                            </div>
                            {showDescription && (
                                <div id="refurbishedProductDetails-description">
                                    Description: {productDetail.description}
                                </div>
                            )} */}