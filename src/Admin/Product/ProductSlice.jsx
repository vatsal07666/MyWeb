import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    formValues: {
        productName: '',
        sku: '',
        category: '',
        supplier: '',
        stock: '',
        costPrice: '',
        sellingPrice: '',
        productImage: ''
    },
    editId: null,
    openForm: false,
    deleteOpen: false, // Delete confirmation dialog
    deleteId: null, // delete Id
    searchItem: '',    // search field
    loading: false,
    preview: null
}

export const ProductSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload;
        },
        addProduct: (state, actions) => {
            state.list.push(actions.payload);
        },
        deleteProduct: (state, action) => {
            state.list = state.list.filter((p) => p._id !== action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.list.findIndex(p => p._id === action.payload._id);
            if (index !== -1) state.list[index] = {...state.list[index], ...action.payload};
        },

        // Form State
        setFormValues: (state, action) => {
            state.formValues = action.payload;
        },
        resetFormValues: (state) => {
            state.formValues = initialState.formValues;
        },
        setPreview: (state, action) => {
            state.preview = action.payload;
        },
        resetPreview: (state) => {
            state.preview = null;
        },
        setEditId: (state, action) => {
            state.editId = action.payload;
        },
        resetUIState: (state) => {
            state.openForm = false;
            state.editId = null;
        },

        // Dialogs
        setOpenForm: (state, action) => {
            state.openForm = action.payload;
        },
        setDeleteOpen: (state, action) => {
            state.deleteOpen = action.payload;
        },
        setDeleteId: (state, action) => {
            state.deleteId = action.payload;
        },
        resetDeleteState: (state) => {
            state.deleteOpen = false;
            state.deleteId = null;
        },

        // Search
        setSearchItem: (state, action) => {
            state.searchItem = action.payload;
        },

        // Loading
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
})

export const { setProduct, addProduct, deleteProduct, updateProduct, setFormValues, setEditId, setOpenForm, 
    setDeleteOpen, setDeleteId, setSearchItem, setLoading, resetDeleteState, resetUIState, resetFormValues,
    setPreview, resetPreview
} = ProductSlice.actions;
export default ProductSlice.reducer;