"use client"

import { useState } from "react";
import { redirect } from "next/navigation";
import { IShortListing } from "@core/lib/types/models/listing";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { listingService } from "@core/lib/services/listing";
import PriceTypes from "@core/components/common/PriceTypes"
import { listingTypesWithRating } from "@core/lib/constants/listingTypes";
import RatingStars from "@core/components/common/RatingStars"
import { useI18n } from "@core/lib/contexts/I18nContext";
import { HeartIcon } from "../../Icon";

const PublicListingCard = ({listing}: {listing: IShortListing}) => {

    const { dict } = useI18n()
    const { isAuthenticated } = useAuth();

    const isNew = (new Date().getTime() - new Date(listing.publishedAt).getTime()) < 3 * 24 * 60 * 60 * 1000;
    const { isFavorite, toggleFavorite, likesCount } = listingService.useFavorite(listing);

    const navigator = () => {
        if (listing.type == "EVENT") {
            redirect(`/listing/${listing.id}/event`)
        } else {
            redirect(`/listing/${listing.id}`)
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
                {isAuthenticated && (
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