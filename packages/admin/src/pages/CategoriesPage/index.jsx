import { useEffect, useState } from "react";
import CategoryTree from "./CategoryTree";
import { getAllCategories } from "@core/lib";
import CategoryTable from "./CategoryTable";

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAllCategories().then(data => setCategories(data))
    }, []);

    const onAddCategory = () => {
        console.log("TODO: add category");
    };

    const onEditCategory = (id) => {
        console.log("TODO: edit category", id);
    };

    const onDeleteCategory = (id) => {
        console.log("TODO: delete category", id);
    };

    return (
        <>
            <nav className="breadcrumbs">
                <a href="/dashboard">Панель управления</a>
                <span className="divider">/</span>
                <span href="/locations">Управление категориями</span>
            </nav>
            <div className="card admin-page">
                <div className="card__body">
                    <div className="card__header">
                        <div className="flex-column justify-content-between align-items-center">
                            <h2>Список категорий</h2>
                            <button
                                onClick={onAddCategory}
                                className="btn btn-primary btn-overlay"
                            >
                                <i className="fa-solid fa-plus"></i> Категория
                            </button>
                        </div>
                    </div>

                    <div className="categories-page">
                        {/* Таблица категорий услуг*/}
                        <div className="tables">
                            {categories.map((type) => (
                                <CategoryTable 
                                    categories={type} 
                                    onDeleteCategory={onDeleteCategory} 
                                    onEditCategory={onEditCategory} 
                                />
                            ))}
                        </div>

                        {/* Дерево категорий */}
                        <div className="flex-row">
                            {categories.map((type) => (
                                <CategoryTree categories={type} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoriesPage;