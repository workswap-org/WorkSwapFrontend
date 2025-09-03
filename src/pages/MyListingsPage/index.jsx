import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import PrivateListingCard from "@/components/cards/listing-cards/PrivateListingCard";
import { Link } from "react-router-dom";

const MyListingsPage = () => {

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
                <h2 th:text="#{my.listings}">Мои объявления</h2>
                <Link to="/secure/listing/create" className="btn btn-primary">Добавить новое</Link>
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