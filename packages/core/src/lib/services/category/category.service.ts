import { apiFetchJson } from '../utils/apiClient';

export const getPathToCategory = (categoryId: number, listingType: string) => apiFetchJson(`/category/${listingType.toLowerCase()}/${categoryId}/path`);
export const getAllCategories = () => apiFetchJson("/category/all");
export const getCategoriesByType = (listingType: string) => apiFetchJson(`/category/${listingType.toLowerCase()}/all`)