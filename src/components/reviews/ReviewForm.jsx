import { useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { useNotification } from "@/lib/contexts/notifications/NotificationContext";
import { useTranslation } from 'react-i18next';

const ReviewForm = ({setReviews, listingId, profileId}) => {

    const { t } = useTranslation();

    const {user} = useAuth();
    const notificate = useNotification();

    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);   // выбранная оценка
    const [hover, setHover] = useState(0);     // звезда под курсором

    const createReview = async () => {
        const newReview = {
            listingId,
            profileId,
            text,
            rating,
            authorId: user.id
        };
        console.log("Submitting:", newReview);
        
        const res = await apiFetch(`/api/review/create`, { method: 'POST' }, newReview);

        if (res) {
            notificate(res.message, "success");
            newReview.id = Date.now();
            setReviews(prev => [newReview, ...prev]);
            setText('');
            setRating(0);
        }
    };

    return (
        <section className="review-form" th:if="${isAuthenticated and profileUser != null}" th:fragment="profileReviewForm">
            <h3 th:text="#{reviews.leave_review}">{t(`reviews.item.label`, { ns: 'common' })}</h3>
            <div id="review-form">
                <div className="form-row">
                    <div className="rating-group">
                        <label htmlFor="rating-stars" th:text="#{reviews.rating}">{t(`reviews.item.rating`, { ns: 'common' })}</label>
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
                                >
                                    
                                </i>
                            ))}
                        </div>
                    </div>
                    <div className="text-group">
                        <label htmlFor="text">{t(`reviews.item.text`, { ns: 'common' })}</label>
                        <textarea 
                            id="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={t(`placeholders.review`, { ns: 'common' })}
                        >
                        </textarea>
                    </div>
                </div>
                <button onClick={createReview} id="submit-review" className="btn btn-primary">{t(`review.create`, { ns: 'buttons' })}</button>
            </div>
        </section>
    );
};

export default ReviewForm;