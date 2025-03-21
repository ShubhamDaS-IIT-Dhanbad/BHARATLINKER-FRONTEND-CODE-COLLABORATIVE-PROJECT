import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, loadMoreProducts, resetShopProducts } from '../redux/features/shopProducts/searchProductSlice.jsx';
import useLocationFromCookie from './useLocationFromCookie.jsx';

export const useShopProductExecuteSearch = (shopId) => {
    const dispatch = useDispatch();
    const shopData = useSelector((state) => state.shopproducts.shops[shopId]) || {};
    const {
        products = [],
        currentPage,
        hasMoreProducts,
    } = shopData;
    const {
        loading,
        loadingMoreProducts,
        productsPerPage,
        sortByAsc,
        sortByDesc,
    } = useSelector((state) => state.shopproducts);

    const selectedBrands = useSelector((state) => state.searchproductsfiltersection.selectedBrands);
    const selectedCategories = useSelector((state) => state.searchproductsfiltersection.selectedCategories);

    const executeShopProductSearch = (inputValue = "") => {
        if (loading || loadingMoreProducts) return;
        const params = {
            inputValue,
            page: 1,
            productsPerPage,
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc,
            shopId,
        };
        if (products?.length !== 0) dispatch(resetShopProducts());
        dispatch(fetchProducts(params));
    };

    const onLoadMoreShopProduct = (inputValue = "") => {
        if (!hasMoreProducts || loadingMoreProducts) return;
        const params = {
            inputValue,
            page: currentPage + 1,
            productsPerPage,
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc,
            shopId,
        };
        dispatch(loadMoreProducts(params));
    };

    return { executeShopProductSearch, onLoadMoreShopProduct };
};
