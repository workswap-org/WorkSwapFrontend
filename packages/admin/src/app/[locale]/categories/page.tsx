"use client"

import { categoryService } from "@core/lib/category/services"
import Card from "@/components/ui/Card/Card";
import CategoryTable from "@/components/pages/categories/CategoryTable/CategoryTable";
import styles from "./CategoriesPage.module.scss"
import Loader from "@core/components/common/Loader/Loader"
import Breadcrumbs from "@core/components/ui/Breadcrumbs/Breadcrumbs";
import { ListingType } from "@core/lib/listing/constants/listingTypes";
import clsx from "clsx"

const CategoriesPage = () => {

    const { categories, loading, listingType, setListingType, categoriesCount } = categoryService.useCategories();

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
            <div className={styles.listingTypes}>
                {Object.values(ListingType).map(type => (
                    <button 
                        key={type}
                        className={clsx(styles.listingType, type == listingType ? styles.active : "")} 
                        onClick={() => setListingType(type)}
                    >
                        {type} ({categoriesCount.get(type)})
                    </button>
                ))}
            </div>
            <Card header={listingType}>
                <Loader loadingActive={loading}>
                    <div className={styles.page}>
                        <div className={styles.tables}>
                            <CategoryTable
                                type={listingType}
                                categories={categories}
                                onDeleteCategory={onDeleteCategory}
                                onEditCategory={onEditCategory}
                            />
                        </div>
                    </div>
                </Loader>
            </Card>
        </>
    );
};

export default CategoriesPage;