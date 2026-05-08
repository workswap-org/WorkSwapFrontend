const buildCategoryTree = (categories) => {
    const map = new Map();
    const roots = [];

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
const CategoryTree = ({ categories }) => {
    const tree = buildCategoryTree(categories);

    const renderTree = (nodes) => (
        <ul>
            {nodes.map(node => (
                <li key={node.id}>
                    <span>{node.name}</span>
                    {node.children.length > 0 && renderTree(node.children)}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="categories-list">
            {renderTree(tree)}
        </div>
    );
};

export default CategoryTree;