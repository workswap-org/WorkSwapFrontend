"use client"

import PlusIcon from "@core/components/common/icons/PlusIcon"
import { categoryService } from "@core/lib/services/category"
import Card from "@/components/ui/Card/Card";
import CategoryTable from "@/components/pages/categories/CategoryTable/CategoryTable";
import CategoryTree from "@/components/pages/categories/CategoryTree/CategoryTree";
import styles from "./CategoriesPage.module.scss"
import Loader from "@core/components/common/Loader/Loader"
import Breadcrumbs from "@core/components/ui/Breadcrumbs/Breadcrumbs";

const CategoriesPage = () => {

    const { categories, loading } = categoryService.useCategories();

    const onAddCategory = () => {
        console.log("TODO: add category");
    };

    const onEditCategory = (id: number) => {
        console.log("TODO: edit category", id);
    };

    const onDeleteCategory = (id: number) => {
        console.log("TODO: delete category", id);
    };

    return (
        <>
            <Breadcrumbs
                crumbs={[
                    { href: "/dashboard", title: "Панель управления" },
                    { href: "#", title: "Управление категориями" },
                ]}
            />
            <Card header={
                <div className="flex-column justify-content-between align-items-center">
                    <h2>Список категорий</h2>
                    <button
                        onClick={onAddCategory}
                        className="btn btn-primary btn-overlay"
                    >
                        <PlusIcon /> Категория
                    </button>
                </div>
            }>
                <div className={styles.page}>
                    <Loader loadingActive={loading}>
                        <div className={styles.tables}>
                            {categories && Object.keys(categories)?.map((key) => (
                                <CategoryTable
                                    key={`table-${key}`}
                                    type={key}
                                    categories={categories[key]} 
                                    onDeleteCategory={onDeleteCategory} 
                                    onEditCategory={onEditCategory} 
                                />
                            ))}
                        </div>

                        {/* Дерево категорий */}
                        <div className="flex-row">
                            {categories && Object.keys(categories).map((key) => (
                                <CategoryTree 
                                    key={`tree-${key}`} 
                                    type={key} 
                                    categories={categories[key]}
                                />
                            ))}
                        </div>
                    </Loader>
                </div>
            </Card>
        </>
    );
};

export default CategoriesPage;