import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams} from 'react-router-dom';
import { resetProducts, fetchProducts } from '../redux/features/searchPage/searchProductSlice';
import { useState } from 'react';

export const useExecuteSearch = () => {
    const dispatch = useDispatch();
    const productsPerPage = 3;

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [inputValue, setInputValue] = useState(query);
    
    const {selectedBrands,selectedCategories, sortByAsc, sortByDesc } = useSelector((state) => state.searchproducts);

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
