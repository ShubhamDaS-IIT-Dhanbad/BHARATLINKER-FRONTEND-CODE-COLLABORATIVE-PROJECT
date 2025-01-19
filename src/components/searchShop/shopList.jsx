import React from 'react';
import ShopCard from './shopCard.jsx';

const ShopList = ({ shops, loading,hasMoreShops,loadingMoreShops}) => {

  if (!loading && shops?.length === 0 && !hasMoreShops) {
    const notfound='https://res.cloudinary.com/demc9mecm/image/upload/v1736953901/ir4hy5fcwevhr8ibeaqq.png';
    return (
      <div className='search-shop-no-shop-found'>
        <img src={notfound} />
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
