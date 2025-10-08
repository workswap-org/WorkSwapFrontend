import { useEffect, useState } from "react";
import { getFavoritesListings } from "@core/lib";
import { PrivateListingCard } from "@/components";
import { useTranslation } from 'react-i18next';

const FavoritesPage = () => {

    const { t } = useTranslation('common')

    const [listings, setListings] = useState([]);
    
    useEffect(() => {
        async function loadFavorites() {
            const data = await getFavoritesListings();
            setListings(data.listings);
        }

        loadFavorites()
    }, [])

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.favorites`, { ns: 'common' })}</h2>
            </div>

            <div className="listings-grid">
                {listings.map((listing) => (
                        <PrivateListingCard 
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