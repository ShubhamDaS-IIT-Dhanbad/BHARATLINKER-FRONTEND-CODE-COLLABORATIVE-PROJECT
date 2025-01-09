import React from 'react';
import ShopCard from './shopCard.jsx';
import { TbClockSearch } from 'react-icons/tb';

const ShopList = ({ shops, loading}) => {

  if (!loading && shops.length === 0) {
    return (
      <div className='search-no-shop-found'>
        <TbClockSearch size={60} />
        <div>No shop found</div>
        <div style={{ fontWeight: "900" }}>In Your Area</div>
      </div>
    );
  }

  return (
    <>
      <div id="search-shop-grid">
        {shops.length > 0 && (
          <>
            {shops.map(shop => (
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
