import React from 'react';
import './exploreByCategory.css';

import { RxCaretRight } from "react-icons/rx";

import i1 from './exploreByCategoryImg/i1.webp';
import i2 from './exploreByCategoryImg/i2.webp';
import i3 from './exploreByCategoryImg/i3.webp';
import i4 from './exploreByCategoryImg/i4.webp';
import i5 from './exploreByCategoryImg/i5.webp';
import i6 from './exploreByCategoryImg/i6.webp';
import i7 from './exploreByCategoryImg/i7.webp';
import i8 from './exploreByCategoryImg/i8.webp';
import i9 from './exploreByCategoryImg/i9.webp';
import i10 from './exploreByCategoryImg/i10.webp';
import i11 from './exploreByCategoryImg/i11.webp';
import i12 from './exploreByCategoryImg/i12.webp';
import i13 from './exploreByCategoryImg/i13.webp';
import i14 from './exploreByCategoryImg/i14.webp';
import i15 from './exploreByCategoryImg/i15.webp';
import i16 from './exploreByCategoryImg/i16.webp';
import i17 from './exploreByCategoryImg/i17.webp';
import i18 from './exploreByCategoryImg/i18.webp';
import i19 from './exploreByCategoryImg/i19.webp';
import i20 from './exploreByCategoryImg/i20.webp';
import i21 from './exploreByCategoryImg/i21.webp';
import i22 from './exploreByCategoryImg/i22.webp';
import i23 from './exploreByCategoryImg/i23.webp';
import i24 from './exploreByCategoryImg/i24.webp';

import i26 from './exploreByCategoryImg/i26.webp';
import i27 from './exploreByCategoryImg/i27.webp';
import i28 from './exploreByCategoryImg/i28.webp';
import i29 from './exploreByCategoryImg/i29.webp';
import i30 from './exploreByCategoryImg/i30.webp';
import i31 from './exploreByCategoryImg/i31.webp';

const categories = [
  {
    image: i3,
    name: 'Fruits & Vegetables',
  },
  {
    image: i4,
    name: 'Atta, Rice, Oil & Dals',
  },
  {
    image: i5,
    name: 'Masala & Dry Fruits',
  },
  {
    image: i6,
    name: 'Zepto Cafe',
  },
  {
    image: i7,
    name: 'Sweet Cravings',
  },
  {
    image: i8,
    name: 'Toys & Sports',
  },
  {
    image: i9,
    name: 'Apparel & Lifestyle',
  },
  {
    image: i10,
    name: 'Jewellery & Accessories',
  },
  {
    image: i11,
    name: 'Frozen Food',
  },
  {
    image: i12,
    name: 'Ice Creams & More',
  },
  {
    image: i13,
    name: 'Ice Creams & More',
  },
  {
    image: i14,
    name: 'Ice Creams & More',
  },
  {
    image: i15,
    name: 'Ice Creams & More',
  },
  {
    image: i17,
    name: 'Ice Creams & More',
  },
  {
    image: i18,
    name: 'Ice Creams & More',
  },
  {
    image: i19,
    name: 'Ice Creams & More',
  },
  {
    image: i20,
    name: 'Ice Creams & More',
  },
  {
    image: i21,
    name: 'Ice Creams & More',
  },
  {
    image: i22,
    name: 'Ice Creams & More',
  },
  {
    image: i23,
    name: 'Ice Creams & More',
  },
  {
    image: i24,
    name: 'Ice Creams & More',
  },
  {
    image: i26,
    name: 'Ice Creams & More',
  },
  {
    image: i27,
    name: 'Ice Creams & More',
  },

 
  {
    image: i31,
    name: 'Ice Creams & More',
  }
  // Add more categories as needed
];

const ExploreByCategories = () => {
  return (
    <div className="explore-by-categories-section">
      <div className="explore-by-category-header">
        <h2>Explore By Categories</h2>
      </div>

      <div className="explore-by-categories-grid-two">
          <div  className="explore-by-category-two">
            <img src={i1} className="explore-by-category-image-two" />
            <p className="explore-by-category-name-two"></p>
          </div>
          <div  className="explore-by-category-two">
            <img src={i2} className="explore-by-category-image-two" />
            <p className="explore-by-category-name-two"></p>
          </div>
      </div>

      <div className="explore-by-categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="explore-by-category">
            <img src={category.image} alt={category.name} className="explore-by-category-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreByCategories;
