import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "./singleRefurbishedProduct.css";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import SingleRefurbishedProductSearchBar from './singleRefurbishedProductSearchBar.jsx';
import LoadingSingleProduct from "../loading/loadingSingleProduct.jsx";

import { IoCallOutline } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { FaWhatsapp } from "react-icons/fa";

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

    const handleEnter = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const toggleDescription = () => {
        setShowDescription((prev) => !prev);
    };

    const handlePhoneClick = () => {
        if (productDetail && productDetail.phone) {
            window.location.href = `tel:${productDetail.phn}`;
        }
    };

    const handleWhatsappClick = () => {
        console.log("ko")
        if (productDetail && productDetail.phone) {
            window.location.href = `https://wa.me/${productDetail.phn}`;
        }
    };

    return (
        <Fragment>
            <div id='refurbishedProductDetails-search-container-top'>
                <SingleRefurbishedProductSearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleEnter}
                />
            </div>

            {loading ? (
                <LoadingSingleProduct />
            ) : (
                <Fragment>
                    {productDetail ? (
                        <div id="refurbishedProductDetails-container">
                            <div id="refurbishedProductDetails-img">
                                <img src={selectedImage} alt="Selected Product" id="refurbishedProductDetails-img-selected" />
                            </div>

                            <div id="refurbishedProductDetails-info">
                                <span id="refurbishedProductDetails-trending-deals">Trending deal</span>
                                <p id="refurbishedProductDetails-pid">Product # {productDetail.$id}</p>
                                <div id="refurbishedProductDetails-title">{productDetail.title}</div>
                            </div>

                            <div id="refurbishedProductDetail-about" onClick={toggleDescription}>
                                <p>About Product</p>
                                {showDescription ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </div>

                            <div id="refurbishedProductDetails-price-button">
                                <p>₹{productDetail.price}</p>
                                <div id={`refurbishedProductDetails-price-${productDetail.isInStock ? 'instock' : 'outofstock'}`}>
                                    ON SALE
                                </div>
                            </div>

                            {showDescription && (
                                <div id="refurbishedProductDetails-description">
                                    Description: {productDetail.description}
                                </div>
                            )}
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
