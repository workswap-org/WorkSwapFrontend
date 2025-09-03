import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import PublicListingCard from "@/components/cards/listing-cards/PublicListingCard";

const CatalogContent = ({ mainListingId, params}) => {

    const [listings, setListings] = useState([]);
    
    useEffect(() => {
        async function loadSortedListings(params) {
            try {
                const data = await apiFetch(`/api/listing/catalog`, {}, params);
                setListings(data.listings);
            } catch (err) {
                console.error(err);
            }
        }

        loadSortedListings(params)
    }, [params])
    if (listings.length == 0) {
        return (
            <div className="no-listings">
                <p th:text="#{no-listings}">Объявлений не найдено.</p>
            </div>
        )
    }
    return (
        <div className="listings-grid">
            {listings.map((listing) => (
                    <PublicListingCard 
                        key={listing.id}
                        listing={listing}
                        isMainListing={listing.id == mainListingId ? true : false}
                    />
                ))
            }
        </div>
    );
};

export default CatalogContent;