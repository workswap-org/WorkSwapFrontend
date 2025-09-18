import { useContext } from "react";
import ActivePageContext from "@/lib/contexts/ActivePageContext";

export function useActivePage() {
    return useContext(ActivePageContext);
}