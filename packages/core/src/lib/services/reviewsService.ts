import { IReview } from '../types/models/review';
import { apiFetch, apiFetchJson } from './utils/apiClient';

export const reviewsService = {
    getReviewslist: (params: {listingId?: number, profileId?: number}) => apiFetchJson('/review/list', {}, params),
    createReview: (newReview: IReview) => apiFetch(`/review`, { method: 'POST' }, newReview)
}