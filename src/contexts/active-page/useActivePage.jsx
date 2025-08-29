import { useContext } from "react";
import ActivePageContext from "./ActivePageContext";

export function useActivePage() {
    return useContext(ActivePageContext);
}