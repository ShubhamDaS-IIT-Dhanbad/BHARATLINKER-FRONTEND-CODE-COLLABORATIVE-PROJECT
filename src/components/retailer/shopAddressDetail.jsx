import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { updateShopData } from "../../appWrite/shop/shopData.js";
import Cookies from "js-cookie";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import "./style/shopAddressDetail.css";

const ShopAddressDetail = ({
    shopId,
    shopAddress,
    setShowShopAddressDetail,
}) => {
    const navigate = useNavigate();
    const [shopAddressDetail, setShopAddressDetail] = useState({
        shopNo: '',
        buildingName: '',
        landmark: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShopAddressDetail((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            shopLatitude: shopAddress?.lat,
            shopLongitude: shopAddress?.long,
            shopAddress: shopAddress?.address || "",
            shopNumber: shopAddressDetail.shopNo || "NA",
            buildingName: shopAddressDetail.buildingName || "NA",
            landMark: shopAddressDetail.landmark || "NA",
        };

        const success = await updateShopData(shopId,updatedData);
        if (success) {
            setShopAddressDetail((prev) => ({
                ...prev,
                shopNo: shopAddressDetail.shopNo,
                buildingName: shopAddressDetail.buildingName,
                landmark: shopAddressDetail.landmark || "",
            }));

            // Update cookie data
            const existingData = Cookies.get("BharatLinkerShopData")
                ? JSON.parse(Cookies.get("BharatLinkerShopData"))
                : {};
            const updatedCookieData = {
                ...existingData,
                shopLatitude:shopAddress?.lat,
                shopLongitude:shopAddress?.long,
                shopAddress: shopAddress?.address,
                shopNo: shopAddressDetail.shopNo,
                buildingName: shopAddressDetail.buildingName,
                landmark: shopAddressDetail.landmark || "",
            };
            Cookies.set("BharatLinkerShopData", JSON.stringify(updatedCookieData), { expires: 7 });

            setLoading(false);
            navigate('/secure/shop/address');
        }
    };

    return (
        <>
            <header className="shop-address-header">
                <button
                    className="shop-address-back-btn"
                    onClick={() => !loading && setShowShopAddressDetail(false)}
                    disabled={loading}
                    style={{ opacity: loading ? 0.5 : 1 }}
                >
                    <FaChevronLeft />
                </button>
                <span>CONFIRM ADDRESS</span>
            </header>

            <section>
                <div className="shop-address-detail-container">

                    <section className="shop-address-saved-shop-location">
                        <div className="shop-address-saved-shop-location-content">
                            <CiLocationOn size={60} color="white" />
                            <div className="saved-shop-location-content-address">
                                {shopAddress?.address ? shopAddress.address.slice(0, 70) : "No saved location"}
                            </div>
                        </div>
                    </section>

                    <form className="shop-address-form" onSubmit={handleSubmit}>

                        <div className="detail-item">
                            <fieldset>
                                <legend>Building & Block Name</legend>
                                <input
                                    type="text"
                                    name="shopNo"
                                    value={shopAddressDetail.shopNo}
                                    onChange={handleChange}
                                    placeholder="E.g., 12A, 1st Floor"
                                    required
                                />
                            </fieldset>
                        </div>

                        <div className="detail-item">
                            <fieldset>
                                <legend>Building & Block Name</legend>
                                <input
                                    type="text"
                                    name="buildingName"
                                    value={shopAddressDetail.buildingName}
                                    onChange={handleChange}
                                    placeholder="E.g., Skyline Plaza, Block B"
                                    required
                                />
                            </fieldset>
                        </div>

                        <div className="detail-item">
                            <fieldset>
                                <legend>Landmark & Area</legend>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={shopAddressDetail.landmark}
                                    onChange={handleChange}
                                    placeholder="E.g., Near City Center Mall"
                                />
                            </fieldset>
                        </div>
                    </form>
                </div>
            </section>

            <div className="save-shop-address-btn-container">
                <button
                    className="save-shop-address-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        cursor: loading ? "not-allowed" : "",
                    }}
                >
                    {loading ? (
                        <Oval
                            height={20}
                            width={20}
                            color="white"
                            visible={true}
                            secondaryColor="#ccc"
                            strokeWidth={4}
                        />
                    ) : (
                        "UPDATE SHOP ADDRESS"
                    )}
                </button>
            </div>
        </>
    );
};

export default ShopAddressDetail;
