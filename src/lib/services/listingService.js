import { apiFetch } from './apiClient';

export const getListing = (id) => apiFetch(`/api/listing/get/${id}`);
export const getListingImages = (id) => apiFetch(`/api/listing/images/${id}`);
export const viewListing = (id) => apiFetch(`/api/listing/view/${id}`, { method: 'POST' });