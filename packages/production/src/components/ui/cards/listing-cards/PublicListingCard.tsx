"use client"

import { useState } from "react";
import { redirect } from "next/navigation";
import { IShortListing } from "@core/lib/types/models/listing";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { listingService } from "@core/lib/services/listingService";
import PriceTypes from "@core/components/common/PriceTypes"
import { listingTypesWithRating } from "@core/lib/constants/listingTypes";
import RatingStars from "@core/components/common/RatingStars"
import { useI18n } from "@core/lib/contexts/I18nContext";
import { HeartIcon } from "../../Icon";

const PublicListingCard = ({listing}: {listing: IShortListing}) => {

    const [isFavorite, setFavorite] = useState<boolean>(listing.liked || false);
    const [likesCount, setLikesCount] = useState<number>(listing.likes || 0);
    const { dict } = useI18n()
    const { user } = useAuth();

    const isNew = (new Date().getTime() - new Date(listing.publishedAt).getTime()) < 3 * 24 * 60 * 60 * 1000;

    const navigator = () => {
        if (listing.type == "EVENT") {
            redirect(`/listing/${listing.id}/event`)
        } else {
            redirect(`/listing/${listing.id}`)
        }
    }

    const toggleFavorite = async () => {
        setFavorite(!isFavorite); // мгновенный отклик
        if (isFavorite) {
            listingService.removeFavorite(listing.id)
                .then(() => setLikesCount(prev => prev - 1))
                .catch(() => {
                    setFavorite(true);
                    setLikesCount(prev => prev);
                })
        } else {
            listingService.addFavorite(listing.id)
                .then(() => setLikesCount(prev => prev + 1))
                .catch(() => {
                    setFavorite(false);
                    setLikesCount(prev => prev);
                })
        }
    }

    return (
        <article onClick={() => navigator()} className="public-listing-card fade-down">

            <div 
                className="image-wrapper"
                style={{ 
                    "--bg-image": `url(${listing.imagePath || "/images/placeholders/default-listing.svg"})` 
                } as React.CSSProperties}
            >
                <img
                    src={listing.imagePath || "/images/placeholders/default-listing.svg"}
                    alt="Изображение объявления"
                    onError={(e) => { e.currentTarget.src = "/images/placeholders/default-listing.svg"; }}
                />
                {user && (
                    <div className="listing-card_actions">
                        <span id="likesCount">{likesCount}</span>
                        <HeartIcon 
                            filled={isFavorite}
                            className={"like"}
                            onClick={toggleFavorite}
                        />
                    </div>
                )}
            </div>

            {isNew && (
                <div className="listing-status red">{dict.tooltips.catalog.newListing}</div>
            )}
            
            <div className="listing-card_body">
                <h3 className="listing-card_title">{listing.localizedTitle}</h3>
                {/* <p className="text">{listing.localizedDescription}</p> */}

                <PriceTypes listing={listing} />
                {listingTypesWithRating.includes(listing.type) && listing.rating > 0 && (
                    <RatingStars rating={listing.rating} />
                )}
                <span className="listing-card_location"><i className="fa-regular fa-location-dot"></i> {listing.location}</span>
                <div className="listing-card_footer">
                    
                </div>
            </div>
        </article>
    );
};

export default PublicListingCard;