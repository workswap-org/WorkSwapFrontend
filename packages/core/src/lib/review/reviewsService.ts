import { IReview } from '@core/lib/review/types';
import { apiFetch, apiFetchJson } from '@core/lib/common/utils/apiClient';

export const reviewsService = {
    getReviewslist: (params: {listingId?: number, profileId?: number}) => apiFetchJson('/review/list', {}, params),
    createReview: (newReview: IReview) => apiFetch(`/review`, { method: 'POST' }, newReview)
}