import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "./singleProduct.css";
import searchProductService from '../../appWrite/searchProduct.js';
import { FaCaretRight } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import SingleProductSearchBar from './singleProductSearchBar.jsx';
import { RotatingLines } from 'react-loader-spinner';

import { fetchShopById } from '../../redux/features/singleShopSlice.jsx';
import { RiShareForwardLine } from "react-icons/ri";

const fallbackImage = 'http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp';

const ProductDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.searchproducts);
    const { shops } = useSelector((state) => state.searchshops);
    const { singleShops } = useSelector((state) => state.singleshops);

    const { productId } = useParams();
    const [descriptionSections, setDescriptionSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetails] = useState(null);
    const [shopDetail, setShopDetail] = useState(null);
    const [selectedImage, setSelectedImage] = useState(fallbackImage);
    const [showDescription, setShowDescription] = useState(false);

    const parseDescription = (description) => {
        if (!description) return [];
        const sections = description.split("#").slice(1);
        return sections.map((section) => {
            const [heading, ...contents] = section.split("*");
            return { heading: heading.trim(), content: contents.join("*").trim() };
        });
    };

    const fetchShopDetails = async (shopId) => {
        if (!shopId) return;

        const shop =
            [...shops, ...singleShops].find((shop) => shop.$id === shopId) ||
            (await dispatch(fetchShopById(shopId))).payload;

        if (shop) {
            setShopDetail(shop);
        } else {
            console.error("Shop not found");
        }
    };

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            const product =
                products.find((product) => product.$id === productId) ||
                (await searchProductService.getProductById(productId));

            if (product) {
                setProductDetails(product);
                setSelectedImage(product?.images[0] || fallbackImage);
                setDescriptionSections(parseDescription(product?.description));
                await fetchShopDetails(product?.shop);
            } else {
                navigate("/404");
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            navigate("/404");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: productDetail?.title || "Product",
                    text: `Check out this product: ${productDetail?.title || ""}`,
                    url: window.location.href,
                })
                .then(() => console.log("Product shared successfully"))
                .catch((error) => console.error("Error sharing product:", error));
        } else {
            alert("Sharing not supported on this browser.");
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
                                    <div className="product-detaile-share" onClick={handleShare}>
                                        <RiShareForwardLine size={20} />
                                    </div>
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
                                        <div id="productDetails-discounted-price">₹{productDetail?.discountedPrice} <div className="product-detail-discount-container">
                                            {productDetail?.price && productDetail?.discountedPrice ? (
                                                <>
                                                    <span>
                                                        {Math.round(
                                                            ((productDetail.price - productDetail.discountedPrice) / productDetail.price) * 100
                                                        )}% off
                                                    </span>
                                                </>
                                            ) : (
                                                "Price not available"
                                            )}
                                        </div>
                                        </div>
                                        <p id="productDetails-price1">MRP <p id="productDetails-price2">₹{productDetail?.price}</p></p>
                                    </div>
                                    <div id={`product-details-price-${productDetail?.isInStock ? 'instock' : 'outofstock'}`}>
                                        {productDetail?.isInStock ? 'Add to cart' : 'OUT OF STOCK'}
                                    </div>
                                </div>

                                <div className="product-detail-description-container">
                                    <div>Product Details</div>
                                    <div className="productDetails-lists-description-container">
                                        {descriptionSections?.map((section, index) => (
                                            <div key={index} className="description-section">
                                                <div className="description-heading">{section.heading}</div>
                                                <div className="description-content">{section.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
