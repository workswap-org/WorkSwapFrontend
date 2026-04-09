"use client"

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { IFullListing } from "@core/lib/types/models/listing";
import { listingService } from "@core/lib/services/listing";
import PrivateListingCard from "@/components/ui/cards/listing-cards/PrivateListingCard";
import ListingDraftItem from "@/components/ui/cards/listing-cards/ListingDraftItem";
import Tooltip from "@core/components/common/Tooltip"
import { useI18n } from "@core/lib/contexts/I18nContext";
import Loader from "@core/components/common/Loader"
import PlusIcon from "@core/components/common/icons/PlusIcon";
import accountStyles from "@/app/[locale]/account/AccountLayout.module.scss"

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
            <div className={accountStyles.accountHeader}>
                <h2>{dict.common.titles.myListings}</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => redirect("/account/listing/create")}
                >
                    {dict.buttons.listing.addNew}
                </button>
            </div>

            <Loader loadingActive={loading}>
                <>
                    {listings?.length == 0 ? (
                        <div className="listings-grid">
                            <article onClick={() => redirect("/account/listing/create")} className="listing-card hover-animation-card">
                                <div className="center">
                                    <h3>{dict.navigation.catalogSidebar.links.createListing}</h3>
                                </div>
                            </article>
                        </div>
                    ) : (
                        <>
                            <h3>Активные объявления</h3>
                            <div className="listings-grid">
                                {activeListings?.slice()
                                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                                    .map((listing) => (
                                        <PrivateListingCard
                                            key={listing.id}
                                            listing={listing}
                                        /> 
                                    ))
                                }
                            </div>
                            <br/>
                            <h3>Черновики</h3>
                            <div className="drafts-listings-grid">
                                {drafts?.map((listing) => (
                                    <ListingDraftItem
                                        key={listing.id} 
                                        listing={listing}
                                    />
                                ))}
                                <Tooltip text={dict.buttons.listing.addNew}>
                                    <article 
                                        onClick={() => redirect("/account/listing/create")} 
                                        className="draft-listing-card new"
                                    >
                                        <PlusIcon size={34} />
                                    </article>
                                </Tooltip>
                            </div>
                        </>
                    )}
                </>
            </Loader>
        </>
    );
};

export default MyListingsPage;