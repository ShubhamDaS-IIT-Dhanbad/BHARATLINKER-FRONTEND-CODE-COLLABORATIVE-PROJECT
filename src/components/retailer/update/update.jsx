import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import Cookies from 'js-cookie';
import UploadBooksForm from './userProductUpdateForm.jsx';

import './userProductUpdate.css';

const UploadProduct = () => {
    const navigate = useNavigate();
    const { id: productId } = useParams();

    const products = useSelector((state) => state.userRefurbishedProducts.refurbishedProducts);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerShopData');
        if (userSession) {
            const parsedUserData = JSON.parse(userSession);
            setUserData(parsedUserData);

            // Find the product with the given ID
            const product = products.find((product) => product.$id === productId);
        }
    }, []);

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
                    {userData?.shopName && (
                        <div
                            className={`retailer-upload-product-header-shopname`}
                            aria-label="Change Location"
                            tabIndex={0}
                        >
                            {userData?.shopName?.toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            <UploadBooksForm userData={userData} />

        </>
    );
};

export default UploadProduct;
