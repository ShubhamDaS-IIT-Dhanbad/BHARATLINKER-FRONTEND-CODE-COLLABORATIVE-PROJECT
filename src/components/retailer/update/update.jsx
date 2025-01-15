import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import Cookies from 'js-cookie';
import UploadBooksForm from './userProductUpdateForm.jsx';

import './userProductUpdate.css';

const UploadProduct = () => {
    const navigate = useNavigate();
    const { id: productId} = useParams();

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
            <div className="user-update-book-module-header">
                <FaArrowLeft
                    id="user-update-book-module-header-left-icon"
                    size={25}
                    onClick={() => navigate('/retailer/products')}
                    aria-label="User Account"
                    tabIndex={0}
                />
                <div className="user-update-book-module-header-inner-div">
                    <p className="user-update-book-module-header-inner-div-p">
                        UPDATE PRODUCT
                    </p>
                    <div
                        className="user-update-book-module-header-inner-div-phn-div"
                        aria-label="Change Location"
                        tabIndex={0}
                    >
                        {userData?.shopName.toUpperCase() || 'No Phone Number'}
                    </div>
                </div>
            </div>

            <UploadBooksForm userData={userData} />
            <footer>
                <p className="dashboard-footer-p">© 2025 Bharat Linker</p>
            </footer>
        </>
    );
};

export default UploadProduct;
