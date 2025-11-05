import { useEffect, useState } from "react";
import { getMyListings } from "@core/lib";
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

    const [listings, setListings] = useState([]);
    const [activeListings, setActiveListings] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        async function loadListings() {
            const data = await getMyListings();
            setLoading(false);
            setListings(data.listings);
            setActiveListings(data.listings.filter(listing => !listing.temporary));
            setDrafts(data.listings.filter(listing => listing.temporary));
        }

        loadListings()
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
                    {listings.length == 0 && !loading ? (
                        <div className="no-listings">
                            <img src="/images/maskot/laying.png"/>
                        </div>
                    ) : (
                        <>
                            <h3>Активые объявления</h3>
                            <div className="listings-grid">
                                {activeListings.map((listing) => (
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
                                {drafts.map((listing) => (
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