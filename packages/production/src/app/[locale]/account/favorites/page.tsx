"use client"

import PublicListingCard from "@/components/ui/cards/PublicListingCard/PublicListingCard";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { listingService } from "@core/lib/services/listing";
import { IShortListing } from "@core/lib/types/models/listing";
import { useEffect, useState } from "react";

const FavoritesPage = () => {

    const { dict } = useI18n()

    const [listings, setListings] = useState<IShortListing[] | null>([]);
    
    useEffect(() => {
        listingService.getFavorites().then(setListings)
    }, [])

    return (
        <>
            <div className="account-header">
                <h2>{dict.common.titles.favorites}</h2>
            </div>

            <div className="listings-grid">
                {listings?.slice()
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                    .map((listing) => (
                        <PublicListingCard 
                            key={listing.id}
                            listing={listing}
                        />
                    ))
                }
            </div>
        </>
    );
};

export default FavoritesPage;