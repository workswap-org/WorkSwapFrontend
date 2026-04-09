import { useI18n } from "@core/lib/contexts/I18nContext";
import { useCatalogFilters } from "@core/lib/contexts/local/CatalogFiltersContext";
import { useEffect, useState, useRef } from "react";
import { IShortListing } from '@core/lib/types/models/listing'
import { listingService } from '@core/lib/services/listing'
import PlusIcon from "@core/components/common/icons/PlusIcon";
import PublicListingCard from "@/components/ui/cards/PublicListingCard/PublicListingCard";
import cardStyles from "@/components/ui/cards/PublicListingCard/PublicListingCard.module.scss"
import styles from "./CatalogContent.module.scss"

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
        <div className={styles.content}>
            <div className="listings-grid">
                {!loading && listings?.map((listing) => (
                    <PublicListingCard
                        key={listing.id}
                        listing={listing}
                    />
                ))}
                <article key={0} onClick={() => window.location.href = "/account/listing/create"} className={cardStyles.card}>
                    <div className={`${cardStyles.imageWrapper} new`}>
                        <PlusIcon size={35} />
                    </div>
                    <div className={cardStyles.body}>
                        <h3 className={cardStyles.title}>
                            {dict.navigation.catalogSidebar.links.createListing}
                        </h3>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default CatalogContent;