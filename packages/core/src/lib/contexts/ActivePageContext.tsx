import { createContext, useContext } from "react";

export const ActivePageContext = createContext<string>("none");

export const useActivePage = () => {
    const ctx = useContext(ActivePageContext);
    if (!ctx) {
        throw new Error("useActivePage must be used inside ActivePageProvider");
    }
    return ctx;
}