import { ICategory } from '@core/lib/types/models/category';
import PenIcon from "@core/components/common/icons/PenIcon"
import TrashIcon from "@core/components/common/icons/TrashIcon"

interface CategoryTableProps {
    categories: ICategory[]
    onEditCategory: (id: number) => void
    onDeleteCategory: (id: number) => void
}

const CategoryTable = ({
    categories, 
    onEditCategory,
    onDeleteCategory
}: CategoryTableProps) => {
    return (

        //тестовый коммент
        
        <div className="admin-table-wrapper" id="categoriesTable">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>ParentID</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.parentId || "—"}</td>
                                <td>
                                    <div className="button-actions">
                                        <button
                                            className="btn btn-primary mr-1"
                                            onClick={() =>
                                                onEditCategory(
                                                    category.id
                                                )
                                            }
                                        >
                                            <PenIcon />
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                onDeleteCategory(
                                                    category.id
                                                )
                                            }
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Нет категорий</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;