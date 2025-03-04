import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';

import AddToCartTab from "./viewCart/viewCart.jsx";
import SearchBar from '../navbar.jsx';
import d1 from './d11.png';
const s1 = "https://res.cloudinary.com/demc9mecm/image/upload/v1741102460/s1_i7wbfi.png";
import '../searchPage/searchPage.css';

const SearchPage = () => {

    return (
        <>
            <div id="productSearchPage-container-top">
                <SearchBar
                    headerTitle={"DELIVERY IN MINUTES"}
                />
            </div>

            <div className='search-not-found'>
                <img src={d1} alt="No products available"id="no-products-image" />
                <p>we are not available in your</p>
                <p>area yet.</p>
            </div>
            {<AddToCartTab totalQuantity={0} totalPrice={0} />}

        </>
    );
};

export default SearchPage;
