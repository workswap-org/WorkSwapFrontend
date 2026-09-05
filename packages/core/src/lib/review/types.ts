export interface IReview {
    id: number;
    text: string;
    rating: number;
    authorSub: string;
    profileSub: string | null;
    listingId: number | null;
    createdAt: string;
}