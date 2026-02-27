import { apiFetchJson } from './apiClient';

export const categoryService = {
    getPathToCategory: (categoryId: number, listingType: string) => apiFetchJson(`/api/category/${listingType.toLowerCase()}/${categoryId}/path`),
    getAllCategories: () => apiFetchJson("/api/category/all"),
    getCategoriesByType: (listingType: string) => apiFetchJson(`/api/category/${listingType.toLowerCase()}/all`)
}