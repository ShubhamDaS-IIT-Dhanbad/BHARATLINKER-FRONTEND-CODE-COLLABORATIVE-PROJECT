import React from 'react';
import { useNavigate} from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import UploadBooksForm from './userUploadProductForm.jsx';

import './upload.css';

const UploadProduct = ({retailerData}) => {
    const navigate = useNavigate();

    return (
        <>
            <div className='retailer-upload-product-header'>
                <FaArrowLeft
                    id='user-upload-books-header-left-icon'
                    size={25}
                    onClick={() => navigate('/retailer')}
                    aria-label="User Account"
                    tabIndex={0}
                />
                <div className='user-upload-books-header-inner-div'>
                    <p className='user-upload-books-header-inner-div-p'>UPLOAD PRODUCTS</p>
                    <div
                        className={`retailer-upload-product-header-shopname`}
                        aria-label="Change Location"
                        tabIndex={0}
                    >
                        {retailerData?.shopName?.toUpperCase()}
                    </div>
                </div>
            </div>
           

            <UploadBooksForm retailerData={retailerData} />

        </>
    );
};

export default UploadProduct;
