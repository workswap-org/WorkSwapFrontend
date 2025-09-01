import ReviewItem from "./ReviewItem";

const ReviewsList = ( { reviews } ) => {

    return (
        <section className="reviews-section" th:if="${(listing != null and !#lists.isEmpty(listing.reviews)) or (profileUser != null and !#lists.isEmpty(reviews))}" th:fragment="reviewsList">
            <h2 th:text="#{reviews.title}">Отзывы</h2>
            <div className="reviews-list">
                {reviews.map((review) => (
                    <ReviewItem review={review} key={review.id}/>
                ))}
            </div>
        </section>
    );
};

export default ReviewsList;