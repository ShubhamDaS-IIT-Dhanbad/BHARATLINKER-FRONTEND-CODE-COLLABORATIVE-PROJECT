import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import Cookies from 'js-cookie';
import UploadBooksForm from './userUploadProductForm.jsx';

import './upload.css';

const UploadProduct = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState('');

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerShopData');
        if (userSession) {
            setUserData(JSON.parse(userSession));
        }
    }, []);

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
                        {userData?.shopName?.toUpperCase()}
                    </div>
                </div>
            </div>
           

            <UploadBooksForm userData={userData} />

        </>
    );
};

export default UploadProduct;
