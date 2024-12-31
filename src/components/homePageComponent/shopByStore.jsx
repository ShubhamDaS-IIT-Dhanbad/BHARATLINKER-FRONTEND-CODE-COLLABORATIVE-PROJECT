import React from 'react';
import './shopByStore.css';

import { RxCaretRight } from "react-icons/rx";

import i1 from './shopByStore/beauty.jpg';
import i2 from './shopByStore/medicine.jpg';
import i3 from './shopByStore/print.jpg';
import i4 from './shopByStore/sport.jpg';
import i5 from './shopByStore/toy.jpg';

const categories = [
    {
        image: i1,
        name: 'Beauty',
    },
    {
        image: i2,
        name: 'Medicine',
    },
    {
        image: i3,
        name: 'Print',
    },
    {
        image: i4,
        name: 'Sport',
    },
    {
        image: i5,
        name: 'Toys',
    },
];

const ShopByStore = () => {
    return (
        <div className="shop-by-store-section">
            <div className="shop-by-store-header">
                <h2>Shop By Store</h2>
            </div>


            <div className="shop-by-store-grid">
                {categories.map((category, index) => (
                    <div div key={index} className="shop-by-store-item">
                        <div key={index} className="shop-by-store-item-image">
                            <img src={category.image} alt={category.name} className="shop-by-store-image" />
                        </div>
                        <p className="shop-by-store-name">{category.name}</p>
                        {/* <p className="shop-by-store">Store</p> */}
                    </div>
                ))}

            </div>

        </div>
    );
};

export default ShopByStore;
