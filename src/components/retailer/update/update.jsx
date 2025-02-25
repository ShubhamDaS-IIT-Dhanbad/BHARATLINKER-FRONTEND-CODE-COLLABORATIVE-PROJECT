import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UploadForm from './updateForm.jsx';
import Navbar from '../navbar.jsx';
import '../style/upload.css';

const UploadProduct = ({ shopData }) => {
    const navigate = useNavigate();
    const { id: productId } = useParams();
    const [product, setProduct] = useState(null);
    const products = useSelector((state) => state.retailerProducts.products);

    useEffect(() => {
        window.scrollTo(0, 0);
        const selectedProduct = products.find((product) => product.$id === productId);
        if (selectedProduct) {
            setProduct(selectedProduct);
        } else {
            navigate('/secure/retailer/products');
        }
    }, [products, productId, navigate]);

    return (
        <div className="upload-product-wrapper">
            <header>
                <Navbar
                    onBackNavigation={() => navigate(-1)}
                    shopData={shopData}
                    headerTitle="Update Product"
                    infoTitle="Update Product Details"
                    infoDescription="If a product is marked as out of stock, it will be displayed to users with an 'Out of Stock' tag. However, if a product is deactivated, it will not be visible to users."
                />
            </header>
            <UploadForm shopData={shopData} product={product} />
        </div>
    );
};

export default UploadProduct;

