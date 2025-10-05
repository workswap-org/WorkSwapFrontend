import { useEffect, useState, useRef } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useTranslation } from "react-i18next";
import PublicListingCard from "@/components/cards/listing-cards/PublicListingCard";

const CatalogContent = ({ mainListingId, params}) => {

    const { i18n } = useTranslation();
    const userLocale = i18n.language || "fi";

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true)

    const lastRequestId = useRef(0);

    useEffect(() => {
        const requestId = ++lastRequestId.current;
        setLoading(true)

        async function loadSortedListings(params) {
            try {
                const data = await apiFetch(`/api/listing/catalog`, {}, params);

                if (requestId === lastRequestId.current) {
                    setListings(data.listings);
                    setLoading(false)
                }
            } catch (err) {
                console.error(err);
            }
        }

        loadSortedListings(params);
    }, [params, userLocale]);

    if (listings.length == 0 && !loading) {
        return (
            <div className="no-listings">
                <p>Объявлений не найдено</p>
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