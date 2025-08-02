import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Services/CategoryService.js";
import { fetchItems } from "../Services/ItemService.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

    const [itemsData, setItemsData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [auth, setAuth] = useState({
        token: null,
        role: null,
    });

    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        const existingItem = cartItems.find(
            cartItem => cartItem.name === item.name
        );
        if (existingItem) {
            setCartItems(cartItems.map(
                cartItem => cartItem.name === item.name
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.itemId !== itemId));
    };

    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(cartItems.map(
            item => item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const setAuthData = (token, role) => {
        setAuth({
            token: token,
            role: role
        });
    };

    useEffect(() => {
        async function loadData() {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (token && role) {
                setAuthData(token, role); // ✅ FIXED: Properly passing token and role
            }

            const response = await fetchCategories();
            const itemsResponse = await fetchItems();

            setCategories(response.data);
            setItemsData(itemsResponse.data);
        }

        loadData();
    }, []);

    const contextValue = {
        categories,
        setCategories,
        auth,
        setAuthData,
        itemsData,
        setItemsData,
        addToCart,
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};
