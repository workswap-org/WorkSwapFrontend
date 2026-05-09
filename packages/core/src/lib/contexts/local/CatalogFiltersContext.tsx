"use client";

import { ICatalogFilters } from "@core/lib/types/catalog";
import { createContext, Dispatch, SetStateAction, useContext } from "react"

type CatalogFiltersContextType = {
    filters: ICatalogFilters;
    updateFilter: (key: string, value: string | boolean | number | null) => void;
    totalPages: number | null;
    setTotalPages: Dispatch<SetStateAction<number | null>>;
}

export const CatalogFiltersContext = createContext<CatalogFiltersContextType | undefined>(undefined)

export function useCatalogFilters() {
    const context = useContext(CatalogFiltersContext)
    if (!context) throw new Error("useFilters must be used inside FiltersProvider")
    return context
}