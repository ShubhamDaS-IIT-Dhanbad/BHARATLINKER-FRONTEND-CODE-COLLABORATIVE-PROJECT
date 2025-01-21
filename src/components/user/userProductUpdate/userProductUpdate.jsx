import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import Cookies from 'js-cookie';
import UploadBooksForm from './userProductUpdateForm.jsx';

import Navbar from '../a.navbarComponent/navbar.jsx';
import './userProductUpdate.css';

const UploadProduct = () => {
    const navigate = useNavigate();
    const { id: productId } = useParams();
    const [productType, setProductType] = useState('');

    const products = useSelector((state) => state.userRefurbishedProducts.refurbishedProducts);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUserData');
        if (userSession) {
            const parsedUserData = JSON.parse(userSession);
            setUserData(parsedUserData);

            // Find the product with the given ID
            const product = products.find((product) => product.$id === productId);
            if (product) {
                setProductType(product.productType); // Safely set productType
            }
        }
    }, []);

    return (
        <>
            <header>
                <Navbar headerTitle={"UPDATE REFURBISHED"} />
            </header>

            <UploadBooksForm userData={userData} productType={productType} />
            <footer>
                <p className="dashboard-footer-p">© 2025 Bharat Linker</p>
            </footer>
        </>
    );
};

export default UploadProduct;
