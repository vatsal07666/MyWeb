import { configureStore } from "@reduxjs/toolkit";
import ProductSlice from "../Product/ProductSlice";
import CategorySlice from "../Category/CategorySlice";
import SupplierSlice from "../Supplier/SupplierSlice";
import SalesSlice from "../Sales/SalesSlice";

export default configureStore({
    reducer: {
        productStore: ProductSlice, 
        categoryStore: CategorySlice,
        supplierStore: SupplierSlice,
        salesStore: SalesSlice,
    }
})