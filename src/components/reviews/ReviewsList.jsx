import ReviewItem from "./ReviewItem";
import { useTranslation } from 'react-i18next';

const ReviewsList = ( { reviews } ) => {

    const { t } = useTranslation(['common']);

    return (
        <section className="reviews-section">
            <h2>{t(`reviews.listLabel`, { ns: 'common' })}</h2>
            <div className="reviews-list">
                {reviews.map((review) => (
                    <ReviewItem review={review} key={review.id}/>
                ))}
            </div>
        </section>
    );
};

export default ReviewsList;