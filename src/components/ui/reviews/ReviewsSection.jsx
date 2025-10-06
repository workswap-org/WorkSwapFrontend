import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import { useEffect, useState } from "react";
import { getReviewslist } from "@core/lib";

const ReviewsSection = ( {listingId, profileId} ) => {

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!profileId && !listingId) return;
        const params = {};
        if (profileId) params.profileId = profileId;
        if (listingId) params.listingId = listingId;

        async function loadReviews() {
            const data = await getReviewslist(params);
            setReviews(await data.reviews);
        }

        loadReviews();
    }, [listingId, profileId])

    return (
        <>
            <ReviewForm setReviews={setReviews} listingId={listingId} profileId={profileId} />
            {reviews.length > 0 && (
                <ReviewsList reviews={reviews} />
            )}
        </>
    );
};

export default ReviewsSection;