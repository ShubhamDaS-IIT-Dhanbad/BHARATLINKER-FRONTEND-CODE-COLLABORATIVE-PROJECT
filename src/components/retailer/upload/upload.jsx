import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import UploadBooksForm from './userUploadProductForm.jsx';
import './upload.css';

const UploadProduct = ({ retailerData }) => {
    const navigate = useNavigate();
    const { total } = useSelector((state) => state.retailerProducts);

    useEffect(() => {
        if (total >= retailerData.productCount) {
            alert('You have reached the maximum number of products allowed in your shop.');
            navigate('/retailer');
        }
        
    }, [total, retailerData, navigate]);
    if (retailerData && total >= retailerData.productCount) {
        return null;
    }

    return (
        <>
            <div className='retailer-product-upload-header-container'>
                <FaArrowLeft
                    className='retailer-product-upload-header-back-btn'
                    size={25}
                    onClick={() => navigate('/retailer')}
                    aria-label="Back to Retailer Dashboard"
                    tabIndex={0}
                />
                <div className='retailer-product-upload-header-content'>
                    <h1 className='retailer-product-upload-header-main-title'>
                        Upload New Product
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
            <UploadBooksForm retailerData={retailerData} />
        </>
    );
};

export default UploadProduct;