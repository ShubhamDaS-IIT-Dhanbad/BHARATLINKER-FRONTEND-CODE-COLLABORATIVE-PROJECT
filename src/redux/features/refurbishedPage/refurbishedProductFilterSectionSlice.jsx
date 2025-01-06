import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchTerm: '',  
    selectedCategories: [], 
    selectedBrands: [],     
    selectedClasses: [],   
    selectedExams: [],     
    selectedLanguages: [],  
    selectedBoards: [],
};

const refurbishedFilterSectionSlice = createSlice({
    name: 'refurbishedproductfiltersection',
    initialState,
    reducers: {
        setRefurbishedSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        toggleRefurbishedCategory: (state, action) => {
            const category = action.payload.toLowerCase(); // Convert category to lowercase
            if (state.selectedCategories.includes(category)) {
                state.selectedCategories = state.selectedCategories.filter(item => item !== category);
            } else {
                state.selectedCategories.push(category);
            }
        },
        toggleRefurbishedBrand: (state, action) => {
            const brand = action.payload.toLowerCase(); // Convert brand to lowercase
            if (state.selectedBrands.includes(brand)) {
                state.selectedBrands = state.selectedBrands.filter(item => item !== brand);
            } else {
                state.selectedBrands.push(brand);
            }
        },
        toggleRefurbishedClass: (state, action) => {
            const classItem = action.payload.toLowerCase(); // Convert class to lowercase
            if (state.selectedClasses.includes(classItem)) {
                state.selectedClasses = state.selectedClasses.filter(item => item !== classItem);
            } else {
                state.selectedClasses.push(classItem);
            }
        },
        toggleRefurbishedExam: (state, action) => {
            const exam = action.payload.toLowerCase(); // Convert exam to lowercase
            if (state.selectedExams.includes(exam)) {
                state.selectedExams = state.selectedExams.filter(item => item !== exam);
            } else {
                state.selectedExams.push(exam);
            }
        },
        toggleRefurbishedLanguage: (state, action) => {
            const language = action.payload.toLowerCase(); // Convert language to lowercase
            if (state.selectedLanguages.includes(language)) {
                state.selectedLanguages = state.selectedLanguages.filter(item => item !== language);
            } else {
                state.selectedLanguages.push(language);
            }
        },
        toggleRefurbishedBoard: (state, action) => {
            const board = action.payload.toLowerCase(); // Convert board to lowercase
            if (state.selectedBoards.includes(board)) {
                state.selectedBoards = state.selectedBoards.filter(item => item !== board);
            } else {
                state.selectedBoards.push(board);
            }
        },
        resetRefurbishedFilters: (state) => {
            state.searchTerm = '';
            state.selectedCategories = [];
            state.selectedBrands = [];
            state.selectedClasses = [];
            state.selectedExams = [];
            state.selectedLanguages = [];
            state.selectedBoards = [];
        },
    },
});

export const {
    setRefurbishedSearchTerm,
    toggleRefurbishedCategory,
    toggleRefurbishedBrand,
    toggleRefurbishedClass,
    toggleRefurbishedExam,
    toggleRefurbishedLanguage,
    toggleRefurbishedBoard,
    resetRefurbishedFilters,
} = refurbishedFilterSectionSlice.actions;

export default refurbishedFilterSectionSlice.reducer;
