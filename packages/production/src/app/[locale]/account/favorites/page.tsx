"use client"

import PublicListingCard from "@/components/ui/cards/PublicListingCard/PublicListingCard";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { listingService } from "@core/lib/services/listing";
import AccountHeader from "@/components/pages/account/AccountHeader/AccountHeader";
import Loader from "@core/components/common/Loader/Loader";

const FavoritesPage = () => {

    const { dict } = useI18n()

    const {loading, listings} = listingService.useMyFavorites();

    return (
        <>
            <AccountHeader title={dict.common.titles.favorites} />

            <Loader loadingActive={loading}>
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
            </Loader>
        </>
    );
};

export default FavoritesPage;