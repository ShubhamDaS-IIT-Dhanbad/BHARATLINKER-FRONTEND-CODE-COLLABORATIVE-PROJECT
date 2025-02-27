import React from 'react';
import ShopCard from './shopCard.jsx';

import e1 from '../../assets/e1.png';
const ShopList = ({ shops, loading }) => {

  if (!loading && shops?.length === 0) {
    const notfound = 'https://res.cloudinary.com/demc9mecm/image/upload/v1736953901/ir4hy5fcwevhr8ibeaqq.png';
    return (
      <div className='search-not-found'>
        <img src={e1} alt="No products available" className="no-products-image" />
        <p>Oops! We couldn't find any shops in this area yet.</p>
      </div>
    );
  }

  return (
    <>
      <div id="search-shop-grid">
        {shops?.length > 0 && (
          <>
            {shops?.map(shop => (
              <div key={shop.$id}>
                <ShopCard shop={shop} />
              </div>
            ))}

          </>
        )}
      </div>

    </>

  );
};

export default ShopList;
