import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { RiShareForwardLine } from "react-icons/ri";
import { FaCaretRight, FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { CiPhone, CiLocationOn, CiMail } from "react-icons/ci";
import { fetchShopById } from "../redux/features/singleShopSlice.jsx";
import SingleProductSearchBar from "./singlePageSearchbar.jsx";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./style/singleShop.css";

const parseDescription = (description) => {
  if (!description) return [];
  return description.split("#").slice(1).map(section => {
    const [heading, ...contents] = section.split("*");
    return { 
      heading: heading.trim(), 
      content: contents.join("*").trim() 
    };
  });
};

const ProductDetails = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shopId } = useParams();
  
  const [shopDetail, setShopDetail] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shops = useSelector(({ searchshops }) => searchshops.shops);
  const singleShops = useSelector(({ singleshops }) => singleshops.singleShops);

  const descriptionSections = useMemo(
    () => parseDescription(shopDetail?.description),
    [shopDetail?.description]
  );

  const fetchShopDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cachedShop = [...shops, ...singleShops].find(shop => shop?.$id === shopId);
      if (cachedShop) {
        setShopDetail(cachedShop);
        setSelectedImage(cachedShop.shopImages[0] || "");
        return;
      }

      const result = await dispatch(fetchShopById(shopId));
      if (result.payload) {
        setShopDetail(result.payload);
        setSelectedImage(result.payload.shopImages[0] || "");
      } else {
        setError("Shop not found");
      }
    } catch (err) {
      setError("Failed to load shop details");
      console.error("Shop fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId, dispatch, shops, singleShops]);

  useEffect(() => {
    if (shopId) fetchShopDetails();
    window.scrollTo(0, 0);
  }, [shopId, fetchShopDetails]);

  const handleImageClick = useCallback(
    index => setSelectedImage(shopDetail?.shopImages[index]),
    [shopDetail]
  );

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: shopDetail?.shopName || "Shop",
        text: `Check out this shop: ${shopDetail?.shopName || ""}`,
        url: window.location.href,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } else {
      alert("Sharing not supported");
    }
  }, [shopDetail]);

  const redirectMap = useCallback(() => {
    const fallbackMap = () => {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${shopDetail?.lat},${shopDetail?.long}`;
      window.open(mapUrl, "_blank");
    };

    if (!navigator.geolocation) return fallbackMap();

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${shopDetail?.lat},${shopDetail?.long}`;
        window.open(url, "_blank");
      },
      (err) => {
        console.error("Geolocation error:", err);
        fallbackMap();
      }
    );
  }, [shopDetail]);

  const handlePhoneClick = useCallback(() => {
    const phone = shopDetail?.customerCare;
    if (phone?.match(/^[0-9+()\s-]+$/)) {
      window.location.href = `tel:${phone}`;
    } else {
      alert("Invalid phone number");
    }
  }, [shopDetail]);

  const handleViewProducts = useCallback(() => {
    const safeName = encodeURIComponent(shopDetail?.shopName || '-');
    navigate(`/shop/product/${shopDetail?.$id}?shopName=${safeName}`);
  }, [navigate, shopDetail]);

  if (error) {
    return (
      <div className="refurbished-page-loading-container">
        <h3>{error}</h3>
        <button onClick={fetchShopDetails}>Retry</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="refurbished-page-loading-container">
        <Oval height={30} width={30} color="green" secondaryColor="white" />
      </div>
    );
  }

  return (
    <>
      <div id="product-details-search-container-top">
        <SingleProductSearchBar heading={"SHOP INFO"} />
      </div>

      <div id="shop-details-container">
        <div id="product-details-img">
          <LazyLoadImage
            src={selectedImage}
            alt={`Shop Thumbnail`}
            effect="fadeIn"
            id="product-details-img-selected"
          />
        </div>

        <div id="product-details-thumbnails">
          {shopDetail?.shopImages?.map((image, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className={selectedImage === image ? "product-detail-image-select" : "product-detail-image-unselect"}
            />
          ))}
        </div>

        <div id="product-details-info">
          <div id="product-details-title">{shopDetail?.shopName}</div>
          <div className="product-detaile-share" onClick={handleShare}>
            <RiShareForwardLine size={20} />
          </div>
        </div>

        <div id="shop-detail-view-all-product" onClick={handleViewProducts}>
          View all products of {shopDetail?.shopName ? shopDetail?.shopName : "-"}
          <FaCaretRight size={20} />
        </div>

        <div className="shop-detail-options">
          <div className={`shop-detail-option ${shopDetail?.isOpened ? 'open' : 'closed'}`}>
            {shopDetail?.isOpened ? <FaDoorOpen size={35} /> : <FaDoorClosed size={35} />}
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
    </>
  );
});

export default ProductDetails;