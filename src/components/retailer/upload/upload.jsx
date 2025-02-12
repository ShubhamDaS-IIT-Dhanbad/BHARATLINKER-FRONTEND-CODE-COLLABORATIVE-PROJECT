import React from 'react';
import UploadBooksForm from './userUploadProductForm.jsx';
import Navbar from '../navbar.jsx';
import '../style/userProductUpload.css';

const UploadProduct = ({shopData}) => {
    return (
        <>
            <header>
            <Navbar shopData={shopData} headerTitle={"UPLOAD PRODUCT"} />
            </header>
            <UploadBooksForm shopData={shopData}/>

        </>
    );
};

export default UploadProduct;
