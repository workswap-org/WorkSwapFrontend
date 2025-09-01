import { useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useNotification } from "@/contexts/notifications/NotificationContext";

const ReviewForm = ({setReviews, listingId, profileId}) => {

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
        console.log(await res);
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
            <h3 th:text="#{reviews.leave_review}">Оставьте свой отзыв</h3>
            <div id="review-form">
                <div className="form-row">
                    <div className="rating-group">
                        <label htmlFor="rating" th:text="#{reviews.rating}">Оценка</label>
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
                        <label htmlFor="text">Текст отзыва</label>
                        <textarea 
                            id="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        >
                        </textarea>
                    </div>
                </div>
                <button onClick={createReview} id="submit-review" className="btn btn-primary">Оставить отзыв</button>
            </div>
        </section>
    );
};

export default ReviewForm;