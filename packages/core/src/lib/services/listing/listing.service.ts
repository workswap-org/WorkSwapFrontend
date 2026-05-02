import { ICatalogFilters } from "@core/lib/types/catalog"
import { apiFetch, apiFetchJson, apiFetchText } from "../utils/apiClient"
import { IListingTranslation } from "@core/lib/types/models/listing";

export const getListingAccessToken = (listingId: number) => apiFetchJson(`/listing/${listingId}/token`, {method: "GET"});

export const getPageById = (listingId: number) => apiFetchJson(`/listing/${listingId}/page`);
export const getById = (listingId: number, token?: string) => apiFetchJson(`/listing/${listingId}`, {method: "GET"}, {token});

export const getImages = (listingId: number) => apiFetchJson(`/listing/${listingId}/images`);
export const getTranslations = (listingId: number) => apiFetchJson(`/listing/${listingId}/translations`);
export const getCatalog = (params: ICatalogFilters) => 
        apiFetchJson(`/listing/catalog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params)
        });

export const getFavorites = () => apiFetchJson('/listing/favorites');
export const getMyListings = () => apiFetchJson('/listing/my-listings');
export const getDrafts = () => apiFetchJson("/listing/drafts");
export const getByUserId = (userId: number) => apiFetchJson(`/listing/by-user`, {}, {userId});
export const getRecentListings = (count: number) => apiFetchJson(`/listing/recent`, {}, {count});

export const deleteListing = (listingId: number) => apiFetch(`/listing/${listingId}`, {method: 'DELETE'});
export const create = (type: string) => apiFetchText(`/listing`, {method: "POST"}, {type});
export const publish = (listingId: number) => apiFetch(`/listing/${listingId}/publish`, {method: 'PATCH'});

export const modify = (listingId: number, updates: Record<string, any>) => 
        apiFetch(`/listing/${listingId}/modify`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });

export const modifyTranslations = (listingId: number, translations: IListingTranslation) => 
        apiFetchJson(`/listing/${listingId}/modify/translations`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(translations),
        });

export const checkFavorite = (listingId: number) => apiFetchJson(`/listing/${listingId}/favorite`, {method: 'GET'});
export const addFavorite = (listingId: number) => apiFetch(`/listing/${listingId}/favorite`, {method: 'POST'});
export const removeFavorite = (listingId: number) => apiFetch(`/listing/${listingId}/favorite`, {method: 'DELETE'});

export const uploadListingImage = (listingId: number, formData: FormData) => 
        apiFetchJson(`/listing/${listingId}/image`, {
            method: "POST",
            body: formData
        }, {
            listingId
        });

export const deleteListingImage = (imageId: number) => 
        apiFetchJson(`/listing/${imageId}/image`, { method: "DELETE" }, {});