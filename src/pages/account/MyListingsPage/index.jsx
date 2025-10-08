import { useEffect, useState } from "react";
import { getMyListings } from "@core/lib";
import { PrivateListingCard } from "@/components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const MyListingsPage = () => {

    const { t } = useTranslation('common')
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    
    useEffect(() => {
        async function loadMyListings() {
            const data = await getMyListings();
            setListings(data.listings);
        }

        loadMyListings()
    }, [listings.length])

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.myListings`, { ns: 'common' })}</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/secure/listing/create")}
                >
                    {t(`listing.addNew`, { ns: 'buttons' })}
                </button>
            </div>

            {listings.filter(listing => !listing.temporary).length == 0 ? (
                <div className="no-listings">
                    <img src="/images/maskot/laying.png"/>
                </div>
            ) : (
                <div className="listings-grid">
                    {listings.map((listing) => (
                            <PrivateListingCard 
                                key={listing.id}
                                listing={listing}
                            /> 
                        ))
                    }
                </div>
            )}
        </>
    );
};

export default MyListingsPage;