import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ListingRating,
    PriceTypes
} from "@core/components";
import {
    UserInfoSidebar,
    ReviewsSection
} from "@/components";
import CatalogContent from "@/pages/CatalogPage/CatalogContent";
import { useTranslation } from 'react-i18next';
import ListingGallery from "../ListingGallery";
import { 
    getListingById,
    viewListing, 
    getUserById,
} from '@core/lib';

import NotFoundPage from "@core/pages/NotFoundPage";
import ListingPageLayout from "../ListingPageLayout";

const ListingPage = () => {

    const { listigId } = useParams();
    const { t } = useTranslation(['categories', 'common', 'navigation']);

    const [listing, setListing] = useState([]);
    const [author, setAuthor] = useState([]);


    useEffect(() => {
        getListingById(listigId)
            .then(data => {
                setListing(data)
            })
            .catch(() => setListing(null))

        viewListing(listigId).then(() => {});
    }, [listigId]);

    useEffect(() => {
        if (listing?.authorId) getUserById(listing.authorId).then(data => setAuthor(data));
    }, [listing])

    /* const params = {
        categoryId: listing?.categoryId,
    } */

    if (!listing) return <NotFoundPage/>;

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
                            {listing.location || ""}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{t(`labels.rating`, { ns: 'common' })}:</span>
                        <ListingRating listing={listing}/>
                    </div>
                </>
            )}
        />
    );
};

export default ListingPage;