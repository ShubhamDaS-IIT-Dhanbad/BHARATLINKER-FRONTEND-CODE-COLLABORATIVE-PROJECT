import React from 'react';
import { useNavigate} from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import UploadBooksForm from './userProductUpdateForm.jsx';

import './userProductUpdate.css';

const UploadProduct = ({ retailerData }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className="retailer-update-header">
                <FaArrowLeft
                    id="retailer-update-header-left-icon"
                    size={25}
                    onClick={() => navigate('/retailer/products')}
                    aria-label="User Account"
                    tabIndex={0}
                />
                <div className="retailer-update-header-inner-div">
                    <p className="retailer-update-header-inner-div-p">
                        UPDATE PRODUCT
                    </p>
                    {retailerData?.shopName && (
                        <div
                            className={`retailer-upload-product-header-shopname`}
                            aria-label="Change Location"
                            tabIndex={0}
                        >
                            {retailerData?.shopName?.toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            <UploadBooksForm userData={retailerData} />

        </>
    );
};

export default UploadProduct;
