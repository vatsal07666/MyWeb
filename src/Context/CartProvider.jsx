import { createContext, useEffect, useState } from "react";
import { useSnackbar } from "./SnackbarContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { ShowSnackbar } = useSnackbar();
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        if(savedCart && savedCart !== "undefined") return JSON.parse(savedCart);
        return [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.find((item) => item._id === product._id);
            if (exists) {
                setTimeout(() => {
                    ShowSnackbar("Item is already in the Cart !", "info");
                }, 0)
                return prev;
            }
            return [...prev, {...product, quantity: 1}];
        })
    };

    const increaseQty = (id) => {
        setCart((prev) => prev.map((item) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item));
    };
    const decreaseQty = (id) => {
        setCart((prev) => prev.map((item) => item._id === id && item.quantity > 1 
            ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item._id !== id));
        ShowSnackbar("Item Removed from the Cart !", "info")
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, increaseQty, decreaseQty, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
