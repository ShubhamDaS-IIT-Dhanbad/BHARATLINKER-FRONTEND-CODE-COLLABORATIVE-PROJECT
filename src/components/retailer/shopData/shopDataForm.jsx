import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LuCircleUserRound, LuContact } from "react-icons/lu";
import { CiImageOn } from "react-icons/ci";
import Cookies from "js-cookie";
import { Oval } from "react-loader-spinner";
import { updateShopImagesAndData } from "../../../appWrite/shop/shopData.js";
import "./shopData.css";
import sd1 from '../asset/r1.png'
const MAX_LENGTHS = {
  shopName: 50,
  shopDescription: 2000,
  shopKeywords: 50,
  shopCustomerCare: 15,
  shopEmail: 50,
};

const ShopInput = React.memo(({ field, value, onChange }) => {
  const isTextArea = field === "shopDescription";
  const maxLength = MAX_LENGTHS[field];
  return (
    <div className="shop-data-input-group">
      <fieldset>
        <legend>{field.replace(/shop/, "SHOP ").toUpperCase()}</legend>
        {isTextArea ? (
          <textarea value={value} onChange={(e) => onChange(e, field, maxLength)} />
        ) : (
          <input
            type="text"
            value={field === "shopName" ? value.toUpperCase() : value}
            onChange={(e) => onChange(e, field, maxLength)}
          />
        )}
        <div className="shop-data-char-count">{value.length} / {maxLength}</div>
      </fieldset>
    </div>
  );
});

const ShopSpecialInput = React.memo(({ field, value, onChange, type = "text" }) => (
  <div className="shop-data-input-group">
    <fieldset>
      <legend>{field.replace(/shop/, "SHOP ").toUpperCase()}</legend>
      <input type={type} value={value} onChange={(e) => onChange(e, field, MAX_LENGTHS[field])} />
    </fieldset>
  </div>
));

const ImagePreview = React.memo(({ file, onDelete }) => (
  <div className="shop-data-image-preview">
    <img src={file instanceof File ? URL.createObjectURL(file) : file} alt="Preview" />
    <button onClick={onDelete}>×</button>
  </div>
));

const ShopDataForm = React.memo(({ shopData }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    shopKeywords: "",
    shopEmail: "",
    shopCustomerCare: "",
  });
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const formDataRef = useRef(formData);
  const filesRef = useRef(files);
  const toDeleteImagesUrlsRef = useRef([]);
  const steps = useMemo(() => [
    { title: "Shop Data", icon: <LuCircleUserRound size={40} /> },
    { title: "Contact", icon: <LuContact size={30} /> },
    { title: "Shop Images", icon: <CiImageOn size={30} /> },
  ], []);

  useEffect(() => {
    formDataRef.current = formData;
    filesRef.current = files;
  }, [formData, files]);

  useEffect(() => {
    if (shopData) {
      setFormData({ ...formData, ...shopData });
      setFiles(shopData.shopImages || []);
    }
  }, [shopData]);

  const handleInputChange = useCallback((e, field, maxLength) => {
    if (e.target.value.length <= maxLength) {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files).slice(0, 3 - files.length);
    setFiles((prev) => [...prev, ...newFiles]);
  }, [files.length]);

  const handleDeleteImage = useCallback((index) => {
    const fileToDelete = filesRef.current[index];
    if (typeof fileToDelete === "string") toDeleteImagesUrlsRef.current.push(fileToDelete);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isUploading) return;
    setIsUploading(true);
    try {
      const updatedFields = Object.keys(formDataRef.current).reduce(
        (acc, key) =>
          formDataRef.current[key] !== (shopData[key] || "") ? { ...acc, [key]: formDataRef.current[key] } : acc,
        {}
      );
      const updatedShopData = await updateShopImagesAndData({
        shopId: shopData.shopId,
        toDeleteImagesUrls: toDeleteImagesUrlsRef.current,
        updatedData: updatedFields,
        newFiles: filesRef.current,
      });
      Cookies.set(
        "BharatLinkerShopData",
        JSON.stringify({ ...JSON.parse(Cookies.get("BharatLinkerShopData") || "{}"), ...updatedShopData }),
        { expires: 7 }
      );
      setUploadStatus("Your Shop Data Has been successfully updated .");
    } catch (error) {
      setUploadStatus("Updation failed. Please try again.");
    } finally {
      setIsUploading(false);
      setShowInfo(true);
    }
  }, [isUploading, shopData]);

  const navigateStep = useCallback((direction) => () => setCurrentStep((prev) => prev + direction), []);

  return (
    <>
      {isUploading && <div className="overlay" />}
      <div className="shop-data-container">
        <div className="shop-data-pic-header">
          <img src={sd1} className="shop-data-pic" alt="Shop" />
        </div>
        <div className="shop-data-section">
          {currentStep === 1 && (
            <div className="shop-data-info-step">
              <div className="shop-data-1-desc">
                🔄 Click <b>Update</b> to save. 📩 Retailers get <b>Email</b> notifications. 📞 <b>Customer Care</b> visible.
              </div>
              {["shopName", "shopDescription", "shopKeywords"].map((field) => (
                <ShopInput key={field} field={field} value={formData[field]} onChange={handleInputChange} />
              ))}
            </div>
          )}
          {currentStep === 2 && (
            <div className="contact-step">
              <div className="shop-data-input-group">
                <fieldset>
                  <legend>SHOP PHONE-NUMBER</legend>
                  <p>{shopData.shopPhoneNumber}</p>
                </fieldset>
              </div>
              <ShopSpecialInput field="shopCustomerCare" value={formData.shopCustomerCare} onChange={handleInputChange} type="number" />
              <ShopSpecialInput field="shopEmail" value={formData.shopEmail} onChange={handleInputChange} type="email" />
            </div>
          )}
          {currentStep === 3 && (
            <div className="shop-data-image-upload-step">
              <div className="shop-data-dropzone" onClick={() => document.getElementById("fileInput").click()}>
                <p>Click to select</p>
                <small>(Max 3 images, 2MB each, use compressor)</small>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
              </div>
              <div className="shop-data-img-container">
                {files.map((file, index) => (
                  <ImagePreview key={file instanceof File ? file.name : file} file={file} onDelete={() => handleDeleteImage(index)} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="shop-data-button-container">
          {currentStep === 1 && <button onClick={() => { }}>RESET</button>}
          {currentStep > 1 && <button onClick={navigateStep(-1)}>BACK</button>}
          {currentStep < steps.length ? (
            <button onClick={navigateStep(1)}>NEXT</button>
          ) : (
            <button
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? <Oval height={20} width={20} color="#fff" secondaryColor="#ccc" /> : "UPDATE"}
            </button>
          )}
        </div>
        {showInfo && (
          <div className="shop-address-popup-overlay">
            <div className="shop-address-popup-card">
              <div className="shop-address-popup-pointer"></div>
              <h2 className="shop-address-popup-title">Shop Data updation</h2>
              <p style={{ fontSize: "13px" }} className="shop-address-popup-text">{uploadStatus}</p>
              <div className="shop-address-popup-buttons">
                <button className="shop-address-popup-button-primary" onClick={() => { setShowInfo(false); navigate("/secure/shopdata"); }}>
                  OK
                </button>
                <button className="shop-address-popup-button-secondary" onClick={() => { setShowInfo(false); navigate("/secure/shopdata"); }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default ShopDataForm;