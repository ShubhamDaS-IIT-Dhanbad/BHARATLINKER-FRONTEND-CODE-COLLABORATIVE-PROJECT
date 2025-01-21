import React from 'react';
import { Oval } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';  // Import useLocation and useNavigate
import SearchPageProductCard from './productCard.jsx';
import '../style/productList.css';

const NoProductsFound = () => {
    const notfound = 'https://res.cloudinary.com/demc9mecm/image/upload/v1736953901/ir4hy5fcwevhr8ibeaqq.png';
    return (
        <div className='search-shop-no-shop-found'>
            <img src={notfound} alt="No products found" />
        </div>
    );
};

const ProductList = () => {
    const location = useLocation(); 
    const navigate = useNavigate();  // Hook to navigate to different routes
    const { products, loading, loadingMoreProducts, hasMoreProducts } = useSelector((state) => state.searchproducts);
    const { refurbishedProducts, loading: refurbishedLoading, error, currentPage, hasMoreProducts: refurbishedHasMoreProducts, loadingMoreProducts: refurbishedLoadingMoreProducts } = useSelector((state) => state.userRefurbishedProducts);

    // Check if we're on the /user/refurbished page
    const isRefurbishedPage = location.pathname === '/user/refurbished';

    const productsToRender = isRefurbishedPage ? refurbishedProducts : products;
    const loadingState = isRefurbishedPage ? refurbishedLoading : loading;
    const loadingMoreState = isRefurbishedPage ? refurbishedLoadingMoreProducts : loadingMoreProducts;
    const hasMoreState = isRefurbishedPage ? refurbishedHasMoreProducts : hasMoreProducts;

    if (!loadingState && productsToRender.length === 0 && !hasMoreState) {
        return <NoProductsFound />;
    }

    // Handler for the edit button click to navigate to /user/update
    const handleEditClick = (productId) => {
        navigate(`/user/update/${productId}`);
    };

    return (
        <>
            <div id="product-page-grid">
                {productsToRender.map((product) => (
                    <div key={product.$id} className="product-item">
                        <SearchPageProductCard
                            id={product.$id}
                            discountedPrice={product.discountedPrice}
                            image={product.images}
                            title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                            price={product.price}
                            isInStock={product.isInStock}
                        />
                        
                        
                    </div>
                ))}
            </div>

            {hasMoreState && loadingMoreState && (
                <div className='productSearchPage-loading-more-products'>
                    <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                                   </div>
            )}
        </>
    );
};

export default ProductList;
