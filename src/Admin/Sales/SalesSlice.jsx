import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    list: [], // All sales
    formValues: {
        customer: '',
        mobile: '',
        product: '',
        quantity: '',
        unitprice: '',
        items: [], // Items added for the sale
        paymentMethod: '',
        paymentStatus: '',
        date: ''
    },
    itemDraft: [], // Temporary items before submitting
    editId: null, // ID of sale being edited
    openForm: false, // Whether the add/edit form is open
    deleteOpen: false, // Delete confirmation dialog
    deleteId: null, // ID of sale to delete
    searchItem: '', // Search input value
    loading: false, // Loading state
    invoiceOpen: false,
    invoiceData: null
};

const SalesSlice = createSlice({
    name: "sales",
    initialState,
    reducers: {
        // -------------------- Sales List --------------------
        setSales: (state, action) => {
            state.list = action.payload; // Set full sales list
        },
        addSales: (state, action) => {
            state.list.push(action.payload); // Add a new sale
        },
        deleteSales: (state, action) => {
            state.list = state.list.filter(s => s._id !== action.payload); // Remove sale by ID
        },
        updateSales: (state, action) => {
            // Update sale details by ID
            const index = state.list.findIndex(s => s._id === action.payload._id);
            if (index !== -1) state.list[index] = { ...state.list[index], ...action.payload };
        },

        // -------------------- Form State --------------------
        setFormValues: (state, action) => {
            state.formValues = action.payload; // Set form values (used for edit)
        },
        resetFormValues: (state) => {
            state.formValues = initialState.formValues; // Reset form to empty values
        },
        setEditId: (state, action) => {
            state.editId = action.payload; // Set the ID of the sale being edited
        },

        // -------------------- Item Draft --------------------
        addItemDraft: (state, action) => {
            state.itemDraft.push(action.payload); // Add item to temporary draft
        },
        removeItemDraft: (state, action) => {
            state.itemDraft.splice(action.payload, 1); // Remove item from draft by index
        },
        resetItemDraft: (state) => {
            state.itemDraft = []; // Clear draft items
        },

        // Reset UI states (close form, clear draft)
        resetUIState: (state) => {
            state.openForm = false;
            state.itemDraft = [];
        },

        // -------------------- Dialogs --------------------
        setOpenForm: (state, action) => {
            state.openForm = action.payload; // Open/close form
        },
        setDeleteOpen: (state, action) => {
            state.deleteOpen = action.payload; // Open/close delete confirmation
        },
        setDeleteId: (state, action) => {
            state.deleteId = action.payload; // Set ID of sale to delete
        },
        resetDeleteState: (state) => {
            state.deleteOpen = false;
            state.deleteId = null; // Reset delete state
        },

        // -------------------- Invoice --------------------
        setInvoiceOpen: (state, action) => {
            state.invoiceOpen = action.payload;
        },
        setInvoiceData: (state, action) => {
            state.invoiceData = action.payload;
        },

        // -------------------- Search --------------------
        setSearchItem: (state, action) => {
            state.searchItem = action.payload; // Set search input
        },

        // -------------------- Loading --------------------
        setLoading: (state, action) => {
            state.loading = action.payload; // Set loading state
        },
    }
});

// Export actions for use in components
export const { setSales, addSales, deleteSales, updateSales, setFormValues,  resetFormValues, setEditId, 
    addItemDraft, removeItemDraft, resetItemDraft, resetUIState, setOpenForm, setDeleteOpen, setDeleteId, 
    resetDeleteState, setSearchItem, setLoading, setInvoiceData, setInvoiceOpen
} = SalesSlice.actions;

// Export reducer for store
export default SalesSlice.reducer;
