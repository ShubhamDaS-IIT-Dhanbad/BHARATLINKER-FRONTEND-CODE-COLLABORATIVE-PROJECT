import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetProducts, fetchProducts } from '../redux/features/searchProductSlice.jsx';
import { useState } from 'react';

export const useExecuteSearch = () => {
    const dispatch = useDispatch();
    const productsPerPage = 24;

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [inputValue, setInputValue] = useState(query);
    
    const selectedCategories = useSelector(state => state.searchproductfiltersection.selectedCategories);
    const selectedBrands = useSelector(state => state.searchproductfiltersection.selectedBrands);
    const { sortByAsc, sortByDesc } = useSelector((state) => state.searchproductsortbysection);

    const executeSearch = () => {
        const params = {
            inputValue,
            page: 1,
            productsPerPage,
            pinCodes: [742136, 742137],
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc,
        };
        dispatch(resetProducts());
        dispatch(fetchProducts(params));
    };

    return { inputValue, setInputValue, executeSearch };
};
