import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import UploadBooksForm from './userUploadProductForm.jsx';
import Navbar from '../navbar.jsx';
import './userProductUpload.css';

const UploadProduct = ({userData}) => {
    const navigate = useNavigate();
    const { productType } = useParams();

    return (
        <>
            <header>
                <Navbar userData={userData} headerTitle={"UPLOAD REFURBISHED"} />
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
