import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import Cookies from 'js-cookie';
import UploadBooksForm from './uploadBooksForm.jsx';

import './bookUpload.css';

const UploadProduct = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('book');
    const [userData, setUserData] = useState('');

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUser');
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
                    onClick={() => navigate('/user')}
                    aria-label="User Account"
                    tabIndex={0}
                />
                <div className='user-upload-books-header-inner-div'>
                    <p className='user-upload-books-header-inner-div-p'>UPLOAD {type.toUpperCase()}</p>
                    <div
                        className={`user-upload-books-header-inner-div-phn-div`}
                        onClick={() => navigate('/pincode')}
                        aria-label="Change Location"
                        tabIndex={0}
                    >
                        {userData?.phn}
                    </div>
                </div>
            </div>

            <div className='user-upload-book-type'>
                <div
                    className={`user-upload-book-type-book ${type === 'book' ? 'active' : ''}`}
                    onClick={() => setType('book')}
                >
                    Book
                </div>
                <div
                    className={`user-upload-book-type-module ${type === 'module' ? 'active' : ''}`}
                    onClick={() => setType('module')}
                >
                    Module
                </div>
            </div>

            {type === 'book' && (
                <UploadBooksForm userData={userData} productType={type} />
            )}
            {type === 'module' && (
                <UploadBooksForm userData={userData} productType={type} />
            )}

            <footer>
                <p className='dashboard-footer-p'>© 2025 Bharat Linker</p>
            </footer>
        </>
    );
};

export default UploadProduct;