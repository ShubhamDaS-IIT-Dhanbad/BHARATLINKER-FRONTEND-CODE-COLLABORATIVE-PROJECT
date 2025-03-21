import React, { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { FaCaretRight, FaPlus, FaMinus } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { debounce } from "lodash";
import Cookies from 'js-cookie';
import SingleProductSearchBar from "./singlePageSearchbar.jsx";
import AddToCartTab from "./viewCartTab/viewCart.jsx";
import searchProductService from "../appWrite/main/searchProduct.js";
import { addToUserCart, updateCartStateAsync, removeFromUserCart } from "../redux/features/user/cartSlice.jsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./style/singleProduct.css";

const FALLBACK_IMAGE = "http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp";
const MAX_QUANTITY = 5;

const ProductDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { productId } = useParams();

    const [userData, setUserData] = useState(null);
    const { products } = useSelector((state) => state.searchproducts);
    const { cart, totalQuantity, totalPrice } = useSelector((state) => state.userCart);

    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState(FALLBACK_IMAGE);
    const [descriptionSections, setDescriptionSections] = useState([]);

    const cartItem = useMemo(() => cart.find((item) => item?.productId === productId), [cart, productId]);
    const cartQuantity = cartItem?.quantity || 0;

    const parseDescription = (description) => {
        if (!description) return [];

        return description
            .split("#")
            .slice(1) // Remove the first empty split part
            .map((section) => {
                const lines = section.trim().split("\n").map(line => line.trim()).filter(Boolean);
                const heading = lines[0]; // First line after '#' is the heading
                const contentItems = lines.slice(1).map(line => line.startsWith("*") ? line.substring(1).trim() : line);

                return {
                    heading,
                    content: contentItems // Keep content as an array of individual strings
                };
            })
            .filter(section => section.heading && section.content.length);
    };

    const getImageUrl = (imageString) => {
        if (!imageString) return FALLBACK_IMAGE;
        const urlParts = imageString.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1] || '';
        const publicId = publicIdWithExtension.includes('@X@XX@X@')
            ? publicIdWithExtension.split('@X@XX@X@')[1]
            : publicIdWithExtension;
        return publicId ? `https://bharatlinker.publit.io/file/${publicId}` : imageString;
    };

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const product = products.find((p) => p.$id === productId) ||
                    await searchProductService.getProductById(productId);

                if (product) {
                    setProductDetails(product);
                    setSelectedImage(product.images?.[0] ? getImageUrl(product.images[0]) : FALLBACK_IMAGE);
                    setDescriptionSections(parseDescription(product.description));
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

        const userCookie = Cookies.get("BharatLinkerUserData");
        if (userCookie) {
            try {
                setUserData(JSON.parse(userCookie));
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }

        fetchDetails();
    }, [productId, products, navigate]);

    const handleImageClick = useCallback((index) => {
        const imageUrl = productDetail?.images?.[index] ? getImageUrl(productDetail.images[index]) : FALLBACK_IMAGE;
        setSelectedImage(imageUrl);
    }, [productDetail]);

    const handleShopClick = () => {
        if (productDetail?.shopId) navigate(`/shop/${productDetail.shopId}`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productDetail?.title || "Product",
                    text: `Check out this product: ${productDetail?.title || ""}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Error sharing product:", error);
            }
        } else {
            alert("Sharing not supported on this browser.");
        }
    };

    const handleAddToCart = () => {
        if (!userData) return navigate("/login");
        if (!userData.phoneNumber) return navigate("/login");
        if (!productDetail?.shopId) return alert("SHOP DOES NOT EXIST");
        console.log(productDetail)
        dispatch(addToUserCart({
            userId: userData.userId,
            productId: productDetail.$id,
            shopId: productDetail.shopId,
            title: productDetail.title.slice(0, 40),
            price: productDetail.price || 0,
            discountedPrice: productDetail.discountedPrice || productDetail.price || 0,
            quantity: 1,
            productImage: getImageUrl(productDetail.images?.[0]) || FALLBACK_IMAGE,
            shopName: productDetail.shop?.shopName || "Unknown Shop",
            customerPhoneNumber: `91${userData.phoneNumber}`,
            shopEmail: productDetail.shop?.shopEmail || "",
            customerName: userData.name || "user"
        }));
    };

    const debouncedUpdateCart = useCallback(
        debounce((cartId, updatedCart) => {
            dispatch(updateCartStateAsync(cartId, updatedCart));
        }, 500),
        [dispatch]
    );

    const handleUpdateCart = (increment) => {
        if (!userData?.phoneNumber) return navigate("/login");
        if (!cartItem) return;

        const cartId = cartItem.$id;
        const newQuantity = increment
            ? Math.min(cartQuantity + 1, MAX_QUANTITY)
            : Math.max(cartQuantity - 1, 0);

        if (newQuantity === 0) {
            dispatch(removeFromUserCart({ productId: productDetail.$id, cartId }));
        } else {
            debouncedUpdateCart(cartId, {
                productId: productDetail.$id,
                quantity: newQuantity,
                customerName: userData.name || "user"
            });
        }
    };

    return (
        <Fragment>
            <div id="product-details-search-container-top">
                <SingleProductSearchBar heading={"PRODUCT INFO"} />
            </div>

            {loading ? (
                <div className="page-loading-container">
                    <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                </div>
            ) : (
                <Fragment>
                    <div id="product-details-container">
                        <div id="product-details-img">
                            <LazyLoadImage
                                src={selectedImage}
                                alt={productDetail?.title || "Product Image"}
                                effect="opacity"
                                id="product-details-img-selected"
                                placeholderSrc={FALLBACK_IMAGE}
                            />
                        </div>

                        <div id="product-details-thumbnails">
                            {productDetail?.images?.map((image, index) => (
                                <div
                                    key={index}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => handleImageClick(index)}
                                    className={selectedImage === getImageUrl(image)
                                        ? "product-detail-image-select"
                                        : "product-detail-image-unselect"}
                                />
                            ))}
                        </div>

                        <div id="product-details-info">
                            <div id="product-details-title">{productDetail?.title || "Product"}</div>
                            <div className="product-detaile-share" onClick={handleShare} title="Share this product">
                                <RiShareForwardLine size={20} />
                            </div>
                        </div>

                        <div id="product-details-see-all-brand-product">
                            View all products by {productDetail?.brand || "-"}
                            <FaCaretRight
                                onClick={() => productDetail?.brand && navigate(`/search?query=${productDetail.brand}`)}
                                size={20}
                            />
                        </div>

                        <div id="product-details-shop">
                            Shop:{" "}
                            <span onClick={handleShopClick}>
                                {productDetail?.shop?.shopName ?
                                    `${productDetail.shop.shopName.toUpperCase().slice(0, 14)}...`
                                    :
                                    "Loading..."}
                            </span>
                        </div>

                        <div id="product-details-price-button">
                            <div id="searchProductDetails-price-button-inner">
                                <div id="productDetails-discounted-price">
                                    ₹{productDetail?.discountedPrice || productDetail?.price || 0}
                                    <div className="product-detail-discount-container">
                                        {productDetail?.price && productDetail?.discountedPrice &&
                                            productDetail.price > productDetail.discountedPrice ? (
                                            <span>
                                                {Math.round(
                                                    ((productDetail.price - productDetail.discountedPrice) /
                                                        productDetail.price) * 100
                                                )}% off
                                            </span>
                                        ) : (
                                            "No discount"
                                        )}
                                    </div>
                                </div>
                                {productDetail?.price && (!productDetail.discountedPrice ||
                                    productDetail.price > productDetail.discountedPrice) && (
                                        <p id="productDetails-price1">
                                            MRP <span id="productDetails-price2">₹{productDetail.price}</span>
                                        </p>
                                    )}
                            </div>

                            {productDetail?.isInStock && productDetail?.shop?.isShopOpen ? (
                                <div className="product-details-price-instock">
                                    {cartQuantity === 0 ? (
                                        <div onClick={handleAddToCart}>add to cart</div>
                                    ) : (
                                        <div className="product-details-count-container">
                                            <FaMinus size={13} onClick={() => handleUpdateCart(false)} />
                                            {cartQuantity}
                                            <FaPlus size={15} onClick={() => handleUpdateCart(true)} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="product-details-price-outofstock">
                                    ON SITE
                                </div>
                            )}
                        </div>

                        <div className="product-detail-description-container">
                            <div>Product Details</div>
                            <div className="productDetails-lists-description-container">
                                {descriptionSections.length > 0 ? descriptionSections.map((section, index) => (
                                    <div key={index} className="description-section">
                                        <div className="description-heading">{section.heading}</div>
                                        {section.content.map((contentItem, contentIndex) => (
                                            <div className="description-content-p-div" key={contentIndex}>
                                                <div className="dcpdc"></div>
                                                <div className="description-content">{contentItem}</div>
                                            </div>
                                        ))}
                                    </div>
                                )) : (
                                    <div className="description-section">
                                        <div className="description-content">No description available</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div><></>
                    <AddToCartTab totalQuantity={totalQuantity} totalPrice={totalPrice} />
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;