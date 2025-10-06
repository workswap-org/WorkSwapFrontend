import { useEffect, useState } from "react";
import { getUserById } from "@core/lib";
import Avatar from "@core/components/common/Avatar";
import FormattedDate from "@core/components/common/date/FormattedDate";

const ReviewItem = ({review}) => {

    const [author, setAuthor] = useState([])

    useEffect(() => {
        async function loadAuthorInfo() {
            const data = await getUserById();
            setAuthor(await data.user)
        }
        
        loadAuthorInfo()
    }, [review])
    return (
        <article className="review-card">
            <div className="review-header">
                <Avatar user={author} size={50} />
                <div className="reviewer-info">
                    <h4>{author.name}</h4>
                    <div className="review-meta">
                        <span className="review-rating listing-rating">
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
                <span className="review-date">
                    <FormattedDate isoDate={review.createdAt} />
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
            <div className="review-content">
                <span>{review.text}</span>
            </div>
        </article>
    );
};

export default ReviewItem;