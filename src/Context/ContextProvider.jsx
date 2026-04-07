import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export const ContextProvider = ({children}) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    
    const [showPassword, setShowPassword] = useState(false);

    // Tokens
    const productToken = "DocAKBFPpGh4l7vo";
    const categoryToken = "y5japrtJDM9NkJjU";
    const supplierToken = "6jA4ILnp672uVwAw";

    // Get Data
    const getProducts = () => {
        return axios.get("https://generateapi.techsnack.online/api/product", {
            headers: { Authorization: productToken }
        })
        .then((res) => setProducts(res.data.Data))
        .catch((err) => console.error("GET error: ", err))
    }

    const getCategories = () => {
        return axios.get("https://generateapi.techsnack.online/api/category", {
            headers: { Authorization: categoryToken }
        })
        .then((res) => setCategories(res.data.Data))
        .catch((err) => console.error("GET error: ", err))
    }

    const getSuppliers = () => {
        return axios.get("https://generateapi.techsnack.online/api/supplier", {
            headers: { Authorization: supplierToken }
        })
        .then((res) => setSuppliers(res.data.Data))
        .catch((err) => console.error("GET error: ", err))
    }

    useEffect(() => {
        getProducts();
        getCategories();
        getSuppliers();
    }, [])

    return(
        <DataContext.Provider value={{ products, getProducts, categories, setCategories, suppliers, setSuppliers, 
            showPassword, setShowPassword
        }}>
            {children}
        </DataContext.Provider>
    )
}