import { useI18n } from "@core/lib/common/contexts/I18nContext";
import { useCatalogFilters } from "@core/lib/common/contexts/CatalogFiltersContext";
import { useEffect, useState, useRef } from "react";
import { IShortListing } from '@core/lib/listing/types'
import { listingService } from '@core/lib/listing/services'
import PlusIcon from "@core/components/common/icons/PlusIcon";
import PublicListingCard from "@/components/ui/listings/cards/PublicListingCard/PublicListingCard";
import cardStyles from "@/components/ui/listings/cards/PublicListingCard/PublicListingCard.module.scss"
import styles from "./CatalogContent.module.scss"
import ListingsGrid from "@/components/ui/listings/ListingsGrid/ListingsGrid";

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
                console.log("Загружено объявлений в каталог", data.listings.length)
                console.log("Всего страниц в каталоге: ", data.totalPages)
            })
            .finally(() => setLoading(false));
    }, [filters, setTotalPages]);

    return (
        <div className={styles.content}>
            <ListingsGrid>
                {!loading && listings?.map((listing) => (
                    <PublicListingCard
                        key={listing.id}
                        listing={listing}
                    />
                ))}
                <article key={0} onClick={() => window.location.href = "/account/listing/create"} className={cardStyles.card}>
                    <div className={`${cardStyles.imageWrapper} ${cardStyles.new}`}>
                        <PlusIcon size={35} />
                        <span className={cardStyles.subtitle}>{dict.navigation.catalogSidebar.links.createListing}</span>
                    </div>
                </article>
            </ListingsGrid>
        </div>
    );
};

export default CatalogContent;