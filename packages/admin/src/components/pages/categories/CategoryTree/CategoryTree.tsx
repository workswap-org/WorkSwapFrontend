import { ICategory } from "@core/lib/types/models/category";
import styles from "./CategoryTree.module.scss"
import { useI18n } from "@core/lib/contexts/I18nContext";

interface CategoryTreeItem extends ICategory {
    children?: CategoryTreeItem[]
}

const buildCategoryTree = (categories: CategoryTreeItem[]) => {
    const map = new Map();
    const roots: ICategory[] = [];

    // Создаём копии категорий с пустыми children
    categories.forEach(cat => map.set(cat.id, { ...cat, children: [] }));

    // Формируем дерево
    map.forEach(cat => {
        if (cat.parentId) {
            const parent = map.get(cat.parentId);
            if (parent) parent.children.push(cat);
        } else {
            roots.push(cat);
        }
    });

    return roots;
};

// Компонент дерева категорий
const CategoryTree = ({ type, categories }: {type: string, categories: ICategory[]}) => {
    const tree = buildCategoryTree(categories);
    const { dict } = useI18n();

    const renderTree = (nodes: CategoryTreeItem[]) => (
        <ul>
            {nodes.map((node) => (
                <li key={node.id}>
                    <span>{dict.categories.category[type][node.name]}</span>
                    {node.children && node.children.length > 0 && renderTree(node.children)}
                </li>
            ))}
        </ul>
    );

    return (
        <div className={styles.categoriesList}>
            {renderTree(tree)}
        </div>
    );
};

export default CategoryTree;