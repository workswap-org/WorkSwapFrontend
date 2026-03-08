import { apiFetchJson } from './utils/apiClient';

export const categoryService = {
    getPathToCategory: (categoryId: number, listingType: string) => apiFetchJson(`/category/${listingType.toLowerCase()}/${categoryId}/path`),
    getAllCategories: () => apiFetchJson("/category/all"),
    getCategoriesByType: (listingType: string) => apiFetchJson(`/category/${listingType.toLowerCase()}/all`)
}