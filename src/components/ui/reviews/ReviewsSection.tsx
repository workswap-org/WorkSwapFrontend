import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import { useEffect, useState } from "react";
import { getReviewslist, IReview } from "@core/lib";

interface ReviewsSectionProps {
    listingId: number | null;
    profileId: number | null;
}

const ReviewsSection = ({listingId, profileId}: ReviewsSectionProps) => {

    const [reviews, setReviews] = useState<IReview[] | null>(null);

    useEffect(() => {
        if (!profileId) return;
        const params: {profileId: number, listingId: number | null} = {profileId: profileId, listingId: null};
        if (listingId) params.listingId = listingId;

        async function loadReviews() {
            const data = await getReviewslist(params);
            setReviews(await data);
        }

        loadReviews();
    }, [listingId, profileId])

    if (!profileId) return;

    return (
        <>
            <ReviewForm setReviews={setReviews} listingId={listingId} profileId={profileId} />
            {reviews && reviews.length > 0 && (
                <ReviewsList reviews={reviews} />
            )}
        </>
    );
};

export default ReviewsSection;