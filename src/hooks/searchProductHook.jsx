import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, loadMoreProducts, resetProducts } from '../redux/features/searchPage/searchProductSlice';
import useLocationFromCookie from './useLocationFromCookie.jsx';

export const useExecuteSearch = () => {
    const dispatch = useDispatch();
    const { getLocationFromCookie } = useLocationFromCookie();

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

    const { lat, lon: long, radius = 5 } = getLocationFromCookie() || {};

    const executeSearch = (inputValue = "") => {
        if (loading || loadingMoreProducts) return;

        const params = {
            userLat: lat,
            userLong: long,
            radius: radius || 0,
            inputValue,
            productsPerPage,
            page: 1,
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc,
        };

        if (products.length !== 0) dispatch(resetProducts());
        dispatch(fetchProducts(params));
    };

    const onLoadMore = (inputValue = "") => {
        if (!hasMoreProducts || loadingMoreProducts) return;

        const params = {
            userLat: lat,
            userLong: long,
            radius: radius || 0,
            inputValue,
            productsPerPage,
            page: currentPage + 1,
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc,
        };

        dispatch(loadMoreProducts(params));
    };

    return { executeSearch, onLoadMore };
};