import React, { useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import "./deliveryAddress.css";

const UserDeliveryAddress = ({
  deliveryAddress,
  setDeliveryAddress,
  setShowCheckOutPage,
  setShowAddressDetail,
}) => {
  const [address, setAddress] = useState({
    houseNo: "",
    buildingNo: "",
    landmark: "",
    label: "Home",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDeliveryAddress((prev) => ({
      ...prev,
      houseNo: `${address.houseNo}`,
      buildingNo:`${address.buildingNo}`,
      landmark:`${address.landmark || ""}`,
      label: address.label,
    }));
    setShowAddressDetail(false);
    setShowCheckOutPage(true);
  };

  return (
    <>
      {/* Header */}
      <header>
        <div className="saved-location-header">
          <FaAngleLeft className="back-icon" onClick={() => setShowAddressDetail(false)} />
          <h2>Delivery Address</h2>
        </div>
      </header>

      {/* Main Section */}
      <section>
        <div className="delivery-address-container">

          {/* Saved Location */}
          <section className="saved-location">
            <h3 className="saved-location-title">Saved Location</h3>
            <div className="saved-location-content">
              <CiLocationOn size={30} color="white" />
              <div className="saved-location-content-address">
                <p>{deliveryAddress?.address?.slice(0, 70) || "No saved location"}</p>
              </div>

            </div>
          </section>

          {/* Address Form */}
          <form id="address-form" className="address-form">
            <fieldset>
              <legend>Enter Address Details</legend>

              <div className="form-group">
                <label htmlFor="houseNo">
                  House No. & Floor <span>*</span>
                </label>
                <input
                  type="text"
                  id="houseNo"
                  name="houseNo"
                  value={address.houseNo}
                  onChange={handleChange}
                  placeholder="E.g., 12A, 3rd Floor"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="buildingNo">
                  Building & Block No. <span>*</span>
                </label>
                <input
                  type="text"
                  id="buildingNo"
                  name="buildingNo"
                  value={address.buildingNo}
                  onChange={handleChange}
                  placeholder="E.g., Sky Tower, Block C"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="landmark">Landmark & Area (Optional)</label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={address.landmark}
                  onChange={handleChange}
                  placeholder="E.g., Near Central Mall"
                />
              </div>

              {/* Address Label Selection */}
              <div className="form-group">
                <label>Address Label</label>
                <div className="label-options">
                  {["Home", "Work", "Other"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className={`label-btn ${address.label === label ? "active" : ""}`}
                      onClick={() => setAddress((prev) => ({ ...prev, label }))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>
          </form>

          {/* Submit Button (Outside Form) */}
          <div className="save-address-submit-btn-container">
            <button
              type="button"
              className="save-address-submit-btn"
              onClick={handleSubmit} // Manually call handleSubmit
            >
              Save & Continue
            </button>
          </div>

        </div>
      </section>
    </>
  );
};

export default UserDeliveryAddress;
