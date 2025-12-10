import { useEffect, useState, useRef } from "react";
import { 
    getSortedListings, 
} from "@core/lib";
import { useTranslation } from "react-i18next";
import { PublicListingCard } from "@/components";
import { useNavigate } from "react-router-dom";

const CatalogContent = ({ mainListingId, params, setTotalPages}) => {

    const { i18n } = useTranslation();
    const userLocale = i18n.language || "fi";

    const { t } = useTranslation(['common', 'navigation'])
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);

    const lastRequestId = useRef(0);

    useEffect(() => {
        const requestId = ++lastRequestId.current;

        getSortedListings(params)
            .then(data => {
                if (requestId === lastRequestId.current) {
                    setListings(data.listings);
                    setTotalPages(data.totalPages);
                }
            });
    }, [params, setTotalPages, userLocale]);
    
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

            <article onClick={() => navigate("/account/listing/create")} className="listing-card hover-animation-card">
                <div className="center">
                    <h3>{t('catalogSidebar.links.createListing', { ns: 'navigation' })}</h3>
                </div>
            </article>
        </div>
    );
};

export default CatalogContent;