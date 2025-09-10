import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useTranslation } from 'react-i18next';

const CategorySelector = ( { categoryId, onChange } ) => {

    const { t } = useTranslation(['common', 'categories']);

    const [categories, setCategories] = useState([]);
    const [selectedPath, setSelectedPath] = useState([]);

    useEffect(() => {
        async function loadCategories() {
            const data = await apiFetch("/api/categories");
            const cats = data.categories || [];
            setCategories(cats);

            // если уже есть categoryId → восстановим путь
            if (categoryId) {
                const path = findPathToCategory(cats, categoryId);
                setSelectedPath(path);
            }
        }

        function findPathToCategory(categories, categoryId) {
            const category = categories.find(c => c.id === categoryId);
            if (!category) return [];

            // если есть parentId → рекурсивно ищем путь к родителю
            if (category.parentId) {
                return [...findPathToCategory(categories, category.parentId), category.id];
            } else {
                return [category.id];
            }
        }

        loadCategories();
    }, [categoryId])

    const getChildren = (parentId) =>
        categories.filter((c) => c.parentId === parentId);

    const handleSelect = (level, value) => {
        const newPath = [...selectedPath.slice(0, level), value];
        setSelectedPath(newPath);

        if (onChange) {
            onChange(value, newPath); // пробрасываем выбранный id и путь
        }
    };
    
    const renderSelectors = () => {
        const selectors = [];
        let parentId = null;

        for (let level = 0; ; level++) {
            const children = getChildren(parentId);
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
                        {t(`placeholders.category`, { ns: 'common' })}
                    </option>
                    {children.map((c) => (
                        <option key={c.id} value={c.id}>
                            {t(`category.${c.name}`, { ns: 'categories' })}
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