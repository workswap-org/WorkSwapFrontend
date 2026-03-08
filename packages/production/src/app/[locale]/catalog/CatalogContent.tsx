import { useI18n } from "@core/lib/contexts/I18nContext";
import { useCatalogFilters } from "@core/lib/contexts/local/CatalogFiltersContext";
import { useEffect, useState, useRef } from "react";
import { IShortListing } from '@core/lib/types/models/listing'
import { listingService } from '@core/lib/services/listingService'
import { DelayedList } from '@core/components/common/animations/DelayedList'
import PublicListingCard from "@/components/ui/cards/listing-cards/PublicListingCard";

const CatalogContent = () => {

    const { filters, setTotalPages } = useCatalogFilters();

    const { dict } = useI18n();

    const [listings, setListings] = useState<IShortListing[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const lastRequestId = useRef<number>(0);

    useEffect(() => {
        const requestId = ++lastRequestId.current;

        setLoading(true);
        listingService.getCatalog(filters)
            .then(data => {
                if (requestId === lastRequestId.current) {
                    setListings(data.listings);
                    setTotalPages(data.totalPages);
                }
                console.log(data.listings.length)
                console.log(data.totalPages)
            })
            .finally(() => setLoading(false));
    }, [filters, setTotalPages]);

    return (
        <div className="catalog-content">
            <div className="listings-grid">
                {!loading && 
                    <DelayedList 
                        items={[
                            ...(listings?.map((listing) => (
                                <PublicListingCard
                                    key={listing.id}
                                    listing={listing}
                                />
                            )) ?? []),
                        <article key={0} onClick={() => window.location.href = "/account/listing/create"} className="public-listing-card">
                            <div className="image-wrapper new">
                                <i className="fa-solid fa-plus fa-2xl"></i>
                            </div>
                            <div className="listing-card_body">
                                <h3 className="listing-card_title">{dict.navigation.catalogSidebar.links.createListing}</h3>
                            </div>
                        </article>
                    ]}/>
                }
            </div>
        </div>
    );
};

export default CatalogContent;