import { ICategory } from '@core/lib/types/models/category';
import PenIcon from "@core/components/common/icons/PenIcon"
import TrashIcon from "@core/components/common/icons/TrashIcon"
import Table, { Columns, TableItem } from '@/components/ui/Table/Table';
import styles from "./CategoryTable.module.scss"
import { useI18n } from '@core/lib/contexts/I18nContext';

interface CategoryTableProps {
    type: string;
    categories: ICategory[];
    onEditCategory: (id: number) => void;
    onDeleteCategory: (id: number) => void;
}

const CategoryTable = ({
    type,
    categories, 
    onEditCategory,
    onDeleteCategory
}: CategoryTableProps) => {

    const { dict } = useI18n();

    const columns: Columns = {
        id: { title: "ID" },
        title: { title: "Название" },
        parentId: { title: "ParentID" },
        actions: { title: "Действия" }
    }

    const items: TableItem[] = []
    
    categories.map(cat => items.push({
        id: cat.id,
        title: dict.categories.category[type][cat.name],
        parentId: cat.parentId,
        actions: [
            <button
                key={`action-editCategory`}
                className={`btn btn-primary ${styles.action}`}
                onClick={() => onEditCategory(cat.id)}
            >
                <PenIcon className={styles.icon}/>
            </button>,
            <button
                key={`action-deleteCategory`}
                className={`btn btn-danger ${styles.action}`}
                onClick={() => onDeleteCategory(cat.id)}
            >
                <TrashIcon className={styles.trashIcon} />
            </button>
        ]
    }))
    
    return (
        <Table
            columns={columns}
            items={items}
            className={styles.table}
        />
    )
};

export default CategoryTable;