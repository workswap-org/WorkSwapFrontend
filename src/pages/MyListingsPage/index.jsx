import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import PrivateListingCard from "@/components/cards/listing-cards/PrivateListingCard";

const MyListingsPage = () => {

    const [listings, setListings] = useState([]);
    
    useEffect(() => {
        async function loadMyListings() {
            const data = await apiFetch('/api/listing/my-listings');
            setListings(data.listings);
        }

        loadMyListings()
    }, [])

    return (
        <div className="listings-grid">
            {listings.map((listing) => (
                    <PrivateListingCard 
                        key={listing.id}
                        listing={listing}
                    /> 
                ))
            }
        </div>
    );
};

export default MyListingsPage;