import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from './uploadForm.jsx';
import Navbar from '../navbar.jsx';
import '../style/upload.css';

const UploadProduct = ({ shopData }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path, { replace: true });
    };

  

    return (
        <div className="upload-product-wrapper">
            <header>
                <Navbar
                    onBackNavigation={() => handleNavigation('/secure/shop')}
                    shopData={shopData}
                    headerTitle={"UPLOAD SECTION"}
                    infoTitle={"Upload Guidance"}
                    infoDescription={
                        "Easily upload and manage products on your online store with our intuitive product upload system. " +
                        "Quick and seamless product upload process with a user-friendly interface for hassle-free management. " +
                        "Step-by-step upload guidance for accurate product listing, supporting multiple product categories and variations. " +
                        "Ensures optimized product details for better search visibility, helping enhance SEO and improve product discoverability."
                    }
                />
            </header>
            <UploadForm shopData={shopData} />
        </div>
    );
};

export default UploadProduct;