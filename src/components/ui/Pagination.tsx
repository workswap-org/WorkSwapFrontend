interface PaginationProps {
    page: number;
    totalPages: number;
    selectPage: (page: number) => void
}

const Pagination = ({page, totalPages, selectPage}: PaginationProps) => {

    const getPageNumbers = () => {
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

    return (
        <div className="pagination">
            <button disabled={page === 0} onClick={() => selectPage(page - 1)}>
                Назад
            </button>

            {getPageNumbers().map(p => (
                <button
                    key={p}
                    id="pageNumber"
                    className={p === page ? "active" : ""}
                    onClick={() => selectPage(p)}
                >
                    {p + 1}
                </button>
            ))}

            <button disabled={page + 1 >= totalPages} onClick={() => selectPage(page + 1)}>
                Вперёд
            </button>
        </div>
    )
}

export default Pagination;