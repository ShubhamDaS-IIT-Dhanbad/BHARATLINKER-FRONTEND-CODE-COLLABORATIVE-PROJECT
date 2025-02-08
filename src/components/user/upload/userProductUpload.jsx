import React from 'react';
import UploadBooksForm from './userUploadProductForm.jsx';
import Navbar from '../navbar.jsx';
import '../style/userProductUpload.css';

const UploadProduct = ({userData}) => {
    return (
        <>
            <header>
            <Navbar userData={userData} headerTitle={"UPLOAD REFURBISHED"} />
            </header>
            <UploadBooksForm userData={userData ? userData : {}}/>

        </>
    );
};

export default UploadProduct;
