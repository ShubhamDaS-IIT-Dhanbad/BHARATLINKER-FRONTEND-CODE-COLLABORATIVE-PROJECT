import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./singleProduct.css";
import searchProductService from "../../appWrite/searchProduct.js";
import { FaCaretRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SingleProductSearchBar from "./singleProductSearchBar.jsx";
import { RotatingLines } from "react-loader-spinner";
import { fetchShopById } from "../../redux/features/singleShopSlice.jsx";
import { RiShareForwardLine } from "react-icons/ri";
import AddToCartTab from "../viewCartTab/viewCart.jsx";

import { updateCartByPhoneNumber } from '../../appWrite/userData/userData.js'
import Cookies from 'js-cookie'
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

import MyCart from '../user/myCart/myCart.jsx';
const fallbackImage = "http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp";

const ProductDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.searchproducts);
    const { shops } = useSelector((state) => state.searchshops);
    const { singleShops } = useSelector((state) => state.singleshops);

    const [count, setCount] = useState(0);
    const { productId } = useParams();
    const [descriptionSections, setDescriptionSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetails] = useState(null);
    const [shopDetail, setShopDetail] = useState(null);
    const [selectedImage, setSelectedImage] = useState(fallbackImage);

    const [cart, setCart] = useState([]);
    const [showMyCart, setShowMyCart] = useState(false);

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
        if (shop) setShopDetail(shop);
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

    const handleAddToCart = () => {
        try {
             const userDataCookie = Cookies.get('BharatLinkerUser');
            if (!userDataCookie) {
                window.location.href = '/login';
                return;
            }

            // Parse the user data from the cookie
            const userData = JSON.parse(decodeURIComponent(userDataCookie));

            // Create the updated cart item
            const updatedCartItem = {
                id: productDetail.$id,
                price: productDetail.price,
                discountedPrice: productDetail.discountedPrice,
                lat: productDetail.lat,
                long: productDetail.long,
                count: 1,
            };

            // Update the cart
            const updatedCart = [...(userData.cart || []), updatedCartItem];
            userData.cart = updatedCart;
            document.cookie = `BharatLinkerUserData=${encodeURIComponent(JSON.stringify(userData))}; path=/`;

            // Update the cart data on the backend
            updateCartData(updatedCart);
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };



    const handleImageClick = (index) => setSelectedImage(productDetail?.images[index]);
    const handleShopClick = () => shopDetail && navigate(`/shop/${shopDetail?.$id}`);

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



    const checkProductInCart = () => {
        if (!productId) return;

        try {
            const userData = JSON.parse(
                decodeURIComponent(
                    document.cookie.replace(
                        /(?:(?:^|.*;\s*)BharatLinkerUserData\s*\=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )
                )
            );
            let cart = userData?.cart || [];

            // Remove any duplicate products by productId
            cart = cart.filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );

            // Update the cart in the cookie after removing duplicates
            userData.cart = cart;
            document.cookie = `BharatLinkerUserData=${encodeURIComponent(
                JSON.stringify(userData)
            )}; path=/`;

            // Check if the product is in the cart
            const productInCart = cart.find((item) => item.id === productId);
            setCart(userData.cart);
            if (productInCart) {
                setCount((prev) => Math.max(productInCart.count, 0));
            } else {
                setCount(0);
            }
        } catch (error) {
            console.error("Error checking product in cart:", error);
        }
    };



    const handleIncrement = () => {
        try {
            const userData = JSON.parse(
                decodeURIComponent(
                    document.cookie.replace(
                        /(?:(?:^|.*;\s*)BharatLinkerUserData\s*\=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )
                )
            );
            const cart = userData.cart || [];
            const productIndex = cart.findIndex((item) => item.id === productId);

            if (productIndex !== -1) {

                const updatedCart = [...cart];
                if (updatedCart[productIndex].count == 3) {
                    alert("maximum 3 element can be selected");
                    return;
                }

                updatedCart[productIndex].count += 1;
                updatedCart[productIndex].price = productDetail.price;
                updatedCart[productIndex].discountedPrice = productDetail.discountedPrice;
                setCount((prev) => prev + 1);
                updateCartData(updatedCart);
            } else {
                console.error("Product not found in cart!");
            }
        } catch (error) {
            console.error("Error incrementing product count:", error);
        }
    };

    const handleDecrement = () => {
        try {
            const userData = JSON.parse(
                decodeURIComponent(
                    document.cookie.replace(
                        /(?:(?:^|.*;\s*)BharatLinkerUserData\s*\=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )
                )
            );
            const cart = userData.cart || [];
            const productIndex = cart.findIndex((item) => item.id === productId);

            if (productIndex !== -1) {
                const updatedCart = [...cart];
                updatedCart[productIndex].count -= 1;
                updatedCart[productIndex].price = productDetail.price;
                updatedCart[productIndex].discountedPrice = productDetail.discountedPrice;

                if (updatedCart[productIndex].count === 0) {
                    updatedCart.splice(productIndex, 1);
                }

                setCount((prev) => Math.max(prev - 1, 0));
                updateCartData(updatedCart);
            } else {
                console.error("Product not found in cart!");
            }
        } catch (error) {
            console.error("Error decrementing product count:", error);
        }
    };


    useEffect(() => {
        checkProductInCart();
    }, [showMyCart]);

    useEffect(() => {
        fetchProductDetails();
    }, []);





    const updateCartData = async (updatedCart) => {
        try {
            setCart(updatedCart);
            const userData = JSON.parse(
                decodeURIComponent(
                    document.cookie.replace(
                        /(?:(?:^|.*;\s*)BharatLinkerUserData\s*\=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )
                )
            );
            userData.cart = updatedCart;

            document.cookie = `BharatLinkerUserData=${encodeURIComponent(
                JSON.stringify(userData)
            )}; path=/`;

            const productInCart = updatedCart.find((item) => item.id === productId);
            if (productInCart) {
                setCount(productInCart.count);
                const updatedCartData = await updateCartByPhoneNumber(userData.phn, updatedCart);
            } else {
                setCount(0);
                console.log("Product not found in cart");
            }
        } catch (error) {
            console.error("Error updating cart data:", error);
        }
    };





    return (
        <Fragment>
            {!showMyCart && <div id="product-details-search-container-top">
                <SingleProductSearchBar />
            </div>}

            {loading ? (
                <div className="refurbished-page-loading-container">
                    <RotatingLines width="60" height="60" color="#007bff" />
                </div>
            ) : (
                <Fragment>
                    {productDetail && !showMyCart && (
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
                                        ></div>
                                    ))}
                                </div>
                                <div id="product-details-info">
                                    <div id="product-details-title">{productDetail?.title}</div>
                                    <div
                                        className="product-detaile-share"
                                        onClick={handleShare}
                                        title="Share this product"
                                    >
                                        <RiShareForwardLine size={20} />
                                    </div>
                                </div>
                                <div
                                    id="product-details-see-all-brand-product"
                                >
                                    View all products by {productDetail ? productDetail?.brand : "-"}
                                    <FaCaretRight onClick={() => navigate(`/search?query=${productDetail?.brand}`)} size={20} />
                                </div>
                                <div id="product-details-shop">
                                    Shop: <span onClick={handleShopClick} >{shopDetail ? shopDetail?.shopName.toUpperCase() : "Loading..."}</span>
                                </div>




                                <div id="product-details-price-button">
                                    <div id="searchProductDetails-price-button-inner">
                                        <div id="productDetails-discounted-price">
                                            ₹{productDetail?.discountedPrice}{" "}
                                            <div className="product-detail-discount-container">
                                                {productDetail?.price && productDetail?.discountedPrice ? (
                                                    <>
                                                        <span>
                                                            {Math.round(
                                                                ((productDetail.price - productDetail.discountedPrice) /
                                                                    productDetail.price) *
                                                                100
                                                            )}
                                                            % off
                                                        </span>
                                                    </>
                                                ) : (
                                                    "Price not available"
                                                )}
                                            </div>
                                        </div>
                                        <p id="productDetails-price1">
                                            MRP <span id="productDetails-price2">₹{productDetail?.price}</span>
                                        </p>
                                    </div>
                                    <div
                                        id={`product-details-price-${productDetail?.isInStock ? "instock" : "outofstock"
                                            }`}
                                    >
                                        {count === 0 ? (
                                            <div onClick={handleAddToCart}>add to cart</div>
                                        ) : (
                                            <div className="product-details-count-container">
                                                <FaMinus size={13} onClick={handleDecrement} />
                                                {count}
                                                <FaPlus size={15} onClick={handleIncrement} />
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


                        </>

                    )}
                     {!showMyCart && <AddToCartTab cart={cart} setShowMyCart={setShowMyCart} />}
                    {showMyCart && <MyCart setShowMyCart={setShowMyCart} />}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
