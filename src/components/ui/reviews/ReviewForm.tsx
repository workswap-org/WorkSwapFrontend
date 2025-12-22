import { Dispatch, SetStateAction, useState } from "react";
import { 
    createReview,
    IReview,
    useAuth,
    useNotification
} from "@core/lib";
import { useTranslation } from 'react-i18next';

interface ReviewFormProps {
    setReviews: Dispatch<SetStateAction<IReview[] | null>>;
    listingId: number | null;
    profileId: number;
}

const ReviewForm = ({setReviews, listingId, profileId}: ReviewFormProps) => {

    const { t } = useTranslation('messages');

    const {user, isAuthenticated} = useAuth();
    const { notificate } = useNotification();

    const [text, setText] = useState<string>('');
    const [rating, setRating] = useState<number>(0);   // выбранная оценка
    const [hover, setHover] = useState<number>(0);     // звезда под курсором

    const createR = async () => {

        if (!user) return; 

        if (text.length === 0) {
            notificate(t(`notification.misc.nullReviewText`, { ns: 'messages' }), "error");
            return;
        }

        if (rating === 0) {
            notificate(t(`notification.misc.nullReviewRating`, { ns: 'messages' }), "error");
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
        
        const res = await createReview(newReview);

        if (res.ok) {
            notificate(t(`notification.success.reviewCreate`, { ns: 'messages' }), "success");
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
                    <h3>{t(`reviews.item.label`, { ns: 'common' })}</h3>
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
                </section>
            )}
        </>
    );
};

export default ReviewForm;