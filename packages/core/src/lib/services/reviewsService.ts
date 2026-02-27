import { IReview } from '../types';
import { apiFetch, apiFetchJson } from './apiClient';

export const reviewsService = {
    getReviewslist: (params: {listingId?: number, profileId?: number}) => apiFetchJson('/review/list', {}, params),
    createReview: (newReview: IReview) => apiFetch(`/review`, { method: 'POST' }, newReview)
}