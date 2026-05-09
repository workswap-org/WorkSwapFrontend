import { ICategory } from "@core/lib/types/models/category";
import { useEffect, useMemo, useState } from "react";
import { categoryService } from ".";
import { ListingType, ListingTypeValue } from "@core/lib/constants/listingTypes";

export function useCategories() {
    const [categories, setCategories] = useState<Record<string, ICategory[]> | null>(null);

    useEffect(() => {
        async function loadCategories() {
            const data = await categoryService.getAllCategories();
            setCategories(data)
        }
        
        loadCategories()
    }, []);

    const [listingType, setListingType] = useState<ListingTypeValue>(ListingType.PRODUCT);

    const rootCategories = useMemo(() => {
        if (!categories) return [];
        return categories[listingType]?.filter(cat => cat.parentId == null) || []
    }, [categories, listingType]);

    return { categories, rootCategories, listingType, setListingType }
}