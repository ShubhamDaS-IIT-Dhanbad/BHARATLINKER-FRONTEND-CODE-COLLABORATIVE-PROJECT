import React from 'react';
import { TbClockSearch } from 'react-icons/tb';

const NoResults = () => (
  <div className='search-no-shop-found'>
    <TbClockSearch size={60} />
    <div>No shop Found</div>
    <div style={{ fontWeight: "900" }}>In Your Area</div>
  </div>
);

export default NoResults;
