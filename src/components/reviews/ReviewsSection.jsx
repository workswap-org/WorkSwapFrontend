import ReviewForm from "./reviewForm";
import ReviewsList from "./ReviewsList";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";

const ReviewsSection = ( {listingId, profileId} ) => {

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function loadReviews() {
            const data = await apiFetch('/api/review/list', {}, {profileId, listingId});
            setReviews(await data.reviews);
        }

        loadReviews();
    }, [listingId, profileId])

    return (
        <>
            <ReviewForm setReviews={setReviews} listingId={listingId} profileId={profileId} />
            <ReviewsList reviews={reviews} />
        </>
    );
};

export default ReviewsSection;