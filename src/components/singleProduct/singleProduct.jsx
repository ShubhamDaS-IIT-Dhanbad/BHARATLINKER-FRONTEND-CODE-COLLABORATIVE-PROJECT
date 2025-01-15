import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "./singleProduct.css";
import searchProductService from '../../appWrite/searchProduct.js';
import { FaCaretRight } from "react-icons/fa";
import { HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";
import { useDispatch, useSelector } from 'react-redux';
import SingleProductSearchBar from './singleProductSearchBar.jsx';

import { RotatingLines } from 'react-loader-spinner';

import { fetchShopById } from '../../redux/features/singleShopSlice.jsx';
import { IoClose } from 'react-icons/io5';
import { BsQuestionCircle } from "react-icons/bs";

const fallbackImage = 'http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp';

const ProductDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.searchproducts);
    const { shops } = useSelector((state) => state.searchshops);
    const { singleShops } = useSelector((state) => state.singleshops);

    const { productId } = useParams();

    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetails] = useState(null);
    const [shopDetail, setShopDetail] = useState(null);
    const [selectedImage, setSelectedImage] = useState(fallbackImage);
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true); // Ensure loading starts
            let product = products.find((product) => product.$id === productId);

            if (product) {
                setProductDetails(product);
                setSelectedImage(product?.images[0] || fallbackImage);
                fetchShopDetails(product?.shop);
            } else {
                try {
                    const response = await searchProductService.getProductById(productId);
                    if (response) {
                        setProductDetails(response);
                        setSelectedImage(response?.images[0] || fallbackImage);
                        fetchShopDetails(response?.shop);
                    }
                } catch (error) {
                    console.error("Error fetching product details: ", error);
                    navigate('/404');
                }
            }

            setLoading(false);
        };

        const fetchShopDetails = async (shopId) => {
            if (!shopId) return;
            const combinedShops = [...shops, ...singleShops];
            const shop = combinedShops?.find((shop) => shop.$id === shopId);

            if (shop) {
                setShopDetail(shop);
            } else {
                try {
                    const response = await dispatch(fetchShopById(shopId));
                    if (response) {
                        setShopDetail(response?.payload);
                    }
                } catch (error) {
                    console.error("Error fetching shop details: ", error);
                }
            }
        };

        fetchProductDetails();
    }, []);


    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    const handleImageClick = (index) => {
        setSelectedImage(productDetail?.images[index]);
    };

    const handleShopClick = () => {
        if (shopDetail) {
            navigate(`/shop/${shopDetail?.$id}`);
        }
    };

    return (
        <Fragment>
            <div id='product-details-search-container-top'>
                <SingleProductSearchBar />
            </div>

            {loading ? (
                <div className="refurbished-page-loading-container">
                    <RotatingLines width="60" height="60" color="#007bff" />
                </div>
            ) : (
                <Fragment>
                    {productDetail && (
                        <>
                            <div id="product-details-container">
                                <div id="product-details-img">
                                    <img src={selectedImage} alt="Selected Product" id="product-details-img-selected" />
                                </div>
                                <div id="product-details-thumbnails">
                                    {productDetail?.images?.map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleImageClick(index)}
                                            className={selectedImage === image ? "product-detail-image-select" : "product-detail-image-unselect"}
                                        >
                                        </div>
                                    ))}
                                </div>


                                <div id="product-details-info">
                                    <div id="product-details-title">{productDetail?.title}</div>
                                </div>

                                <div
                                    id="product-details-see-all-brand-product"
                                    onClick={() => navigate(`/search?query=${productDetail?.brand}`)}
                                >
                                    View all products by {productDetail ? productDetail?.brand : "-"}< FaCaretRight size={20} />
                                </div>

                                <div
                                    id="product-details-shop"
                                    onClick={handleShopClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Shop: {shopDetail ? shopDetail?.shopName.toUpperCase() : 'Loading...'}
                                </div>





                                <div id="product-details-price-button">
                                    <div id="searchProductDetails-price-button-inner">
                                        <div id="productDetails-discounted-price">₹{productDetail?.discountedPrice}</div>
                                        <p id="productDetails-price1">MRP <p id="productDetails-price2">₹{productDetail?.price}</p></p>
                                    </div>
                                    <div id={`product-details-price-${productDetail?.isInStock ? 'instock' : 'outofstock'}`}>
                                        {productDetail?.isInStock ? 'Add to cart' : 'OUT OF STOCK'}
                                    </div>
                                </div>






                                {showDescription && (
                                    <div className="productDetails-description-div-pop-up">
                                        <div
                                            className="productDetails-description-div-pop-up-close"
                                            onClick={toggleDescription}
                                            aria-label="Close filter options"
                                        >
                                            <IoClose size={30} />
                                        </div>
                                        <div className="productDetails-filter-section-title">PRODUCT DETAILS</div>

                                        <div className="productDetails-lists-description-container">
                                            <div className="productDetails-lists-description">
                                                {productDetail?.brand && productDetail?.brand !== '' && <>Brand: {productDetail.brand} <br></br> </>}
                                                {productDetail?.category && productDetail?.category !== '' && <>Category: {productDetail.category} <br></br></>}
                                            </div>
                                            <div id="productDetails-description">
                                                {productDetail.description}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
