import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UploadBooksForm from './userProductUpdateForm.jsx';

import Navbar from '../navbar.jsx';
import './userProductUpdate.css';

const UploadProduct = ({ userData }) => {
    const navigate = useNavigate();
    const { id: productId } = useParams();
    const [productType, setProductType] = useState('');

    const products = useSelector((state) => state.userRefurbishedProducts.refurbishedProducts);

    useEffect(() => {
        const product = products.find((product) => product.$id === productId);
        if (product) {setProductType(product.productType);}
    }, []);

    return (
        <>
            <header>
                <Navbar userData={userData} headerTitle={"UPDATE REFURBISHED"} />
            </header>

            <UploadBooksForm userData={userData} productType={productType} />
            <footer>
                <p className="dashboard-footer-p">© 2025 Bharat Linker</p>
            </footer>
        </>
    );
};

export default UploadProduct;
