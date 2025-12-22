import { useEffect, useState } from "react";
import { getUserById, IReview, IShortUser } from "@core/lib";
import { Avatar, FormattedDate } from "@core/components";

const ReviewItem = ({review}: {review: IReview}) => {

    const [author, setAuthor] = useState<IShortUser | null>(null)

    useEffect(() => {
        async function loadAuthorInfo() {
            const user = await getUserById(review.authorId);
            setAuthor(user)
        }
        
        loadAuthorInfo()
    }, [review])

    if (!author) return null;
    
    return (
        <article className="review-card">
            <div className="review-card-header">
                <Avatar user={author} size={50} />
                <div className="reviewer-info">
                    <h4>{author.name}</h4>
                    <div className="review-meta">
                        <span className="review-rating">
                            {[1, 2, 3, 4, 5].map(i => (
                                <i
                                    key={i}
                                    className={
                                        "fa " +
                                        (review.rating >= i
                                            ? "fa-star"
                                            : review.rating >= i - 0.5
                                            ? "fa-star-half-o"
                                            : "fa-star-o")
                                    }
                                />
                            ))}
                        </span>
                    </div>
                </div>
                <span className="date">
                    <FormattedDate isoDate={review.createdAt} format="DMYHM" />
                </span>
                
                {/* {review.listing && profileUser && (
                    <Link 
                        className="review-listing-link text-link" 
                        href={`/listing/${review.listing.id}`}
                    >
                        {review.listing.localizedTitle}
                    </Link>
                )} */}
            </div>
            <div className="review-card-content">
                <span>{review.text}</span>
            </div>
        </article>
    );
};

export default ReviewItem;