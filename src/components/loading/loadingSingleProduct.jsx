import React from 'react';
import './loadingSingleProduct.css'

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingSingleProductPage = () => {
    return (
        <div id="loading-single-product-details">
            <Skeleton height={300} style={{ marginTop: '20px',width:"100vw" }} />

            <Skeleton height={60} style={{ width:"70vw",marginBottom: '10px',}} />
            <Skeleton height={120}  style={{ marginBottom: '10px' }} />
            <Skeleton height={60} width={100} style={{ marginBottom: '20px' }} />
            <Skeleton height={30} style={{ width:"90vw",marginBottom: '10px' }} />
        </div>
    );
}

export default LoadingSingleProductPage;
