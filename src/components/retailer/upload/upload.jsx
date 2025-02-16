import React from 'react';
import UploadForm from './uploadForm.jsx';
import Navbar from '../navbar.jsx';
import '../style/upload.css';

const UploadProduct = ({shopData}) => {
    return (
        <>
            <header>
            <Navbar shopData={shopData} headerTitle={"UPLOAD PRODUCT"} />
            </header>
            <UploadForm shopData={shopData}/>

        </>
    );
};

export default UploadProduct;
