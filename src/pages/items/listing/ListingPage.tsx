import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    RatingStars,
    PriceTypes
} from "@core/components";
import { useTranslation } from 'react-i18next';
import { 
    getListingById,
    viewListing, 
    IListingPageRequest,
    IShortUserProfile,
} from '@core/lib';

import NotFoundPage from "@core/pages/NotFoundPage";
import ListingPageLayout from "./ListingPageLayout";

const ListingPage = () => {

    const { listigId } = useParams();
    const { t } = useTranslation(['categories', 'common', 'navigation']);

    const [listing, setListing] = useState<IListingPageRequest | null>(null);
    const [author, setAuthor] = useState<IShortUserProfile | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        getListingById(listigId)
            .then(listing => {
                setListing(listing)
                setAuthor(listing.author)
            })
            .catch(() => setError(true))

        viewListing(listigId).then(() => {});
    }, [listigId]);

    if (error) return <NotFoundPage/>;

    return (
        <ListingPageLayout
            listing={listing} 
            author={author}
            details={(
                <>
                    <div className="detail-item">
                        <span className="detail-label">{t(`labels.price`, { ns: 'common' })}:</span>
                        <h1><PriceTypes listing={listing} className={"listing"} /></h1>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{t(`labels.location`, { ns: 'common' })}:</span>
                        <span className="detail-value">
                            {listing?.location || ""}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{t(`labels.rating`, { ns: 'common' })}:</span>
                        <RatingStars rating={listing?.rating ?? 0}/>
                    </div>
                </>
            )}   
        />
    );
};

export default ListingPage;