import React from 'react';
import UploadBooksForm from './userUploadProductForm.jsx';
import Navbar from '../navbar.jsx';
import './userProductUpload.css';

const UploadProduct = ({userData}) => {
    if(userData.address.length==0){alert("firts set a address");}
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
