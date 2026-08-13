"use client"

import { useCatalogFilters } from "@core/lib/providers/local/CatalogFiltersProvider";
import styles from "./Pagination.module.scss"

const Pagination = () => {

    const { filters, updateFilter, totalPages } = useCatalogFilters();

    const page = filters.page ?? 0;

    const getPageNumbers = () => {
        if (!totalPages) return []

        const maxButtons = 5;

        if (totalPages <= maxButtons) {
            return Array.from({ length: totalPages }, (_, i) => i); // 0-based
        }

        const pages = [];

        // первая
        pages.push(0);

        let start = Math.max(page - 1, 1);
        let end = Math.min(page + 1, totalPages - 2);

        // если рядом с началом
        if (page <= 2) {
            start = 1;
            end = 3;
        }

        // если рядом с концом
        if (page >= totalPages - 3) {
            start = totalPages - 4;
            end = totalPages - 2;
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // последняя
        pages.push(totalPages - 1);

        return pages;
    }

    return totalPages && (
        <div className={styles.pagination}>
            <button disabled={page === 0} onClick={() => updateFilter("page", page - 1)}>
                Назад
            </button>

            {getPageNumbers().map(p => (
                <button
                    key={p}
                    className={`${styles.pageNumber} ${p === page ? styles.active : ""}`}
                    onClick={() => updateFilter("page", p)}
                >
                    {p + 1}
                </button>
            ))}

            <button disabled={page + 1 >= totalPages} onClick={() => updateFilter("page", page + 1)}>
                Вперёд
            </button>
        </div>
    )
}

export default Pagination;