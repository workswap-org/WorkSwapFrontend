"use client"

import { useI18n } from "@core/lib/contexts/I18nContext";
import { categoryService } from "@core/lib/services/category";
import { ICategory } from "@core/lib/types/models/category";
import { IFullListing } from "@core/lib/types/models/listing";
import { useEffect, useState } from "react";

const CategorySelector = ({ listing, onChange }: {listing: IFullListing, onChange: (value: number, newPath: number[]) => void} ) => {

    const { dict } = useI18n();

    const [categories, setCategories] = useState<ICategory[] | null>(null);
    const [selectedPath, setSelectedPath] = useState<number[]>([]);

    useEffect(() => {

        console.log(listing.type)
        if(!listing.type) return;
        categoryService.getCategoriesByType(listing.type)
            .then(data => {
                setCategories(data)
                console.log(data)
                if (listing.categoryId) {
                    const path = findPathToCategory(data, listing.categoryId);
                    setSelectedPath(path);
                }
            })

        function findPathToCategory(
            categories: ICategory[],
            categoryId: number
        ): number[] {
            console.log(categoryId)
            const category = categories.find(c => c.id === categoryId);
            if (!category) return [];

            if (category.parentId) {
                return [
                    ...findPathToCategory(categories, category.parentId),
                    category.id
                ];
            }

            return [category.id];
        }
    }, [listing.categoryId, listing.type])

    const getChildren = (parentId: number | null) =>
        categories?.filter((c) => c.parentId === parentId) ?? [];

    const handleSelect = (level: number, value: number) => {
        const newPath = [...selectedPath.slice(0, level), value];
        setSelectedPath(newPath);

        if (onChange) {
            onChange(value, newPath); // пробрасываем выбранный id и путь
        }
    };
    
    const renderSelectors = () => {
        const selectors = [];
        let parentId = null;
        const listingType = listing.type

        for (let level = 0; ; level++) {
            const children: ICategory[] = getChildren(parentId);
            if (children.length === 0) break;

            const selected = selectedPath[level] || "";
            selectors.push(
                <select
                    key={level}
                    id="categorySelector"
                    value={selected}
                    onChange={(e) => handleSelect(level, Number(e.target.value))}
                >
                    <option value="" disabled>
                        {dict.common.placeholders.category}
                    </option>
                    {children.map((c) => (
                        <option key={c.id} value={c.id}>
                            {dict.categories.category[listingType][c.name]}
                        </option>
                    ))}
                </select>
            );

            if (!selected) break; // пока не выбрали — дальше не идём
            parentId = selected;
        }

        return selectors;
    };

    return (
        <div id="categories" className="form-group">
            {renderSelectors()}
        </div>
    );
};

export default CategorySelector;