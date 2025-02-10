import React from 'react';
import { TbClockSearch } from "react-icons/tb";

const NoProductsFound = () => {
    return (
        <div className='search-page-no-product-found'>
            <TbClockSearch size={60} />
            <div>No Product Found</div>
            <div style={{ fontWeight: "900" }}>In Your Area</div>
        </div>
    );
};

export default NoProductsFound;
