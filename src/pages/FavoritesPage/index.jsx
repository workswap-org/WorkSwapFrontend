import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import PrivateListingCard from "@/components/cards/listing-cards/PrivateListingCard";

const FavoritesPage = () => {

    const [listings, setListings] = useState([]);
    
    useEffect(() => {
        async function loadFavorites() {
            const data = await apiFetch('/api/listing/favorites');
            setListings(data.listings);
        }

        loadFavorites()
    }, [])

    return (
        <>
            <div className="account-header">
                <h2>Избранные</h2>
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