import { useContext } from "react";
import ActivePageContext from "@/contexts/ActivePageContext";

export function useActivePage() {
    return useContext(ActivePageContext);
}