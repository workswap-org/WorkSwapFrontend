export interface IReview {
    id: number;
    text: string;
    rating: number;
    authorId: number;
    profileId: number | null;
    listingId: number | null;
    createdAt: string;
}