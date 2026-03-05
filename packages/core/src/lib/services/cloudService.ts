import { IListingImage } from '../types/models/listing';
import { apiFetchJson, apiFetchText } from './utils/apiClient';

export const cloudService = {
    uploadListingImage: (listingId: number, formData: FormData) => 
        apiFetchJson(`/cloud/listing-image`, {
            method: "POST",
            body: formData
        }, {
            listingId
        }),
    deleteListingImage: (listingId: number, img: IListingImage) =>
        apiFetchText(`/cloud/listing-image`, {
            method: "DELETE"
        }, {
            imageUrl: encodeURIComponent(img.path),
            imageId: img.id,
            listingId
        }),
    uploadAvatar: (formData: FormData) =>
        apiFetchText(`/cloud/avatar`, {
            method: "POST",
            body: formData
        }, {})
}