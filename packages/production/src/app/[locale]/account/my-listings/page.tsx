"use client"

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { IFullListing } from "@core/lib/types/models/listing";
import { listingService } from "@core/lib/services/listingService";
import PrivateListingCard from "@/components/ui/cards/listing-cards/PrivateListingCard";
import ListingDraftItem from "@/components/ui/cards/listing-cards/ListingDraftItem";
import Tooltip from "@core/components/common/Tooltip"
import { useI18n } from "@core/lib/contexts/I18nContext";

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
    }, [])

    return (
        <>
            <div className="account-header">
                <h2>{dict.common.titles.myListings}</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => redirect("/account/listing/create")}
                >
                    {dict.buttons.listing.addNew}
                </button>
            </div>

            {!loading && (
                <>
                    {listings?.length == 0 && !loading ? (
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
                                        <i className="fa-solid fa-plus fa-xl"></i>
                                    </article>
                                </Tooltip>
                            </div>
                        </>
                    )}
                </>
            )}
            
        </>
    );
};

export default MyListingsPage;