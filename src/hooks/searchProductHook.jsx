import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/features/searchPage/searchProductSlice';
import { loadMoreProducts } from '../redux/features/searchPage/searchProductSlice.jsx';
import useLocationFromCookie from './useLocationFromCookie.jsx';

export const useExecuteSearch = () => {
    const dispatch = useDispatch();
    const { getLocationFromCookie } = useLocationFromCookie();

    const storedLocation = getLocationFromCookie();

    const {
        loadingMoreProducts,
        hasMoreProducts,
        selectedCategories,
        selectedBrands,
        sortByAsc,
        sortByDesc,
    } = useSelector((state) => state.searchproducts);

    const productsPerPage = 3;
    const lat = storedLocation ? storedLocation.lat : null;
    const long = storedLocation ? storedLocation.lon : null;
    const radius = storedLocation ? storedLocation.radius : 5; 

    const executeSearch = (inputValue) => {
        const searchQuery = inputValue || "";
        const params = {
            userLat: lat,
            userLong: long,
            radius,
            inputValue: searchQuery, 
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
            userLat: lat,
            userLong: long,
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

    return { executeSearch, onLoadMore };
};
