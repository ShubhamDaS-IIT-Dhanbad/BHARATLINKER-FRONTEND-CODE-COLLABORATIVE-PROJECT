import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';

import AddToCartTab from "./viewCart/viewCart.jsx";
import SearchBar from '../navbar.jsx';

const s1="https://res.cloudinary.com/demc9mecm/image/upload/v1741102460/s1_i7wbfi.png";
import '../searchPage/searchPage.css';

const SearchPage = () => { 

    return (
        <>
            <div id="productSearchPage-container-top">
                <SearchBar
                    headerTitle={"DELIVERY IN MINUTES"}
                />
            </div>

            
            {<AddToCartTab totalQuantity={0} totalPrice={0} />}
            
        </>
    );
};

export default SearchPage;
