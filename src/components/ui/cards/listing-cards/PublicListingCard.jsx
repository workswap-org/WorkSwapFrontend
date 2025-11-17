import { 
    PriceTypes,
    ListingRating
} from "@core/components";
import {
    checkFavorite,
    toggleFavorite,
    useAuth
} from "@core/lib";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const PublicListingCard = ({listing}) => {

    const navigate = useNavigate();
    const [isFavorite, setFavorite] = useState(false);
    const { t } = useTranslation('common')
    const { user } = useAuth();

    const isNew = (new Date() - new Date(listing.publishedAt)) < 3 * 24 * 60 * 60 * 1000;

    useEffect(() => {

        if (listing.id && user) {
            checkFavorite(listing.id, setFavorite);
        }
        
    }, [listing.id, user]);

    if (listing.testMode || listing.temporary) return null;

    const navigator = () => {
        if (listing.type == "EVENT") {
            navigate(`/event/${listing.id}`)
        } else {
            navigate(`/listing/${listing.id}`)
        }
    }

    return (
        <article onClick={() => navigator()} className="listing-card hover-animation-card">
            <img 
                src={listing.imagePath || `/images/default-listing.svg`}
                alt="Изображение объявления"
                onError={(e) => { e.currentTarget.src = `/images/default-listing.svg`; }}
            />

            {isNew && (
                <div className="listing-status red">{t(`catalog.newListing`, { ns: 'tooltips' })}</div>
            )}
            <div className="listing-card_body">
                <h3 className="listing-card_title">{listing.localizedTitle}</h3>
                {/* <p className="text">{listing.localizedDescription}</p> */}
                <div className="listing-card_footer">
                    <div className="flex-column">
                        {/* компонент для отображение цены (с типом) */}
                        <PriceTypes listing={listing} />
                        <ListingRating listing={listing} />
                    </div>
                    <span className="listing-card_location">{listing.location}</span>
                </div>
                {user && (
                    <div className="listing-card_actions">
                        <i 
                            className={`${isFavorite ? 'fa-solid active' : 'fa-regular'} fa-heart like`} 
                            onClick={(e) => toggleFavorite(listing.id, setFavorite, isFavorite, e)}></i>
                    </div>
                )}
            </div>
        </article>
    );
};

export default PublicListingCard;