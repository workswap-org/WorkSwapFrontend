"use client"

import { useAuth } from "@core/lib/contexts/AuthContext";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { Dispatch, SetStateAction, useState } from "react";
import { IReview } from "@core/lib/types/models/review"
import { reviewsService } from "@core/lib/services/reviewsService"

interface ReviewFormProps {
    setReviews: Dispatch<SetStateAction<IReview[] | null>>;
    listingId: number | null;
    profileId: number;
}

const ReviewForm = ({setReviews, listingId, profileId}: ReviewFormProps) => {

    const { dict } = useI18n();

    const {user, isAuthenticated} = useAuth();
    const { notificate } = useNotification();

    const [text, setText] = useState<string>('');
    const [rating, setRating] = useState<number>(0);   // выбранная оценка
    const [hover, setHover] = useState<number>(0);     // звезда под курсором

    const createR = async () => {

        if (!user) return; 

        if (text.length === 0) {
            notificate(dict.messages.notification.misc.nullReviewText, "error");
            return;
        }

        if (rating === 0) {
            notificate(dict.messages.notification.misc.nullReviewRating, "error");
            return;
        }

        const newReview: IReview = {
            id: 0,
            text,
            rating,
            authorId: user.id,
            listingId,
            profileId,
            createdAt: new Date().toISOString()
        };
        
        const res = await reviewsService.createReview(newReview);

        if (res.ok) {
            notificate(dict.messages.notification.success.reviewCreate, "success");
            newReview.id = Date.now();
            setReviews(prev => {
                if (!prev) return prev;
                return [newReview, ...prev]
            });
            setText('');
            setRating(0);
        }
    };

    return (
        <>
            {(isAuthenticated && profileId && profileId != user?.id) && (
                <section className="review-form">
                    <h3>{dict.common.reviews.item.label}</h3>
                    <div className="form-row">
                        <div className="rating-group">
                            <label htmlFor="rating-stars">{dict.common.reviews.item.rating}</label>
                            <div className="listing-rating" id="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={
                                            "fa-solid fa-star star " +
                                            (hover >= star 
                                                ? "hovered" 
                                                : rating >= star 
                                                ? "selected" 
                                                : "")
                                        }
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                    ></i>
                                ))}
                            </div>
                        </div>
                        <div className="text-group">
                            <label htmlFor="text">{dict.common.reviews.item.text}</label>
                            <textarea 
                                id="text" 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={dict.common.placeholders.review}
                            >
                            </textarea>
                        </div>
                    </div>
                    <button 
                        onClick={createR} 
                        id="submit-review" 
                        className="btn btn-primary"
                    >
                        {dict.buttons.review.create}
                    </button>
                </section>
            )}
        </>
    );
};

export default ReviewForm;