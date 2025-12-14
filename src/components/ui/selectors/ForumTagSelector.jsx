import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const ForumTagSelector = ({ tags, currentTag, onChange } ) => {

    const { t } = useTranslation(['common', 'forumtags']);

    const [selectedPath, setSelectedPath] = useState([]);

    useEffect(() => {
        if (currentTag?.id) {
            const path = findPathToCategory(tags, currentTag.id);
            setSelectedPath(path);
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
    }, [currentTag, tags])

    const getChildren = (parentId) =>
        tags.filter((c) => c.parentId === parentId);

    const handleSelect = (level, categoryId) => {
        const newPath = [...selectedPath.slice(0, level), categoryId];
        setSelectedPath(newPath);

        if (onChange) {
            onChange(tags.find(c => c.id === categoryId)); // пробрасываем выбранный id и путь
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
                            {t(c.name, { ns: 'forumtags' })}
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

export default ForumTagSelector;