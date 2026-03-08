"use client"

import { useEffect, useState } from "react";
import NotFoundPage from "@core/pages/NotFoundPage";
import { useParams } from "next/navigation";
import { IListingPageRequest } from "@core/lib/types/models/listing";
import { IShortUserProfile } from "@core/lib/types/models/user";
import { listingService } from "@core/lib/services/listingService";
import ListingPageLayout from "./ListingPageLayout";
import PriceTypes from "@core/components/common/PriceTypes";
import RatingStars from "@core/components/common/RatingStars";
import { useI18n } from "@core/lib/contexts/I18nContext";

const ListingPage = () => {

    const { id } = useParams();
    const listigId = Number(id);
    const { dict } = useI18n();

    const [listing, setListing] = useState<IListingPageRequest | null>(null);
    const [author, setAuthor] = useState<IShortUserProfile | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        listingService.getPageById(listigId)
            .then(listing => {
                setListing(listing)
                setAuthor(listing.author)
            })
            .catch(() => setError(true))
    }, [listigId]);

    if (error) return <NotFoundPage/>;

    return listing && (
        <ListingPageLayout
            listing={listing} 
            author={author}
            details={(
                <>
                    <div className="detail-item">
                        <span className="detail-label">{dict.common.labels.price}:</span>
                        <h1><PriceTypes listing={listing} className={"listing"} /></h1>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{dict.common.labels.location}:</span>
                        <span className="detail-value">
                            {listing?.location || ""}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{dict.common.labels.rating}:</span>
                        <RatingStars rating={listing?.rating ?? 0}/>
                    </div>
                </>
            )}   
        />
    );
};

export default ListingPage;