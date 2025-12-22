import { useEffect, useState } from "react";
import { getFavoritesListings, IShortListing } from "@core/lib";
import { PublicListingCard } from "@/components";
import { useTranslation } from 'react-i18next';

const FavoritesPage = () => {

    const { t } = useTranslation('common')

    const [listings, setListings] = useState<IShortListing[] | null>([]);
    
    useEffect(() => {
        getFavoritesListings().then(data => setListings(data))
    }, [])

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.favorites`, { ns: 'common' })}</h2>
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