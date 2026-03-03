"use client"

import { IReview } from "@core/lib/types/models/review";
import ReviewItem from "./ReviewItem";
import { useI18n } from "@core/lib/contexts/I18nContext";

const ReviewsList = ({ reviews }: {reviews: IReview[] | null}) => {

    const { dict } = useI18n();

    return (
        <section className="reviews">
            <h2>{dict.common.reviews.listLabel}</h2>
            <div className="list">
                {reviews?.map((review) => (
                    <ReviewItem review={review} key={review.id}/>
                ))}
            </div>
        </section>
    );
};

export default ReviewsList;