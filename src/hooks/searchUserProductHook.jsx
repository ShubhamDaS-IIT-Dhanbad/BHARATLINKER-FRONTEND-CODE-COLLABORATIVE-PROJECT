import { useDispatch, useSelector } from 'react-redux';
import useUserAuth from './userAuthHook.jsx';
import {
    fetchUserRefurbishedProducts,
    loadMoreUserRefurbishedProducts,
    resetUserRefurbishedProducts,
} from '../redux/features/user/userAllRefurbishedProductsSlice.jsx';

export const useExecuteUserSearch = () => {
    const dispatch = useDispatch();
    const { getUserDataFromCookie } = useUserAuth();

    const userData = getUserDataFromCookie();

    const { refurbishedProducts, loading, error, currentPage, hasMoreProducts, loadingMoreProducts } = useSelector(
        (state) => state.userRefurbishedProducts
    );

    const executeSearch = (inputValue) => {
        if (!hasMoreProducts || loadingMoreProducts || !userData?.phoneNumber) return;
        const searchQuery = inputValue || '';
        const params = {
            inputValue: searchQuery,
            page: 1,
            productsPerPage: 8,
            sortByAsc: false,
            sortByDesc: false,
            phn: `+91${userData?.phoneNumber}`,
        };

        if (refurbishedProducts.length !== 0) dispatch(resetUserRefurbishedProducts());
        dispatch(fetchUserRefurbishedProducts(params));
    };

    const onLoadMore = (inputValue) => {
        if (!hasMoreProducts || loadingMoreProducts || !userData?.phoneNumber) return;
        const searchQuery = inputValue || '';
        const params = {
            inputValue: searchQuery,
            page: currentPage + 1,
            productsPerPage: 8,
            sortByAsc: false,
            sortByDesc: false,
            phn: `+91${userData?.phoneNumber}`,
        };
        dispatch(loadMoreUserRefurbishedProducts(params));
    };

    return { executeSearch, onLoadMore };
};
