import React from 'react';
import ShopCard from './shopCard.jsx';
import notfound from '../../assets/notfound.png';

const ShopList = ({ shops, loading,hasMoreShops,loadingMoreShops}) => {

  if (!loading && shops.length === 0 && !hasMoreShops) {
    return (
      <div className='search-shop-no-shop-found'>
        <img src={notfound} />
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
