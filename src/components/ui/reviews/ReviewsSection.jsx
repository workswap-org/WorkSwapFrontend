import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import { useEffect, useState } from "react";
import { apiFetch } from "@core/lib/services/apiClient";

const ReviewsSection = ( {listingId, profileId} ) => {

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!profileId && !listingId) return;
        const params = {};
        if (profileId) params.profileId = profileId;
        if (listingId) params.listingId = listingId;

        async function loadReviews() {
            const data = await apiFetch('/api/review/list', {}, params);
            console.log(data)
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