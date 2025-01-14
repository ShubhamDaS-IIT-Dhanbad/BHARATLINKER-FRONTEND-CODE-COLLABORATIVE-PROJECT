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
            <div className='user-upload-books-header'>
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
                        className={`user-upload-books-header-inner-div-phn-div`}
                        aria-label="Change Location"
                        tabIndex={0}
                    >
                        {userData?.phoneNumber}
                    </div>
                </div>
            </div>
           

            <UploadBooksForm userData={userData} />

            <footer>
                <p className='dashboard-footer-p'>© 2025 Bharat Linker</p>
            </footer>
        </>
    );
};

export default UploadProduct;
