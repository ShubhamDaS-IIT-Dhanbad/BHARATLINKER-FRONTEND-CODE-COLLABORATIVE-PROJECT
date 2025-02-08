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
    const { refurbishedProducts, currentPage, hasMoreProducts, loadingMoreProducts } = useSelector((state) => state.userRefurbishedProducts);

    const executeSearch = (inputValue) => {
        if (loadingMoreProducts || !userData?.phoneNumber) return;
        const searchQuery = inputValue || '';
        const params = {
            phn: `91${userData?.phoneNumber}`,

            inputValue: searchQuery,
            page: 1,
            productsPerPage: 8,

            sortByAsc: false,
            sortByDesc: false,
        };

        if (refurbishedProducts.length !== 0) dispatch(resetUserRefurbishedProducts());
        dispatch(fetchUserRefurbishedProducts(params));
    };

    const onLoadMore = (inputValue) => {
        if (!hasMoreProducts || loadingMoreProducts || !userData?.phoneNumber) return;
        const searchQuery = inputValue || '';
        const params = {
            phn: `91${userData?.phoneNumber}`,

            inputValue: searchQuery,
            page: currentPage + 1,
            productsPerPage: 8,
            
            sortByAsc: false,
            sortByDesc: false,
        };
        dispatch(loadMoreUserRefurbishedProducts(params));
    };

    return { executeSearch, onLoadMore };
};
