import { useEffect, useState } from "react";
import { getMyListings, IFullListing } from "@core/lib";
import { 
    PrivateListingCard,
    ListingDraftItem
} from "@/components";
import { Tooltip } from "@core/components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const MyListingsPage = () => {

    const { t } = useTranslation('common')
    const navigate = useNavigate();

    const [listings, setListings] = useState<IFullListing[] | null>(null);
    const [activeListings, setActiveListings] = useState<IFullListing[] | null>(null);
    const [drafts, setDrafts] = useState<IFullListing[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        getMyListings().then((data: IFullListing[]) => {
            setLoading(false);
            setListings(data);
            setActiveListings(data.filter(listing => !listing.temporary));
            setDrafts(data.filter(listing => listing.temporary));
        })
    }, [])

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.myListings`, { ns: 'common' })}</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/account/listing/create")}
                >
                    {t(`listing.addNew`, { ns: 'buttons' })}
                </button>
            </div>

            {!loading && (
                <>
                    {listings?.length == 0 && !loading ? (
                        <div className="listings-grid">
                            <article onClick={() => navigate("/account/listing/create")} className="listing-card hover-animation-card">
                                <div className="center">
                                    <h3>{t('catalogSidebar.links.createListing', { ns: 'navigation' })}</h3>
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
                                <Tooltip text={t(`listing.addNew`, { ns: 'buttons' })}>
                                    <article 
                                        onClick={() => navigate("/account/listing/create")} 
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