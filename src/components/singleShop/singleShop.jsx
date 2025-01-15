// import React, { Fragment, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import "./singleShop.css";
// import {
//     MdOutlineKeyboardArrowRight,
// } from "react-icons/md";
// import { fetchShopById } from "../../redux/features/singleShopSlice.jsx";
// import { CiPhone } from "react-icons/ci";
// import { CiLocationOn } from "react-icons/ci";
// import { CiMail } from "react-icons/ci";
// import { AiOutlineInfo } from "react-icons/ai";
// import SingleShopSearchBar from "./singleShopSearchBar.jsx";
// import { IoClose } from 'react-icons/io5';

// const ShopDetails = () => {
//     const { shopId } = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const { shops } = useSelector((state) => state.searchshops);
//     const { singleShops } = useSelector((state) => state.singleshops);

//     const [shopDetail, setShopDetail] = useState(null);
//     const [shopName, setShopName] = useState("SHOP DETAIL");
//     const [selectedImage, setSelectedImage] = useState("");
//     const [showDescription, setShowDescription] = useState(false);

//     useEffect(() => {
//         const fetchShopDetails = async () => {
//             if (!shopId) return;

//             const combinedShops = [...shops, ...singleShops];
//             const shop = combinedShops.find((shop) => shop.$id === shopId);

//             if (shop) {
//                 setShopDetail(shop);
//                 setShopName(shop.shopName);
//                 setSelectedImage(shop.shopImages[0] || "");
//             } else {
//                 try {
//                     const response = await dispatch(fetchShopById(shopId));
//                     if (response?.payload) {
//                         setShopDetail(response.payload);
//                         setSelectedImage(response.payload.shopImages[0] || "");
//                     }
//                 } catch (error) {
//                     console.error("Error fetching shop details: ", error);
//                 }
//             }
//         };
//         fetchShopDetails();
//     }, [shopId, shops, singleShops, dispatch]);

//     const redirectMap = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude: userLat, longitude: userLon } = position.coords;
//                     const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${shopDetail?.lat},${shopDetail?.lang}&travelmode=driving`;

//                     window.location.href = googleMapsDirectionsUrl;
//                 },
//                 (error) => {
//                     console.error("Error getting user location: ", error);
//                     alert("Unable to get your current location. Please enable location services.");
//                 }
//             );
//         } else {
//             alert("Geolocation is not supported by this browser.");
//         }
//     };

//     const handlePhoneClick = () => {
//         const phone = shopDetail?.customerCare;
//         if (phone && /^[0-9+()\s-]+$/.test(phone)) {
//             window.location.href = `tel:${phone}`;
//         } else {
//             alert("Valid phone number not available.");
//         }
//     };


//     const toggleDescription = () => {
//         setShowDescription((prev) => !prev);
//     };

//     return (
//         <Fragment>
//             <div id="product-details-search-container-top">
//                 <SingleShopSearchBar shopName={shopName.toUpperCase()} />
//             </div>

//             {shopDetail ? (
//                 <Fragment>
//                     <div id="shop-details-container">
//                         <div className="shop-card-container">
//                             <div className="shop-card-header">
//                                 <img
//                                     src={selectedImage}
//                                     className="shop-card-image"
//                                     alt="Selected Shop"
//                                 />
//                             </div>
//                         </div>

//                         <div id="shop-details-thumbnails">
//                             {shopDetail.shopImages?.map((image, index) => (
//                                 <div
//                                     id="shop-details-thumbnail"
//                                     key={index}
//                                     onClick={() => setSelectedImage(image)}
//                                     className={
//                                         selectedImage === image ? "shop-detail-image-select" : "shop-detail-image-unselect"
//                                     }
//                                 ></div>
//                             ))}
//                         </div>

//                         <div id="shop-details-info">
//                             <div id="shop-details-trending">Verified Shop</div>
//                             <p id="shop-details-id">Shop # {shopDetail.$id}</p>
//                             <div id="shop-details-title">
//                                 {shopDetail.shopName?.toUpperCase()}
//                             </div>
//                         </div>

//                         <div id="shop-details-see-all-products" onClick={() => {
//                             navigate(`/shop/product/${shopDetail?.$id}?shopName=${shopDetail.shopName}&query=`);
//                         }}

//                         >
//                             SEE ALL PRODUCTS <MdOutlineKeyboardArrowRight size={11} />
//                         </div>

//                         <div id="shop-details-status">
//                             <div
//                                 className={`shop-details-status-button ${shopDetail?.isOpened ? "opened" : "closed"
//                                     }`}
//                             >
//                                 {shopDetail.isOpened ? "OPENED" : "CLOSED"}
//                             </div>
//                         </div>
//                     </div>
//                 </Fragment>
//             ) : (
//                 <p>Loading shop details...</p>
//             )}

//             <div id="shop-details-footer">
//                 <div id="shop-details-footer-item-phn" onClick={handlePhoneClick}>
//                     <CiPhone size={35} />
//                 </div>
//                 <div id="shop-details-footer-item-loc">
//                     <CiLocationOn size={33} onClick={redirectMap} />
//                 </div>
//                 <div id="shop-details-footer-item-mail">
//                     <CiMail size={35} />
//                 </div>
//                 <div id="shop-details-footer-item-info" onClick={toggleDescription}>
//                     <AiOutlineInfo size={35} />
//                 </div>
//             </div>

//             {showDescription && (
//                 <div className="productDetails-description-div-pop-up">
//                     <div
//                         className="productDetails-description-div-pop-up-close"
//                         onClick={toggleDescription}
//                         aria-label="Close filter options"
//                     >
//                         <IoClose size={30} />
//                     </div>
//                     <div className="productDetails-filter-section-title">SHOP DETAILS</div>

//                     <div className="productDetails-lists-description-container">

//                         <div id="productDetails-description">
//                             {shopDetail.description}
//                         </div>
//                     </div>
//                 </div>
//             )}



//         </Fragment>
//     );
// };

// export default ShopDetails;





import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./singleShop.css";
import { useDispatch, useSelector } from "react-redux";
import SingleProductSearchBar from "./singleShopSearchBar.jsx";
import { RotatingLines } from "react-loader-spinner";
import { fetchShopById } from "../../redux/features/singleShopSlice.jsx";
import { RiShareForwardLine } from "react-icons/ri";
import { FaCaretRight } from "react-icons/fa";
import { FaDoorClosed } from "react-icons/fa6";
import { FaDoorOpen } from "react-icons/fa6";
import { CiPhone } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
const ProductDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { shopId } = useParams();

    const [shopDetail, setShopDetail] = useState(null);
    const [descriptionSections, setDescriptionSections] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(true);

    const { shops } = useSelector((state) => state.searchshops);
    const { singleShops } = useSelector((state) => state.singleshops);

    const parseDescription = (description) => {
        if (!description) return [];
        const sections = description.split("#").slice(1);
        return sections.map((section) => {
            const [heading, ...contents] = section.split("*");
            return { heading: heading.trim(), content: contents.join("*").trim() };
        });
    };

    const fetchShopDetails = async (shopId) => {
        setLoading(true);
        const shop =
            [...shops, ...singleShops].find((shop) => shop.$id === shopId) ||
            (await dispatch(fetchShopById(shopId))).payload;

        if (shop) {
            setShopDetail(shop);
            setDescriptionSections(parseDescription(shop.description));
            setSelectedImage(shop.shopImages[0] || "");
        } else {
            console.error("Shop not found");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (shopId) {
            fetchShopDetails(shopId);
        }
    }, [shopId, shops, singleShops, dispatch]);

    const handleImageClick = (index) => {
        setSelectedImage(shopDetail?.shopImages[index]);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: shopDetail?.shopName || "Shop",
                    text: `Check out this shop: ${shopDetail?.shopName || ""}`,
                    url: window.location.href,
                })
                .then(() => console.log("Shared successfully"))
                .catch((error) => console.error("Error sharing:", error));
        } else {
            alert("Sharing not supported on this browser.");
        }
    };

    const redirectMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: userLat, longitude: userLon } = position.coords;
                    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${shopDetail?.lat},${shopDetail?.lang}&travelmode=driving`;
                    window.location.href = googleMapsDirectionsUrl;
                },
                (error) => {
                    console.error("Error getting location:", error);
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
                <SingleProductSearchBar />
            </div>
            {loading ? (
                <div className="refurbished-page-loading-container">
                    <RotatingLines width="60" height="60" color="#007bff" />
                </div>
            ) : (
                <div id="shop-details-container">
                    <div id="product-details-img">
                        <img src={selectedImage} alt="Selected Product" id="product-details-img-selected" />
                    </div>
                    <div id="product-details-thumbnails">
                        {shopDetail?.shopImages?.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => handleImageClick(index)}
                                className={selectedImage === image ? "product-detail-image-select" : "product-detail-image-unselect"}
                            >
                            </div>
                        ))}
                    </div>
                    <div id="product-details-info">
                        <div id="product-details-title">{shopDetail?.shopName}</div>
                        <div className="product-detaile-share" onClick={handleShare}>
                            <RiShareForwardLine size={20} />
                        </div>
                    </div>


                    <div
                        id="shop-detail-view-all-product"
                        onClick={() => navigate(`/search?query=${shopDetail?.shopName}`)}
                    >
                        View all products of {shopDetail?.shopName ? shopDetail?.shopName : "-"}
                        < FaCaretRight size={20} />
                    </div>
                

                    <div className="shop-detail-options">
                        <div
                            className={`shop-detail-option ${shopDetail.isOpened ? 'open' : 'closed'}`}
                        >
                            {shopDetail.isOpened ? <FaDoorOpen size={35}/> : <FaDoorClosed size={35}/>}
                        </div>
                        <div className="shop-detail-option">
                            <CiPhone size={35} />
                        </div>
                        <div className="shop-detail-option">
                            <CiLocationOn size={35} />
                        </div>
                        <div className="shop-detail-option">
                            <CiMail size={35} />
                        </div>
                    </div>




                    <div className="product-detail-description-container">
                        <div>Shop Details</div>
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
            )}
        </Fragment>
    );
};

export default ProductDetails;
