import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    formValues: {
        supplierName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
    },
    editId: null,
    openForm: false,
    deleteOpen: false, // Delete confirmation dialog
    deleteId: null, // delete Id
    searchItem: '',    // search field
    loading: false,
}

export const SupplierSlice = createSlice({
    name: "supplier",
    initialState,
    reducers: {
        setSupplier: (state, action) => {
            state.list = action.payload;
        },
        addSupplier: (state, actions) => {
            state.list.push(actions.payload);
        },
        deleteSupplier: (state, action) => {
            state.list = state.list.filter((p) => p._id !== action.payload);
        },
        updateSupplier: (state, action) => {
            const index = state.list.findIndex(p => p._id === action.payload._id);
            if (index !== -1) state.list[index] = action.payload;
        },

        // Form State
        setFormValues: (state, action) => {
            state.formValues = action.payload;
        },
        resetFormValues: (state) => {
            state.formValues = initialState.formValues;
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

export const { setSupplier, addSupplier, deleteSupplier, updateSupplier, setFormValues, setEditId, setOpenForm, 
    setDeleteOpen, setDeleteId, setSearchItem, setLoading, resetDeleteState, resetUIState, resetFormValues
} = SupplierSlice.actions;
export default SupplierSlice.reducer;