import React from 'react';
import ShopCard from './shopCard.jsx';

const e1="https://res.cloudinary.com/demc9mecm/image/upload/v1741102459/e1_aj3axb.png";
const ShopList = ({ shops, loading }) => {

  if (!loading && shops?.length === 0) {
    return (
      <div className='search-not-found'>
        <img src={e1} alt="No products available" id="no-products-image" />
        <p>Oops! We couldn't find any shops in this</p>
        <p>area yet.</p>
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
