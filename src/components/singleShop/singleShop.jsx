import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import "./singleShop.css";

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { fetchShopById } from '../../redux/features/singleShopSlice.jsx';
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineStore } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5"; // Importing the location icon

const ShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize dispatch

    // Selectors to get shops from the Redux store
    const { shops } = useSelector((state) => state.searchshops);
    const { singleShops } = useSelector((state) => state.singleshops);

    const [shopDetail, setShopDetail] = useState(null); // State to hold the shop details
    const [searchQuery, setSearchQuery] = useState('');
    const [showContact, setShowContact] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedImage, setSelectedImage] = useState(''); // New state for selected image

    useEffect(() => {
        const fetchShopDetails = async () => {
            if (!shopId) return;
            const combinedShops = [...shops, ...singleShops];
            const shop = combinedShops.find((shop) => shop.$id === shopId);
            
            if (shop) {
                setShopDetail(shop);
                setSelectedImage(shop.shopImages[0]); // Set the first image as default
            } else {
                try {
                    const response = await dispatch(fetchShopById(shopId));
                    if (response) {
                        setShopDetail(response.payload);
                        setSelectedImage(response.payload.shopImages[0]); // Set the first image as default
                    }
                } catch (error) {
                    console.error("Error fetching shop details: ", error);
                }
            }
        };
        fetchShopDetails();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const toggleContact = () => {
        setShowContact(!showContact);
    };

    const toggleAddress = () => {
        setShowAddress(!showAddress);
    };

    // Function to redirect to Google Maps with directions from user's location to shop's location
    const redirectMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                const shopLat = shopDetail.lat;
                const shopLon = shopDetail.lon;

                // Construct the Google Maps directions URL
                const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${shopLat},${shopLon}&travelmode=driving`;

                // Redirect to Google Maps with directions
                window.location.href = googleMapsDirectionsUrl;
            }, (error) => {
                console.error("Error getting user location: ", error);
                alert("Unable to get your current location. Please enable location services.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <Fragment>
            <div id='shop-details-search-container-top'>
                <div id='shop-details-search-container-top-divs'>
                    <div id='shop-details-search-container-top-div'>
                        
                    <BiSearchAlt size={40} id='header-div-search-div-search' />
                    <input
                        id='shop-details-search-bar'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder={`Search Products In ${shopDetail?.shopName?.toUpperCase()?shopDetail?.shopName?.toUpperCase():"Shop"}`}
                        onKeyDown={handleEnter}
                    />
                    <MdOutlineStore onClick={() => { navigate('/shop') }} size={35} style={{ paddingRight: "10px" }} />
                </div>
                
                </div>
            </div>

            {/* Check if shopDetail is available before rendering */}
            {shopDetail ? (
                <Fragment>
                    <div id="shop-details-container">
                        {/* Main Image */}
                        <div id="shop-details-img">
                            <div id="shop-details-img-div">
                                <img src={selectedImage} id="shop-details-img-selected" alt="Selected Shop" />
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div id="shop-details-thumbnails">
                            {shopDetail.shopImages.map((image, index) => (
                                <div
                                    id="shop-details-thumbnail"
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={selectedImage === image ? "image-select" : "image-unselect"}
                                >
                                    <img src={image} alt={`Thumbnail ${index + 1}`} style={{ width: '60px' }} />
                                </div>
                            ))}
                        </div>

                        {/* Shop Information */}
                        <div id="shop-details-info">
                            <div id="shop-details-trending">Verified Shop</div>
                            <p id="shop-details-id">Shop # {shopDetail.$id}</p>
                            <div id="shop-details-title">
                                {shopDetail.shopName.toUpperCase()}
                                <IoLocationOutline size={30} onClick={redirectMap} />
                            </div>
                        </div>

                        <div id="shop-details-see-all-products">
                            See All Products <MdOutlineKeyboardArrowRight size={11} />
                        </div>

                        {/* Shop Status */}
                        <div id="shop-details-status">
                            <div className={`shop-details-status-button ${shopDetail.isOpened ? 'opened' : 'closed'}`}>
                                {shopDetail.isOpened ? 'OPENED' : 'CLOSED'}
                            </div>
                        </div>

                        <div id="shop-details-hr"></div>

                        {/* Address */}
                        <div id="shop-details-about" onClick={toggleAddress} style={{ cursor: 'pointer' }}>
                            <p style={{ fontSize: "19px", fontWeight: "700" }}>Address</p>
                            {showAddress ? <IoIosArrowUp size={25} /> : <IoIosArrowDown size={25} />}
                        </div>

                        {showAddress && (
                            <div id="shop-details-description">
                                {shopDetail.address}
                            </div>
                        )}

                        <div id="shop-details-hr"></div>

                        {/* Contact */}
                        <div id="shop-details-contact" onClick={toggleContact} style={{ cursor: 'pointer' }}>
                            <p style={{ fontSize: "19px", fontWeight: "700" }}>Contact</p>
                            {showContact ? <IoIosArrowUp size={25} /> : <IoIosArrowDown size={25} />}
                        </div>

                        {showContact && (
                            <div id="shop-details-description">
                                {shopDetail?.phoneNumber ? `PHN ${shopDetail.phoneNumber}` : ""}
                                <br />
                                {shopDetail?.email ? `Email ${shopDetail.email}` : ""}
                            </div>
                        )}

                        <div id="shop-details-hr"></div>
                    </div>
                </Fragment>
            ) : (
                <p>Loading shop details...</p>
            )}
        </Fragment>
    );
};

export default ShopDetails;
