import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";

import { RiShareForwardLine } from "react-icons/ri";
import { CiPhone } from "react-icons/ci";
import { PiWhatsappLogoThin } from "react-icons/pi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import SingleRefurbishedProductSearchBar from "./singlePageSearchbar.jsx";

import "./style/singleProduct.css";
const fallbackImage =
  "http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { refurbishedProducts } = useSelector((state) => state.refurbishedproducts);
  const { refurbishedId } = useParams();

  const [descriptionSections, setDescriptionSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetail, setProductDetails] = useState(null);
  const [shopDetail, setShopDetail] = useState(null);
  const [selectedImage, setSelectedImage] = useState(fallbackImage);

  const parseDescription = (description) => {
    if (!description) return [];
    const sections = description.split("#").slice(1);
    return sections.map((section) => {
      const [heading, ...contents] = section.split("*");
      return {
        heading: heading.trim(),
        content: contents
          .map((item, i) => <p key={i} className="detail-para">{item.trim()}</p>)
          .filter(Boolean)
      };
    });
  };



  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      const product = refurbishedProducts.find((product) => product.$id === refurbishedId);
      if (product) {
        setProductDetails(product);
        setSelectedImage(product.image[0] || fallbackImage);
        setDescriptionSections(parseDescription(product.description));
        setShopDetail(product.shopDetails || null);
      } else {
        navigate("/refurbished");
      }
      setLoading(false);
    };

    fetchProductDetails();
  }, [refurbishedProducts, refurbishedId, navigate]);

  const handleImageClick = (index) => {
    setSelectedImage(productDetail?.image[index]);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: productDetail?.title || "Product",
          text: `Check out this product: ${productDetail?.title || ""}`,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing product:", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const handlePhoneClick = () => {
    if (productDetail?.phoneNumber) {
      window.location.href = `tel:+${productDetail.phoneNumber}`;
    }
  };

  const handleWhatsappClick = () => {
    if (productDetail?.phoneNumber) {
      window.location.href = `https://wa.me/+${productDetail.phoneNumber}`;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Fragment>
      <div id="product-details-search-container-top">
        <SingleRefurbishedProductSearchBar heading={"REFURBISHED INFO"} />
      </div>

      {loading ? (
        <div className="page-loading-container">
          <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
        </div>
      ) : (
        productDetail && (
          <div id="product-details-container">
            <div id="product-details-img">
              <LazyLoadImage
                src={selectedImage}
                alt={`Product Thumbnail`}
                effect="fadeIn"
                id="product-details-img-selected"
              />
            </div>

            <div id="product-details-thumbnails">
              {productDetail?.image?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={
                    selectedImage === image
                      ? "product-detail-image-select"
                      : "product-detail-image-unselect"
                  }
                />
              ))}
            </div>

            <div id="product-details-info">
              <div id="product-details-title">{productDetail?.title}</div>
              <div className="product-detaile-share" onClick={handleShare}>
                <RiShareForwardLine size={20} />
              </div>
            </div>

            <div className="shop-detail-options">
              <div className="shop-detail-option" onClick={handlePhoneClick}>
                <CiPhone size={35} />
              </div>
              <div className="shop-detail-option" onClick={handleWhatsappClick}>
                <PiWhatsappLogoThin size={35} />
              </div>
            </div>

            <div id="product-details-price-button">
              <div id="searchProductDetails-price-button-inner">
                <div id="productDetails-discounted-price">
                  ₹{productDetail?.discountedPrice}
                  {productDetail?.price && productDetail?.discountedPrice && (
                    <div className="product-detail-discount-container">
                      {Math.round(
                        ((productDetail.price - productDetail.discountedPrice) /
                          productDetail.price) *
                        100
                      )}
                      % off
                    </div>
                  )}
                </div>
                <p id="productDetails-price1">
                  MRP <span id="productDetails-price2">₹{productDetail?.price}</span>
                </p>
              </div>
              <div className={`product-details-price-instock`}>
                on sale
              </div>
            </div>

            <div className="product-detail-description-container">
              <div>Product Details</div>
              <div className="productDetails-lists-description-container">
                {descriptionSections.map((section, index) => (
                  <div key={index} className="description-section">
                    <div className="description-heading">{section.heading}</div>
                    <div className="description-content">{section.content}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )
      )}
    </Fragment>
  );
};

export default ProductDetails;
