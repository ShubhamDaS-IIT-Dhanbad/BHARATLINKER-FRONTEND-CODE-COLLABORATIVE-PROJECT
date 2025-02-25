import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { TiInfoOutline } from "react-icons/ti";
import LocationTab from "../locationTab/locationTab.jsx";
import { FaLocationCrosshairs } from "react-icons/fa6";
import ShopAddressDetailComponent from "./shopAddressDetail.jsx";
import "./style/shopAddress.css";

function ShopAddress({ shopData }) {
  const [shopAddress, setShopAddress] = useState(null);

  const [isLocationTabVisible, setIsLocationTabVisible] = useState(!shopData.shopAddress);
  const [showShopAddressDetail, setShowShopAddressDetail] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  if (showShopAddressDetail) {
    return (
      <ShopAddressDetailComponent
        shopId={shopData.shopId}
        shopAddress={shopAddress}
        setShowShopAddressDetail={setShowShopAddressDetail}
      />
    );
  }

  return (
    <>
      {isLocationTabVisible ? (
        <LocationTab
          documentId={shopData.shopId}
          setShopAddress={setShopAddress}
          header="SET SHOP ADDRESS"
          setShowAddressDetail={setShowShopAddressDetail}
          setLocationTab={setIsLocationTabVisible}
        />
      ) : (
        <div className="shop-address-container">
          {/* Header */}
          <header className="shop-address-header">
            <button
              className="shop-address-back-btn"
              onClick={() => navigate("/secure/shop")}
            >
              <FaChevronLeft />
            </button>
            <span>SHOP ADDRESS</span>
            <button
              className="shop-address-info-btn"
              onClick={() => setShowInfo(!showInfo)}
            >
              <TiInfoOutline />
            </button>
          </header>

          {/* Shop Address Display */}
          {shopData.shopAddress ?
            (
              <>
                <div className="address-card">

                  <div className="address-card-inner">

                    <div className="address-section">
                      <span className="address-text">
                        {shopData?.shopAddress || "No physical address available"}
                      </span>
                    </div>

                    <div className="details-grid">

                      <div className="detail-item">
                        <fieldset>
                          <legend>Shop No. & Floor</legend>
                          <span className="detail-value">{shopData?.shopNo || "N/A"}</span>
                        </fieldset>
                      </div>

                      <div className="detail-item">
                        <fieldset>
                          <legend>Building & Block Name </legend>
                          <span className="detail-value">{shopData?.buildingName || "N/A"}</span>
                        </fieldset>
                      </div>

                      <div className="detail-item">
                        <fieldset>
                          <legend>Landmark & Area</legend>
                          <span className="detail-value">{shopData?.landmark || "Not specified"}</span>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>

              </>
            )
          }

          <div className="shop-address-footer">
            <div className="shop-address-footer-location"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${shopData.shopLatitude},${shopData.shopLongitude}`,
                  "_blank"
                )
              }
            >
              < FaLocationCrosshairs />
            </div>
            <div className="shop-address-footer-update"
              onClick={() => setIsLocationTabVisible(true)}
            >
              UPDATE SHOP ADDRESS
            </div>
          </div>

          {/* Info Popup */}
          {showInfo && (
            <div className="shop-address-popup-overlay">
              <div className="shop-address-popup-card">
                <div className="shop-address-popup-pointer"></div>
                <h2 className="shop-address-popup-title">
                  Shop Location Warning
                </h2>
                <p style={{ fontSize: "13px" }} className="shop-address-popup-text">
                  "DONT CHANGE SHOP LOCATION MULTIPLE TIMES SET AT ONCE AND LEAVE IT!"
                  Changing your shop location won't update previously uploaded
                  products. Update them manually if needed.
                </p>
                <div className="shop-address-popup-buttons">
                  <button
                    className="shop-address-popup-button-primary"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    understood
                  </button>
                  <button
                    className="shop-address-popup-button-secondary"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ShopAddress;
