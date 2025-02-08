import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UploadBooksForm from './userProductUpdateForm.jsx';

import { useNavigate } from 'react-router-dom';

import Navbar from '../navbar.jsx';
import './userProductUpdate.css';

const UploadProduct = ({ userData }) => {
    const navigate=useNavigate();

    const { id: productId } = useParams();
    const [product, setProduct] = useState('');
    const products = useSelector((state) => state.userRefurbishedProducts.refurbishedProducts);
    useEffect(() => {
        window.scrollTo(0,0);
        const product = products.find((product) => product.$id === productId);
        if (product) {setProduct(product);
        }else{navigate('/user/refurbished')}
    }, []);

    return (
        <>
            <header>
                <Navbar  onBackNavigation={()=>{navigate(-1)}} userData={userData} headerTitle={"UPDATE REFURBISHED"} />
            </header>
            <UploadBooksForm userData={userData} product={product} />

        </>
    );
};

export default UploadProduct;
