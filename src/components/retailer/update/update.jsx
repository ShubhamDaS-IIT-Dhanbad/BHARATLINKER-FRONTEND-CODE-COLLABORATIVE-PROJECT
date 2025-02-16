import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UploadForm from './updateForm.jsx';
import { useNavigate } from 'react-router-dom';

import Navbar from '../navbar.jsx';
import '../style/upload.css';

const UploadProduct = ({ shopData }) => {
    const navigate=useNavigate();

    const { id: productId } = useParams();
    const [product, setProduct] = useState('');
    const products = useSelector((state) => state.retailerProducts.products);
    useEffect(() => {
        window.scrollTo(0,0);
        const product = products.find((product) => product.$id === productId);
        if (product) {setProduct(product);
        }else{navigate('/user/refurbished')}
    }, []);

    return (
        <>
            <header>
                <Navbar  onBackNavigation={()=>{navigate(-1)}} shopData={shopData} headerTitle={"UPDATE PRODUCT"} />
            </header>
            <UploadForm shopData={shopData} product={product} />

        </>
    );
};

export default UploadProduct;
