import { ICatalogFilters, IListingTranslation } from '../types';
import { apiFetchJson, apiFetch, apiFetchText } from './utils/apiClient';

export const listingService = {
    getListingAccessToken: (listingId: number) => apiFetchJson(`/listing/${listingId}/token`, {method: "GET"}),

    getPageById: (listingId: number) => apiFetchJson(`/listing/${listingId}/page`),
    getById: (listingId: number, token?: string) => apiFetchJson(`/listing/${listingId}`, {method: "GET"}, {token}),

    getImages: (listingId: number) => apiFetchJson(`/listing/${listingId}/images`),
    getTranslations: (listingId: number) => apiFetchJson(`/listing/${listingId}/translations`),
    getCatalog: (params: ICatalogFilters) => 
        apiFetchJson(`/listing/catalog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params)
        }),

    getFavorites: () => apiFetchJson('/listing/favorites'),
    getMyListings: () => apiFetchJson('/listing/my-listings'),
    getDrafts: () => apiFetchJson("/listing/drafts"),
    getByUserId: (userId: number) => apiFetchJson(`/listing/by-user`, {}, {userId}),
    getRecentListings: (count: number) => apiFetchJson(`/listing/recent`, {}, {count}),

    addView: (listingId: number) => apiFetch(`/listing/${listingId}/view`, { method: 'POST' }),
    delete: (listingId: number) => apiFetch(`/listing/${listingId}`, {method: 'DELETE'}),
    create: (type: string) => apiFetchText(`/listing`, {method: "POST"}, {type}),
    publish: (listingId: number) => apiFetch(`/listing/${listingId}/publish`, {method: 'PATCH'}),

    modify: (listingId: number, updates: Record<string, any>) => 
        apiFetch(`/listing/${listingId}/modify`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        }),

    modifyTranslations: (listingId: number, translations: IListingTranslation) => 
        apiFetchJson(`/listing/${listingId}/modify/translations`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(translations),
        }),

    checkFavorite: (listingId: number) => apiFetchJson(`/listing/${listingId}/favorite`, {method: 'POST'}),
    addFavorite: (listingId: number) => apiFetch(`/listing/${listingId}/favorite`, {method: 'POST'}),
    removeFavorite: (listingId: number) => apiFetch(`/listing/${listingId}/favorite`, {method: 'DELETE'})
}