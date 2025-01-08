import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./singleShop.css";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { fetchShopById } from "../../redux/features/singleShopSlice.jsx";
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineStore } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import SingleShopSearchBar from "./singleShopSearchBar.jsx";


import { FaPhoneAlt } from "react-icons/fa";
import { CiLocationArrow1 } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { AiOutlineInfo } from "react-icons/ai";


const ShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { shops } = useSelector((state) => state.searchshops);
    const { singleShops } = useSelector((state) => state.singleshops);


    const [shopName, setShopName] = useState("SHOP DETAIL");

    const [shopDetail, setShopDetail] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showContact, setShowContact] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        const fetchShopDetails = async () => {
            if (!shopId) return;

            const combinedShops = [...shops, ...singleShops];
            const shop = combinedShops.find((shop) => shop.$id === shopId);

            if (shop) {
                setShopDetail(shop);
                setShopName(shop.shopName);
                setSelectedImage(shop.shopImages[0] || ""); // Default to empty if no images
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

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleEnter = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const toggleContact = () => setShowContact(!showContact);
    const toggleAddress = () => setShowAddress(!showAddress);

    const redirectMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: userLat, longitude: userLon } = position.coords;
                    const { lat: shopLat, lon: shopLon } = shopDetail;

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

    return (
        <Fragment>
            <div id="product-details-search-container-top">
                <SingleShopSearchBar shopName={shopName.toUpperCase()} />
            </div>

            {shopDetail ? (
                <Fragment>
                    <div id="shop-details-container">
                        <div id="shop-details-img">
                            <div id="shop-details-img-div">
                                <img
                                    src={selectedImage}
                                    id="shop-details-img-selected"
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
                                        selectedImage === image ? "image-select" : "image-unselect"
                                    }
                                >
                                    <div id="shop-details-thumbnail-item"></div>
                                </div>
                            ))}
                        </div>

                        <div id="shop-details-info">
                            <div id="shop-details-trending">Verified Shop</div>
                            <p id="shop-details-id">Shop # {shopDetail.$id}</p>
                            <div id="shop-details-title">
                                {shopDetail.shopName?.toUpperCase()}
                            </div>
                        </div>


                        <div id="shop-details-see-all-products">
                            See All Products <MdOutlineKeyboardArrowRight size={11} />
                        </div>


                        <div id="shop-details-status">
                            <div
                                className={`shop-details-status-button ${shopDetail.isOpened ? "opened" : "closed"
                                    }`}
                            >
                                {shopDetail.isOpened ? "OPENED" : "CLOSED"}
                            </div>
                        </div>

                        {/* <div id="shop-details-hr"></div>

                        <div
                            id="shop-details-about"
                            onClick={toggleAddress}
                        >
                            <p style={{ fontSize: "19px", fontWeight: "700" }}>Address</p>
                            {showAddress ? <IoIosArrowUp size={25} /> : <IoIosArrowDown size={25} />}
                        </div>

                        {showAddress && (
                            <div id="shop-details-description">{shopDetail?.address}</div>
                        )}

                        <div id="shop-details-hr"></div>

                        <div
                            id="shop-detail-contact"
                            onClick={toggleContact}
                        >
                            <p style={{ fontSize: "19px", fontWeight: "700" }}>Contact</p>
                            {showContact ? <IoIosArrowUp size={25} /> : <IoIosArrowDown size={25} />}
                        </div>

                        {showContact && (
                            <div id="shop-details-description">
                                {shopDetail.phoneNumber && `PHN ${shopDetail.phoneNumber}`}
                                <br />
                                {shopDetail.email && `Email ${shopDetail.email}`}
                            </div>
                        )} */}

                    </div>
                    <div id="product-details-bottom-text">@Bharat Linker 2025</div>
                </Fragment>
            ) : (
                <p>Loading shop details...</p>
            )}


            <div id="shop-details-footer">
                <div id="shop-details-footer-item-phn">
                    <FaPhoneAlt  size={30} />
                </div>
                <div id="shop-details-footer-item-loc" >
                    <CiLocationArrow1  size={35}  onClick={redirectMap} />
                </div>
                <div id="shop-details-footer-item-mail">
                    <CiMail size={35} />
                </div>
                <div id="shop-details-footer-item-info">
                    <AiOutlineInfo size={35} />
                </div>
            </div>
        </Fragment>
    );
};

export default ShopDetails;
