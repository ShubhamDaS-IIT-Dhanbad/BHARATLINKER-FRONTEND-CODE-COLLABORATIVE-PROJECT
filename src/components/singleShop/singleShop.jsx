import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./singleShop.css";
import {
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { fetchShopById } from "../../redux/features/singleShopSlice.jsx";
import { CiPhone } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { AiOutlineInfo } from "react-icons/ai";
import SingleShopSearchBar from "./singleShopSearchBar.jsx";
import { IoClose } from 'react-icons/io5';

const ShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { shops } = useSelector((state) => state.searchshops);
    const { singleShops } = useSelector((state) => state.singleshops);

    const [shopDetail, setShopDetail] = useState(null);
    const [shopName, setShopName] = useState("SHOP DETAIL");
    const [selectedImage, setSelectedImage] = useState("");
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        const fetchShopDetails = async () => {
            if (!shopId) return;

            const combinedShops = [...shops, ...singleShops];
            const shop = combinedShops.find((shop) => shop.$id === shopId);

            if (shop) {
                setShopDetail(shop);
                setShopName(shop.shopName);
                setSelectedImage(shop.shopImages[0] || "");
            } else {
                try {
                    const response = await dispatch(fetchShopById(shopId));
                    if (response?.payload) {
                        setShopDetail(response.payload);
                        setSelectedImage(response.payload.shopImages[0] || "");
                    }
                } catch (error) {
                    console.error("Error fetching shop details: ", error);
                }
            }
        };
        fetchShopDetails();
    }, [shopId, shops, singleShops, dispatch]);

    const redirectMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: userLat, longitude: userLon } = position.coords;
                    const { lat: shopLat, long: shopLon } = shopDetail;

                    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${shopLat},${shopLon}&travelmode=driving`;

                    window.location.href = googleMapsDirectionsUrl;
                },
                (error) => {
                    console.error("Error getting user location: ", error);
                    alert("Unable to get your current location. Please enable location services.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handlePhoneClick = () => {
        const phone = shopDetail?.customerCare;
        if (phone && /^[0-9+()\s-]+$/.test(phone)) {
            window.location.href = `tel:${phone}`;
        } else {
            alert("Valid phone number not available.");
        }
    };
    
    const handleMailClick = () => {
        const email = shopDetail?.email;
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            window.location.href = `mailto:${email}`;
        } else {
            alert("Valid email not available.");
        }
    };
    

    const toggleDescription = () => {
        setShowDescription((prev) => !prev);
    };

    return (
        <Fragment>
            <div id="product-details-search-container-top">
                <SingleShopSearchBar shopName={shopName.toUpperCase()} />
            </div>

            {shopDetail ? (
                <Fragment>
                    <div id="shop-details-container">
                        <div className="shop-card-container">
                            <div className="shop-card-header">
                                <img
                                    src={selectedImage}
                                    className="shop-card-image"
                                    alt="Selected Shop"
                                />
                            </div>
                        </div>

                        <div id="shop-details-thumbnails">
                            {shopDetail.shopImages?.map((image, index) => (
                                <div
                                    id="shop-details-thumbnail"
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={
                                        selectedImage === image ? "shop-detail-image-select" : "shop-detail-image-unselect"
                                    }
                                ></div>
                            ))}
                        </div>

                        <div id="shop-details-info">
                            <div id="shop-details-trending">Verified Shop</div>
                            <p id="shop-details-id">Shop # {shopDetail.$id}</p>
                            <div id="shop-details-title">
                                {shopDetail.shopName?.toUpperCase()}
                            </div>
                        </div>

                        <div id="shop-details-see-all-products" onClick={() => {
                            navigate(`/shop/product/${shopDetail?.$id}?shopName=${shopDetail.shopName}&query=`);
                        }}

                        >
                            SEE ALL PRODUCTS <MdOutlineKeyboardArrowRight size={11} />
                        </div>

                        <div id="shop-details-status">
                            <div
                                className={`shop-details-status-button ${shopDetail?.isOpened ? "opened" : "closed"
                                    }`}
                            >
                                {shopDetail.isOpened ? "OPENED" : "CLOSED"}
                            </div>
                        </div>
                    </div>
                </Fragment>
            ) : (
                <p>Loading shop details...</p>
            )}

            <div id="shop-details-footer">
                <div id="shop-details-footer-item-phn" onClick={handlePhoneClick}>
                    <CiPhone size={35} />
                </div>
                <div id="shop-details-footer-item-loc">
                    <CiLocationOn size={33} onClick={redirectMap} />
                </div>
                <div id="shop-details-footer-item-mail">
                    <CiMail size={35} />
                </div>
                <div id="shop-details-footer-item-info" onClick={toggleDescription}>
                    <AiOutlineInfo size={35} />
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
                    <div className="productDetails-filter-section-title">SHOP DETAILS</div>

                    <div className="productDetails-lists-description-container">

                        <div id="productDetails-description">
                            {shopDetail.description}
                        </div>
                    </div>
                </div>
            )}



        </Fragment>
    );
};

export default ShopDetails;
