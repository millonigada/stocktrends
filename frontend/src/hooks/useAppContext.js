import { AppContext } from "../context/AppContext";
import { useContext } from "react";

export const useAppContext = () => {
    const context = useContext(AppContext)

    if(!context) {
        throw Error('useAppContext not inside a Context Provider')
    }
    return context
}