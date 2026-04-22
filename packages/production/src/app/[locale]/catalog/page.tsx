import { CatalogFiltersProvider } from "@core/lib/providers/local/CatalogFiltersProvider"
import CatalogPage from "./CatalogPage"

export default async function CatalogPageWrapper({ searchParams }: { searchParams: Record<string, string | string[] | undefined>}) {
    const params = await searchParams;

    return (
        <CatalogFiltersProvider 
            initialFilters={{
                categoryId: Number(params.categoryId) || undefined,
                searchQuery: params.searchQuery ? String(params.searchQuery) : undefined,
                hasReviews: params.hasReviews === "on",
                translationsFilter: params.translationsFilter === "on",
                sortBy: params.sortBy ? String(params.sortBy) : "date",
                type: params.type ? String(params.type) : undefined,
                page: Number(params.page) || 0
            }}
        >
            <CatalogPage />
        </CatalogFiltersProvider>
    )
}