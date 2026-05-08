"use client"

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { IFullListing } from "@core/lib/types/models/listing";
import { listingService } from "@core/lib/services/listing";
import PrivateListingCard from "@/components/ui/listings/cards/PrivateListingCard/PrivateListingCard";
import ListingDraftItem from "@/components/ui/listings/cards/DraftListingCard/DraftListingCard";
import Tooltip from "@core/components/common/Tooltip/Tooltip"
import { useI18n } from "@core/lib/contexts/I18nContext";
import Loader from "@core/components/common/Loader/Loader"
import PlusIcon from "@core/components/common/icons/PlusIcon";
import draftStyles from "@/components/ui/listings/cards/DraftListingCard/DraftListingCard.module.scss"
import privateStyles from "@/components/ui/listings/cards/PrivateListingCard/PrivateListingCard.module.scss"
import AccountHeader from "@/components/pages/account/AccountHeader/AccountHeader";
import styles from "./MyListingsPage.module.scss"
import AccountListingsGrid from "@/components/pages/account/AccountListingsGrid/AccountListingsGrid";

const MyListingsPage = () => {

    const { dict } = useI18n();

    const [listings, setListings] = useState<IFullListing[] | null>(null);
    const [activeListings, setActiveListings] = useState<IFullListing[] | null>(null);
    const [drafts, setDrafts] = useState<IFullListing[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        listingService.getMyListings().then((data: IFullListing[]) => {
            setLoading(false);
            setListings(data);
            setActiveListings(data.filter(listing => !listing.temporary));
            setDrafts(data.filter(listing => listing.temporary));
        })
    }, []);

    return (
        <>
            <AccountHeader>
                <h2>{dict.common.titles.myListings}</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => redirect("/account/listing/create")}
                >
                    {dict.buttons.listing.addNew}
                </button>
            </AccountHeader>

            <Loader loadingActive={loading}>
                {listings?.length == 0 ? (
                    <AccountListingsGrid>
                        <article 
                            onClick={() => redirect("/account/listing/create")} 
                            className={`${privateStyles.card} ${privateStyles.center} hover-animation-card`}
                        >
                            <h3>{dict.navigation.catalogSidebar.links.createListing}</h3>
                        </article>
                    </AccountListingsGrid>
                ) : (
                    <div className={styles.content}>
                        <section>
                            <h3 className={styles.gridLabel}>Активные объявления</h3>
                            <AccountListingsGrid>
                                {activeListings?.slice()
                                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                                    .map((listing) => (
                                        <PrivateListingCard
                                            key={listing.id}
                                            listing={listing}
                                        /> 
                                    ))
                                }
                            </AccountListingsGrid>
                        </section>
                        <section>
                            <h3 className={styles.gridLabel}>Черновики</h3>
                            <div className={styles.draftsGrid}>
                                {drafts?.map((listing) => (
                                    <ListingDraftItem
                                        key={listing.id} 
                                        listing={listing}
                                    />
                                ))}
                                <Tooltip text={dict.buttons.listing.addNew}>
                                    <article 
                                        onClick={() => redirect("/account/listing/create")} 
                                        className={`${draftStyles.card} ${draftStyles.new}`}
                                    >
                                        <PlusIcon size={34} />
                                    </article>
                                </Tooltip>
                            </div>
                        </section>
                    </div>
                )}
            </Loader>
        </>
    );
};

export default MyListingsPage;