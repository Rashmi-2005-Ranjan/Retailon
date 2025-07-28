import {createContext, useEffect, useState} from "react";
import {fetchCategories} from "../Services/CategoryService.js";
import {fetchItems} from "../Services/ItemService.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

    const [itemsData, setItemsData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [auth, setAuth] = useState({
        token: null,
        role: null,
    })

    useEffect(() => {
        async function loadData() {
            if (localStorage.getItem("token") && localStorage.getItem("role")) {
                setAuthData({
                    token: localStorage.getItem("token"),
                    role: localStorage.getItem("role")
                });
            }
            const response = await fetchCategories();
            const itemsResponse = await fetchItems();
            setCategories(response.data)
            setItemsData(itemsResponse.data);
        }

        loadData();
    }, []);

    const setAuthData = (token, role) => {
        setAuth({
            token: token,
            role: role
        })
    }

    const contextValue = {
        categories,
        setCategories,
        auth,
        setAuthData,
        itemsData,
        setItemsData
    }

    return <AppContext.Provider
        value={contextValue}>
        {props.children}
    </AppContext.Provider>
}