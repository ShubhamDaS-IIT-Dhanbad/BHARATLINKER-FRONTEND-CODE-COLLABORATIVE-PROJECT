import { useDispatch, useSelector } from 'react-redux';
import useLocationFromCookie from './useLocationFromCookie.jsx';
import { fetchRefurbishedProducts, loadMoreRefurbishedProducts } from '../redux/features/refurbishedPage/refurbishedProductsSlice.jsx';

export const useSearchRefurbishedProductsHook = () => {
    const dispatch = useDispatch();
    const { getLocationFromCookie } = useLocationFromCookie();
    const storedLocation = getLocationFromCookie();

    // Redux state
    const { 
        refurbishedProducts, 
        currentPage, 
        hasMoreProducts, 
        loading, 
        loadingMoreProducts, 
        error, 
        sortByAsc, 
        sortByDesc 
    } = useSelector((state) => state.refurbishedproducts);

 
    const productsPerPage = 3;
    const lat = storedLocation ? storedLocation.lat : null;
    const long = storedLocation ? storedLocation.lon : null;
    const radius = storedLocation ? storedLocation.radius : 5;

    const executeSearchRefurbished = (inputValue) => {
        const searchQuery = inputValue || "";
        const params = {
            inputValue: searchQuery,
            userLat: lat,
            userLong: long,
            radius,
            page: 1,
            productsPerPage: productsPerPage,
            sortByAsc: sortByAsc || false,
            sortByDesc: sortByDesc || false,
        };
        dispatch(fetchRefurbishedProducts(params));
    };

    const onLoadMoreRefurbished = (inputValue) => {
        if (!hasMoreProducts || loadingMoreProducts) return;

        const searchQuery = inputValue || "";
        const params = {
            inputValue: searchQuery,
            userLat: lat,
            userLong: long,
            radius,
            page: currentPage + 1,
            productsPerPage: productsPerPage,
            sortByAsc,
            sortByDesc
        };
        dispatch(loadMoreRefurbishedProducts(params));
    };

    return { executeSearchRefurbished, onLoadMoreRefurbished };
};
