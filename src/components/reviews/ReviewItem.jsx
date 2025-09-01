import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import Avatar from "@/components/small-components/Avatar";
import { Link } from "react-router-dom";

const ReviewItem = ({review}) => {

    const [author, setAuthor] = useState([])

    useEffect(() => {
        async function loadAuthorInfo() {
            const data = await apiFetch(`/api/user/get/${review.authorId}`)
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
                        <span className="review-date">{review.createdAt}</span>
                    </div>
                </div>
                
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
                <p>{review.text}</p>
            </div>
        </article>
    );
};

export default ReviewItem;