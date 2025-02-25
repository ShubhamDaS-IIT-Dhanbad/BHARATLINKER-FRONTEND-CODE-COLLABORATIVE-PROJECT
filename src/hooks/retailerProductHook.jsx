import React, { useEffect, useCallback, useRef } from 'react';
import { fetchProducts, loadMoreProducts, resetShopProducts } from '../redux/features/retailer/product.jsx';
import useLocationFromCookie from './useLocationFromCookie.jsx';
import { useDispatch, useSelector } from 'react-redux';

export const useShopProductExecuteSearch = (shopId) => {
    const dispatch = useDispatch();
    const { getLocationFromCookie } = useLocationFromCookie();
    const pinCodes = getLocationFromCookie()?.pinCodes || [742136];
    const abortControllerRef = useRef(null);

    const {
        loading,
        currentPage,
        loadingMoreProducts,
        hasMoreProducts,
        productsPerPage,
        sortByAsc,
        sortByDesc,
    } = useSelector((state) => state.retailerProducts);

    const selectedBrands = useSelector((state) => state.searchproductsfiltersection.selectedBrands);
    const selectedCategories = useSelector((state) => state.searchproductsfiltersection.selectedCategories);

    const executeShopProductSearch = useCallback(
        (inputValue = "") => {
            if (loading || loadingMoreProducts) return;

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            const params = {
                inputValue,
                page: 1,
                productsPerPage,
                pinCodes,
                selectedCategories,
                selectedBrands,
                sortByAsc,
                sortByDesc,
                shopId,
                signal: abortControllerRef.current.signal,
            };

            dispatch(resetShopProducts());
            return dispatch(fetchProducts(params));
        },
        [
            dispatch, loading, loadingMoreProducts, productsPerPage,
            pinCodes, selectedCategories, selectedBrands, sortByAsc,
            sortByDesc, shopId
        ]
    );

    const onLoadMoreShopProduct = useCallback(
        (inputValue = "") => {
            if (!hasMoreProducts || loadingMoreProducts) return;

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            const params = {
                inputValue,
                page: currentPage + 1,
                productsPerPage,
                pinCodes,
                selectedCategories,
                selectedBrands,
                sortByAsc,
                sortByDesc,
                shopId,
                signal: abortControllerRef.current.signal,
            };

            return dispatch(loadMoreProducts(params));
        },
        [
            dispatch, hasMoreProducts, loadingMoreProducts, currentPage,
            productsPerPage, pinCodes, selectedCategories, selectedBrands,
            sortByAsc, sortByDesc, shopId
        ]
    );

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return { executeShopProductSearch, onLoadMoreShopProduct };
};
