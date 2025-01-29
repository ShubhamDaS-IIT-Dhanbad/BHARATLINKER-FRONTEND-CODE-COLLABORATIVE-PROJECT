import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import UploadBooksForm from './updateForm.jsx';

import './update.css';

const UploadProduct = ({ retailerData }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className='retailer-product-upload-header-container'>
                <FaArrowLeft
                    className='retailer-product-upload-header-back-btn'
                    size={25}
                    onClick={() => navigate('/retailer/products')}
                    aria-label="Back to Retailer Dashboard"
                    tabIndex={0}
                />
                <div className='retailer-product-upload-header-content'>
                    <h1 className='retailer-product-upload-header-main-title'>
                        Update Product Data
                        <span className='retailer-product-upload-header-title-decoration'></span>
                    </h1>
                    <div
                        className='retailer-product-upload-header-shop-badge'
                        aria-label="Current Shop"
                        tabIndex={0}
                    >
                        <span className='retailer-product-upload-header-shop-icon'>🏪</span>
                        {retailerData?.shopName}
                    </div>
                </div>
            </div>

            <UploadBooksForm userData={retailerData} />

        </>
    );
};

export default UploadProduct;
