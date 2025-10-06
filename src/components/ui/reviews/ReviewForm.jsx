import { useState } from "react";
import { 
    createReview,
    useAuth,
    useNotification
} from "@core/lib";
import { useTranslation } from 'react-i18next';

const ReviewForm = ({setReviews, listingId, profileId}) => {

    const { t } = useTranslation();

    const {user, isAuthenticated} = useAuth();
    const {notificate, notificateFromRes} = useNotification();

    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);   // выбранная оценка
    const [hover, setHover] = useState(0);     // звезда под курсором

    const createR = async () => {

        if (text.length === 0) {
            notificate(t(`notification.misc.nullReviewText`, { ns: 'messages' }), "error");
            return;
        }

        if (rating === 0) {
            notificate(t(`notification.misc.nullReviewRating`, { ns: 'messages' }), "error");
            return;
        }

        const newReview = {
            listingId,
            profileId,
            text,
            rating,
            authorId: user.id
        };
        console.log("Submitting:", newReview);
        
        const res = await createReview();

        if (res) {
            notificateFromRes(res);
            newReview.id = Date.now();
            setReviews(prev => [newReview, ...prev]);
            setText('');
            setRating(0);
        }
    };

    return (
        <>
            {(isAuthenticated && profileId != user.id) && (
                <section className="review-form">
                    <h3>{t(`reviews.item.label`, { ns: 'common' })}</h3>
                    <div id="review-form">
                        <div className="form-row">
                            <div className="rating-group">
                                <label htmlFor="rating-stars">{t(`reviews.item.rating`, { ns: 'common' })}</label>
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
                        <button 
                            onClick={createR} 
                            id="submit-review" 
                            className="btn btn-primary"
                        >
                            {t(`review.create`, { ns: 'buttons' })}
                        </button>
                    </div>
                </section>
            )}
        </>
    );
};

export default ReviewForm;