import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/services/apiClient";
import PrivateListingCard from "@/components/ui/cards/listing-cards/PrivateListingCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const MyListingsPage = () => {

    const { t } = useTranslation('common')
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    
    useEffect(() => {
        async function loadMyListings() {
            const data = await apiFetch('/api/listing/my-listings');
            setListings(data.listings);
        }

        loadMyListings()
    }, [])

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

            <div className="listings-grid">
                {listings.map((listing) => (
                        <PrivateListingCard 
                            key={listing.id}
                            listing={listing}
                        /> 
                    ))
                }
            </div>
        </>
    );
};

export default MyListingsPage;