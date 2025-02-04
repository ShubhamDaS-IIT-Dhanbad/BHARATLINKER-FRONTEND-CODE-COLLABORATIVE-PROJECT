import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { FaCaretRight, FaPlus, FaMinus } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";

import SingleProductSearchBar from "./singlePageSearchbar.jsx";
import AddToCartTab from "./viewCartTab/viewCart.jsx";

import searchProductService from "../appWrite/searchProduct.js";
import { addToUserCart, fetchUserCart, updateCartStateAsync, removeFromUserCart } from "../redux/features/user/cartSlice.jsx";

import { LazyLoadImage } from "react-lazy-load-image-component";

import "react-lazy-load-image-component/src/effects/blur.css";
import "./style/singleProduct.css";

const fallbackImage = "http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp";
const ProductDetails = ({ userData }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { productId } = useParams();

    const { products } = useSelector((state) => state.searchproducts);
    const { cart, totalQuantity, totalPrice } = useSelector((state) => state.userCart);

    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState(fallbackImage);
    const [descriptionSections, setDescriptionSections] = useState([]);

    const cartItem = useMemo(() => cart.find((item) => item?.productId === productId), [cart, productId]);
    const cartQuantity = cartItem ? cartItem?.quantity : 0;

    const parseDescription = (description) => {
        if (!description) return [];
        return description
            .split("#")
            .slice(1)
            .map((section) => {
                const [heading, ...contents] = section.split("*");
                return { heading: heading.trim(), content: contents.join("*").trim() };
            });
    };

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const product =
                    products.find((product) => product.$id === productId) ||
                    (await searchProductService.getProductById(productId));
                if (product) {
                    setProductDetails(product);
                    setSelectedImage(product?.images.length > 0 ? product?.images[0] || fallbackImage : fallbackImage);
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
        fetchDetails();
    }, []);

    useEffect(() => {
        if (cart.length === 0 && userData?.$id) {
            const userId = userData?.$id;
            dispatch(fetchUserCart(userId));
        }
    }, []);

    const handleImageClick = (index) => setSelectedImage(productDetail?.images[index]);
    const handleShopClick = () => productDetail.shopId && navigate(`/shop/${productDetail.shopId}`);
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


    const handleAddToCart = async () => {
        if (!userData?.phoneNumber) { navigate("/login"); return; }
        if (!productDetail.shops.$id) { alert("SHOP DOES NOT EXIST"); return; }
        const cartItem = {
            userId: userData.$id,
            productId: productDetail.$id,
            shopId: productDetail.shopId,
            title: productDetail.title,
            price: productDetail.price,
            discountedPrice: productDetail.discountedPrice || productDetail.price,
            quantity: 1,
            productImage: productDetail?.images[0],
            phoneNumber: userData.phoneNumber,
            shopEmail: productDetail.shops.email,
            customerName: userData.name
        };
        await dispatch(addToUserCart(cartItem));
    };

    const handleUpdateCart = async (increment = true) => {
        if (!userData?.phoneNumber) { navigate("/login"); return; }
        const cartId = cartItem.$id;
        if (increment) {
            const updatedCart = {
                productId: productDetail.$id,
                quantity: cartQuantity + 1,
                customerName: userData.name
            };
            await dispatch(updateCartStateAsync(cartId, updatedCart));
        } else {
            if (cartQuantity > 1) {
                const updatedCart = {
                    productId: productDetail.$id,
                    quantity: cartQuantity - 1,
                    customerName: userData.name
                };
                await dispatch(updateCartStateAsync(cartId, updatedCart));
            } else {
                await dispatch(removeFromUserCart({ productId: productDetail.$id, cartId }));
            }
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
                                alt={`Prouct Image`}
                                effect="opacity"
                                id="product-details-img-selected"
                            />
                        </div>

                        <div id="product-details-thumbnails">
                            {productDetail?.images?.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleImageClick(index)}
                                    className={selectedImage === image ? "product-detail-image-select" : "product-detail-image-unselect"}
                                />
                            ))}
                        </div>
                        <div id="product-details-info">
                            <div id="product-details-title">{productDetail?.title}</div>
                            <div className="product-detaile-share" onClick={handleShare} title="Share this product">
                                <RiShareForwardLine size={20} />
                            </div>
                        </div>
                        <div id="product-details-see-all-brand-product">
                            View all products by {productDetail?.brand || "-"}
                            <FaCaretRight onClick={() => navigate(`/search?query=${productDetail?.brand}`)} size={20} />
                        </div>
                        <div id="product-details-shop">
                            Shop:{" "}
                            <span onClick={handleShopClick}>{productDetail?.shops?.shopName ? productDetail.shops?.shopName?.toUpperCase() : "Loading..."}</span>
                        </div>
                        <div id="product-details-price-button">
                            <div id="searchProductDetails-price-button-inner">
                                <div id="productDetails-discounted-price">
                                    ₹{productDetail?.discountedPrice}
                                    <div className="product-detail-discount-container">
                                        {productDetail?.price && productDetail?.discountedPrice ? (
                                            <span>
                                                {Math.round(
                                                    ((productDetail.price - productDetail.discountedPrice) / productDetail.price) * 100
                                                )}
                                                % off
                                            </span>
                                        ) : (
                                            "Price not available"
                                        )}
                                    </div>
                                </div>
                                <p id="productDetails-price1">
                                    MRP <span id="productDetails-price2">₹{productDetail?.price}</span>
                                </p>
                            </div>
                            <div id={`product-details-price-${productDetail?.isInStock ? "instock" : "outofstock"}`}>
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
                    <AddToCartTab totalQuantity={totalQuantity} totalPrice={totalPrice} />
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
