import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts ,loadMoreProducts ,resetProducts} from '../redux/features/searchPage/searchProductSlice';
import useLocationFromCookie from './useLocationFromCookie.jsx';

export const useExecuteSearch = () => {
    const dispatch = useDispatch();
    const { getLocationFromCookie } = useLocationFromCookie();

    const storedLocation = getLocationFromCookie();

    const {
        products,
        loading,
        currentPage,
        loadingMoreProducts,
        hasMoreProducts,
        productsPerPage,
        sortByAsc,
        sortByDesc,
    } = useSelector((state) => state.searchproducts);

    const selectedBrands = useSelector((state) => state.searchproductsfiltersection.selectedBrands);
    const selectedCategories = useSelector((state) => state.searchproductsfiltersection.selectedCategories);

    const lat = storedLocation ? storedLocation.lat : null;
    const long = storedLocation ? storedLocation.lon : null;
    const radius = storedLocation ? storedLocation.radius : 5; 

    const executeSearch = (inputValue) => {
        if(loading || loadingMoreProducts) return;
        const searchQuery = inputValue ? inputValue : "";
        const params = {
            userLat: lat,
            userLong: long,
            radius:radius ? radius : 0,
            inputValue: searchQuery, 
            page: 1,
            productsPerPage,
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc,
        };
        if(products.length!=0) dispatch(resetProducts());
        dispatch(fetchProducts(params));
    };
    
    const onLoadMore = (inputValue) => {
        if (!hasMoreProducts || loadingMoreProducts) return;
        const searchQuery = inputValue || "";
        const params = {
            userLat: lat,
            userLong: long,
            radius:radius ? radius :0,
            inputValue:searchQuery,
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
