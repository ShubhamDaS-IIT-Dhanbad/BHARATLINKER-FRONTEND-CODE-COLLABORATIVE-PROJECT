import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import UploadBooksForm from './userUploadProductForm.jsx';

import useUserAuth from '../../../hooks/userAuthHook.jsx';
import Navbar from '../a.navbarComponent/navbar.jsx';
import './userProductUpload.css';

const UploadProduct = () => {
    const navigate = useNavigate();
    
    const { userData } = useUserAuth();
    const { productType } = useParams();

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

            <UploadBooksForm userData={userData ? userData : {}} productType={productType} />

        </>
    );
};

export default UploadProduct;
