import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import Cookies from 'js-cookie';
import UploadBooksForm from './userUploadProductForm.jsx';

import Navbar from '../a.navbarComponent/navbar.jsx';
import './userProductUpload.css';

const UploadProduct = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState('');
    const { productType } = useParams();

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUserData');
        if (userSession) {
            setUserData(JSON.parse(userSession));
        }
    }, [productType]);

    return (
        <>
            <header>
                <Navbar headerTitle={"UPLOAD REFURBISHED"} />
            </header>
            {
                productType != 'gadget' && <div className='user-upload-book-type'>
                    <div
                        className={`user-upload-book-type-book ${productType === 'book' ? 'active' : ''}`}
                        onClick={() => navigate('/user/upload/book')}
                    >
                        Book
                    </div>
                    <div
                        className={`user-upload-book-type-module ${productType === 'module' ? 'active' : ''}`}
                        onClick={() => navigate('/user/upload/module')}
                    >
                        Module
                    </div>
                </div>
            }

            <UploadBooksForm userData={userData} productType={productType} />

            <footer>
                <p className='dashboard-footer-p'>© 2025 Bharat Linker</p>
            </footer>
        </>
    );
};

export default UploadProduct;
