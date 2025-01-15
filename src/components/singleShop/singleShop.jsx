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
                    window.open(googleMapsDirectionsUrl, "_blank");
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

    const handlePhoneClick = () => {
        const phone = shopDetail?.customerCare;
        if (phone && /^[0-9+()\s-]+$/.test(phone)) {
            window.location.href = `tel:${phone}`;
        } else {
            alert("Valid phone number not available.");
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
                            ></div>
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
                        <FaCaretRight size={20} />
                    </div>

                    <div className="shop-detail-options">
                        <div
                            className={`shop-detail-option ${shopDetail.isOpened ? 'open' : 'closed'}`}
                        >
                            {shopDetail.isOpened ? <FaDoorOpen size={35} /> : <FaDoorClosed size={35} />}
                        </div>
                        <div className="shop-detail-option" onClick={handlePhoneClick}>
                            <CiPhone size={35} />
                        </div>
                        <div className="shop-detail-option" onClick={redirectMap}>
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
