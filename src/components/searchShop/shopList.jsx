import React from 'react';
import ShopCard from './shopCard.jsx';
import { TbClockSearch } from 'react-icons/tb';
import { IoIosArrowDown } from "react-icons/io";

const ShopList = ({ shops, loading, hasMoreShops, loadingMoreShops, onLoadMore }) => {
  if (loading) return <>Loading...</>;

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

      {hasMoreShops && !loadingMoreShops && (
        <div className='search-shop-load-more-container'>
          <IoIosArrowDown
            size={30}
            className="search-page-load-more-icon"
            onClick={onLoadMore} // Call onLoadMore when the icon is clicked
          />
        </div>
      )}
      {hasMoreShops && loadingMoreShops && (
        <>Loading more shops...</>
      )}

    </>

  );
};

export default ShopList;
