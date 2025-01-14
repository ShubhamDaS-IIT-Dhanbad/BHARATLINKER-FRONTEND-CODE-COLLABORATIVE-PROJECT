import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/features/searchPage/searchProductSlice';
import { loadMoreProducts} from '../redux/features/searchPage/searchProductSlice.jsx'; // Import resetProducts

import { useState } from 'react';
import Cookies from 'js-cookie'; // Import Cookies

export const useExecuteSearch = () => {
    const dispatch = useDispatch();
    const productsPerPage = 3;

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [inputValue, setInputValue] = useState(query);
    
    const { selectedBrands,hasMoreProducts,loadingMoreProducts,currentPage, selectedCategories, sortByAsc, sortByDesc } = useSelector((state) => state.searchproducts);

    // Get lat, long, and radius from 'BharatLinkerUserLocation' cookie
    const storedLocation = Cookies.get('BharatLinkerUserLocation') ? JSON.parse(Cookies.get('BharatLinkerUserLocation')) : null;
    const lat = storedLocation ? storedLocation.lat : null;
    const long = storedLocation ? storedLocation.lon : null;
    const radius = storedLocation ? storedLocation.radius : 5; 

    const executeSearch = () => {
        const params = {
            userLat: lat,
            userLong: long,
            radius,
            inputValue,
            page: 1,
            productsPerPage,
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc,
        };
        dispatch(fetchProducts(params));
    };
    const onLoadMore = () => {
            if (!hasMoreProducts || loadingMoreProducts) return;
            const params = {
                userLat:lat,
                userLong:long,
                radius,
                inputValue,
                page: currentPage + 1,
                productsPerPage,
                selectedCategories,
                selectedBrands,
                sortByAsc,
                sortByDesc,
            };
            dispatch(loadMoreProducts(params));
        };

    return { inputValue, setInputValue, executeSearch,onLoadMore };
};

           