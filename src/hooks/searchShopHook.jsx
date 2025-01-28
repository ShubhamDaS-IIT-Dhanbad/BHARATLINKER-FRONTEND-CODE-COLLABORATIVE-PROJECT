import { useDispatch, useSelector } from 'react-redux';
import { fetchShops, resetShops, loadMoreShops } from '../redux/features/searchShop/searchShopSlice.jsx';
import useLocationFromCookie from './useLocationFromCookie.jsx';

export const useSearchShop = () => {
    const dispatch = useDispatch();

    const { getLocationFromCookie } = useLocationFromCookie();
    const storedLocation = getLocationFromCookie();

    const { shops, loading, currentPage, loadingMoreShops, hasMoreShops } = useSelector((state) => state.searchshops);
    const selectedCategories = useSelector((state) => state.shopfiltersection.selectedCategories);

    const shopsPerPage = 3;
    const lat = storedLocation ? storedLocation.lat : null;
    const long = storedLocation ? storedLocation.lon : null;
    const radius = storedLocation ? storedLocation.radius : 5;

    const executeSearchShop = (inputValue) => {
        if (loading || loadingMoreShops) return;
        const searchQuery = inputValue || "";
        const params = {
            userLat: lat,
            userLong: long,
            radius:radius ? radius : 0,

            inputValue: searchQuery,
            page: 1,
            shopsPerPage: shopsPerPage,

            selectedCategories,
        };
        if (shops.length != 0) { dispatch(resetShops()) }
        dispatch(fetchShops(params));
    };

    const onLoadMoreShop = (inputValue) => {

        if (loadingMoreShops || !hasMoreShops) { return; }
        const searchQuery = inputValue || "";
        const params = {
            userLat: lat,
            userLong: long,
            radius: radius ? radius : 0,

            inputValue: searchQuery,
            page: currentPage + 1,
            shopsPerPage: shopsPerPage,

            selectedCategories
        };
        dispatch(loadMoreShops(params));
    };

    return { executeSearchShop, onLoadMoreShop };
};
