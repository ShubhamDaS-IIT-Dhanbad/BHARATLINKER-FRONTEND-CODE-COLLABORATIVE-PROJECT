import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LuCircleUserRound, LuContact } from "react-icons/lu";
import { CiImageOn } from "react-icons/ci";
import Cookies from "js-cookie";
import { Oval } from "react-loader-spinner";
import ProgressBar from "./progressBar.jsx";
import { updateShopImagesAndData } from "../../../appWrite/shop/shopData.js";
import "./shopData.css";


const MAX_SHOPNAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_KEYWORDS_LENGTH = 50;

const ShopInput = React.memo(({ field, value, maxLength, isTextArea, onChange }) => {
    const fieldName = field.replace(/shop/, "SHOP ").toUpperCase();
    return (
        <div className="shop-data-input-group">
            <fieldset>
                <legend>{fieldName}</legend>
                {isTextArea ? (
                    <>
                        <textarea
                            value={value}
                            onChange={(e) => onChange(e, field, maxLength)}
                        />
                        <div className="shop-data-char-count">
                            {value.length} / {maxLength}
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            value={value.toUpperCase()}
                            onChange={(e) => onChange(e, field, maxLength)}
                        />
                        <div className="shop-data-char-count">
                            {value.length} / {maxLength}
                        </div>
                    </>
                )}
            </fieldset>
        </div>
    );
});

const ShopCustomerCareInput = React.memo(({ value, onChange }) => (
    <div className="shop-data-input-group">
        <fieldset>
            <legend>SHOP CUSTOMER CARE</legend>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e, "shopCustomerCare", 15)}
            />
        </fieldset>
    </div>
));
const ShopEmailInput = React.memo(({ value, onChange }) => (
    <div className="shop-data-input-group">
        <fieldset>
            <legend>SHOP EMAIL</legend>
            <input
                type="email"
                value={value}
                onChange={(e) => onChange(e, "shopEmail", 50)}
            />
        </fieldset>
    </div>
));

const ImagePreview = React.memo(({ file, onDelete }) => (
    <div className="shop-data-image-preview">
        <img
            src={file instanceof File ? URL.createObjectURL(file) : file}
            alt="Preview"
        />
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
        shopCustomerCare: ""
    });
    const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    const formDataRef = useRef(formData);
    const toDeleteImagesUrlsRef = useRef([]);
    const filesRef = useRef(files);
    const steps = useMemo(
        () => [
            { title: "Shop Data", icon: <LuCircleUserRound size={40} /> },
            { title: "Contact", icon: <LuContact size={30} /> },
            { title: "Shop Images", icon: <CiImageOn size={30} /> },
        ],
        []
    );

    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    useEffect(() => {
        if (shopData) {
            setFormData({
                shopName: shopData.shopName || "",
                shopDescription: shopData.shopDescription || "",
                shopKeywords: shopData.shopKeywords || "",
                shopEmail: shopData.shopEmail || "",
                shopCustomerCare: shopData.shopCustomerCare || ""
            });
            setFiles(shopData.shopImages || []);
        }
    }, [shopData]);

    const handleInputChange = useCallback((e, field, maxLength) => {
        if (e.target.value.length <= maxLength) {
            setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        }
    }, []);

    // Modified to ensure maximum of 3 images
    const handleFileChange = useCallback((e) => {
        const newFiles = Array.from(e.target.files);
        setFiles((prev) => {
            const allowedCount = 3 - prev.length;
            if (allowedCount <= 0) return prev;
            return [...prev, ...newFiles.slice(0, allowedCount)];
        });
    }, []);

    const handleDeleteImage = useCallback((index) => {
        const fileToDelete = filesRef.current[index];
        if (typeof fileToDelete === "string") {
            toDeleteImagesUrlsRef.current.push(fileToDelete);
        }
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (isUploading) return;
        setIsUploading(true);

        try {
            const updatedFields = Object.keys(formDataRef.current).reduce((acc, key) => {
                if (formDataRef.current[key] !== (shopData[key] || "")) {
                    acc[key] = formDataRef.current[key];
                }
                return acc;
            }, {});

            const updatedShopData = await updateShopImagesAndData({
                shopId: shopData.shopId,
                toDeleteImagesUrls: toDeleteImagesUrlsRef.current,
                updatedData: updatedFields,
                newFiles: filesRef.current,
            });

            const existingData = JSON.parse(Cookies.get("BharatLinkerShopData") || "{}");
            Cookies.set(
                "BharatLinkerShopData",
                JSON.stringify({
                    ...existingData,
                    ...updatedShopData,
                }),
                { expires: 7 }
            );

            setUploadStatus(
                "Your file has been uploaded successfully! You can now proceed with the next steps or review the uploaded data."
            );
        } catch (error) {
            setUploadStatus("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            setShowInfo(true);
        }
    }, [isUploading, shopData]);

    const handleStepNavigation = useCallback((direction) => () => {
        setCurrentStep((prev) => prev + direction);
    }, []);

    return (
        <div className="shop-data-container">
            <ProgressBar steps={steps} currentStep={currentStep} />
            <div className="shop-data-section">
                {currentStep === 1 && (
                    <div className="shop-data-info-step">
                        {["shopName", "shopDescription", "shopKeywords"].map((field) => (
                            <ShopInput
                                key={field}
                                field={field}
                                value={formData[field]} maxLength={
                                    field === "shopDescription" ? MAX_DESCRIPTION_LENGTH :
                                        field === "shopName" ? MAX_SHOPNAME_LENGTH :
                                            field === "shopKeywords" ? MAX_KEYWORDS_LENGTH :
                                                500
                                }
                                isTextArea={field === "shopDescription"}
                                onChange={handleInputChange}
                            />
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
                        <ShopCustomerCareInput
                            value={formData.shopCustomerCare}
                            onChange={handleInputChange}
                        />
                        <ShopEmailInput
                            value={formData.shopEmail}
                            onChange={handleInputChange}
                        />
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="shop-data-image-upload-step">
                        <div
                            className="shop-data-dropzone"
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <p>Click to select</p>
                            <small>(Max 3 images, max size 2MB each use image compressor for optimization)</small>
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
                                <ImagePreview
                                    key={file instanceof File ? file.name : file}
                                    file={file}
                                    onDelete={() => handleDeleteImage(index)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="shop-data-button-container">
                {currentStep > 1 && (
                    <button onClick={handleStepNavigation(-1)}>Back</button>
                )}
                {currentStep < steps.length ? (
                    <button onClick={handleStepNavigation(1)}>Next</button>
                ) : (
                    <button onClick={handleSubmit} disabled={isUploading}>
                        {isUploading ? (
                            <Oval height={20} width={20} color="#fff" secondaryColor="#ccc" />
                        ) : (
                            "Submit"
                        )}
                    </button>
                )}
            </div>

            {showInfo && (
                <div className="shop-address-popup-overlay">
                    <div className="shop-address-popup-card">
                        <div className="shop-address-popup-pointer"></div>
                        <h2 className="shop-address-popup-title">Shop Data updation</h2>
                        <p style={{ fontSize: "13px" }} className="shop-address-popup-text">
                            {uploadStatus}
                        </p>
                        <div className="shop-address-popup-buttons">
                            <button
                                className="shop-address-popup-button-primary"
                                onClick={() => {
                                    setShowInfo(false);
                                    navigate("/secure/shopdata");
                                }}
                            >
                                OK
                            </button>
                            <button
                                className="shop-address-popup-button-secondary"
                                onClick={() => {
                                    setShowInfo(false);
                                    navigate("/secure/shopdata");
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ShopDataForm;
