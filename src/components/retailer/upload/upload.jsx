import React from 'react';
import { useNavigate} from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import UploadBooksForm from './userUploadProductForm.jsx';

import './upload.css';

const UploadProduct = ({retailerData}) => {
    const navigate = useNavigate();

    return (
        <>
           <div className='retailer-upload-header'>
    <FaArrowLeft
        className='retailer-upload-back-icon'
        size={25}
        onClick={() => navigate('/retailer')}
        aria-label="Back to Retailer Dashboard"
        tabIndex={0}
    />
    <div className='retailer-upload-header-content'>
        <h1 className='retailer-upload-title'>
            Upload New Product
            <span className='retailer-upload-title-underline'></span>
        </h1>
        <div
            className='retailer-upload-shopname'
            aria-label="Current Shop"
            tabIndex={0}
        >
            <span className='retailer-upload-shopname-icon'>🏪</span>
            {retailerData?.shopName}
        </div>
    </div>
</div>
           

            <UploadBooksForm retailerData={retailerData} />

        </>
    );
};

export default UploadProduct;
