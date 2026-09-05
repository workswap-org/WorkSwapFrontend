"use client"

import Avatar from "@core/components/common/Avatar/Avatar";
import FormattedDate from "@core/components/common/date/FormattedDate";
import { userService } from "@core/lib/user/services";
import { IReview } from "@core/lib/review/types";
import { IShortUser } from "@core/lib/user/types";
import { useEffect, useState } from "react";
import styles from "./ReviewItem.module.scss"
import StarIcon from "@core/components/common/icons/StarIcon";

const ReviewItem = ({review}: {review: IReview}) => {

    const [author, setAuthor] = useState<IShortUser | null>(null)

    useEffect(() => {
        async function loadAuthorInfo() {
            const user = await userService.getBySub(review.authorSub);
            setAuthor(user)
        }
        
        loadAuthorInfo()
    }, [review])

    if (!author) return null;
    
    return (
        <article className={styles.review}>
            <div className={styles.header}>
                <Avatar user={author} size={50} />
                <div className={styles.reviewer}>
                    <h4>{author.name}</h4>
                    <div className={styles.meta}>
                        <span className={styles.rating}>
                            {[1, 2, 3, 4, 5].map(i => (
                                review.rating >= i ? (
                                    <StarIcon key={i} filled />
                                ) : review.rating >= i - 0.5 ? (
                                    <StarIcon key={i} half />
                                ) : (
                                    <StarIcon key={i} />
                                )
                            ))}
                        </span>
                    </div>
                </div>
                <span className={styles.date}>
                    <FormattedDate isoDate={review.createdAt} format="DMYHM" />
                </span>
            </div>
            <span className={styles.content}>{review.text}</span>
        </article>
    );
};

export default ReviewItem;