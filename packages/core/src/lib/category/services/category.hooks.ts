import { ICategory } from "@core/lib/category/types";
import { useEffect, useMemo, useState } from "react";
import { categoryService } from ".";
import { ListingType, ListingTypeValue } from "@core/lib/listing/constants/listingTypes";

export function useCategories() {
    const [categoriesList, setCategoriesList] = useState<Record<string, ICategory[]> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [listingType, setListingType] = useState<ListingTypeValue>(ListingType.PRODUCT);

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await categoryService.getAllCategories();
                setCategoriesList(data)
            } finally {
                setLoading(false)
            }
        }
        
        loadCategories()
    }, []);

    const rootCategories = useMemo(() => {
        if (!categoriesList) return [];
        return categoriesList[listingType]?.filter(cat => cat.parentId == null) || []
    }, [categoriesList, listingType]);

    const categories = categoriesList != null ? categoriesList[listingType] || [] : [];

    const categoriesCount = useMemo(() => {
        if (!categoriesList) return new Map<ListingTypeValue, number>();

        return new Map(
            Object.values(ListingType).map(type => [
                type,
                categoriesList[type]?.length ?? 0
            ])
        );
    }, [categoriesList]);

    return { categories, rootCategories, listingType, setListingType, categoriesCount, loading }
}