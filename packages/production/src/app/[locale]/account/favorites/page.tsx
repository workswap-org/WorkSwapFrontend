"use client"

import PublicListingCard from "@/components/ui/cards/PublicListingCard/PublicListingCard";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { listingService } from "@core/lib/services/listing";
import accountStyles from "@/app/[locale]/account/AccountLayout.module.scss"

const FavoritesPage = () => {

    const { dict } = useI18n()

    const listings = listingService.useMyFavorites();

    return (
        <>
            <div className={accountStyles.accountHeader}>
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