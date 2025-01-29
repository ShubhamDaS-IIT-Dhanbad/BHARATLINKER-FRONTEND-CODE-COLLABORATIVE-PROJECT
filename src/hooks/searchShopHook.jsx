import { useDispatch, useSelector } from 'react-redux';
import { fetchShops, resetShops, loadMoreShops } from '../redux/features/searchShop/searchShopSlice.jsx';
import useLocationFromCookie from './useLocationFromCookie.jsx';

export const useSearchShop = () => {
    const dispatch = useDispatch();
    const { getLocationFromCookie } = useLocationFromCookie();

    // Retrieve location from cookie
    const storedLocation = getLocationFromCookie();
    const lat = storedLocation?.lat || null;
    const long = storedLocation?.lon || null;
    const radius = storedLocation?.radius || 5;

    const { shops, loading, currentPage, loadingMoreShops, hasMoreShops } = useSelector((state) => state.searchshops);
    const selectedCategories = useSelector((state) => state.shopfiltersection.selectedCategories);

    const shopsPerPage = 3;

    const executeSearchShop = (inputValue) => {
        if (loading || loadingMoreShops) return;

        const searchQuery = inputValue || "";
        const params = {
            userLat: lat,
            userLong: long,
            radius: radius,
            inputValue: searchQuery,
            page: 1,
            shopsPerPage,
            selectedCategories,
        };

        if (shops.length !== 0) dispatch(resetShops());
        dispatch(fetchShops(params));
    };

    const onLoadMoreShop = (inputValue) => {
        if (loadingMoreShops || !hasMoreShops) return;

        const searchQuery = inputValue || "";
        const params = {
            userLat: lat,
            userLong: long,
            radius: radius,
            inputValue: searchQuery,
            page: currentPage + 1,
            shopsPerPage,
            selectedCategories,
        };

        dispatch(loadMoreShops(params));
    };

    return { executeSearchShop, onLoadMoreShop };
};
