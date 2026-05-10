"use client"

import { useEffect, useState } from "react";
import PlusIcon from "@core/components/common/icons/PlusIcon"
import { categoryService } from "@core/lib/services/category"
import Card from "@/components/ui/Card/Card";
import CategoryTable from "@/components/pages/categories/CategoryTable/CategoryTable";
import CategoryTree from "@/components/pages/categories/CategoryTree/CategoryTree";
import { ICategory } from "@core/lib/types/models/category";
import styles from "./CategoriesPage.module.scss"

const CategoriesPage = () => {
    const [categoriesTypes, setCategoriesTypes] = useState<Record<string, ICategory[]> | null>(null);

    useEffect(() => {
        categoryService.getAllCategories().then(data => setCategoriesTypes(data))
    }, []);

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
            <nav className="breadcrumbs">
                <a href="/dashboard">Панель управления</a>
                <span className="divider">/</span>
                <span>Управление категориями</span>
            </nav>
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
                    {/* Таблица категорий услуг*/}
                    <div className={styles.tables}>
                        {categoriesTypes && Object.keys(categoriesTypes)?.map((key) => (
                            <CategoryTable
                                key={`table-${key}`}
                                type={key}
                                categories={categoriesTypes[key]} 
                                onDeleteCategory={onDeleteCategory} 
                                onEditCategory={onEditCategory} 
                            />
                        ))}
                    </div>

                    {/* Дерево категорий */}
                    <div className="flex-row">
                        {categoriesTypes && Object.keys(categoriesTypes).map((key) => (
                            <CategoryTree 
                                key={`tree-${key}`} 
                                type={key} 
                                categories={categoriesTypes[key]}
                            />
                        ))}
                    </div>
                </div>
            </Card>
        </>
    );
};

export default CategoriesPage;