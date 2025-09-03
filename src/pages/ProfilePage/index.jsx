import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { apiFetch } from "@/lib/apiClient";
import PublicListingCard from "@/components/cards/listing-cards/PublicListingCard";
import UserInfoSidebar from "@/components/page-components/UserInfoSidebar"
import ReviewsSection from "@/components/reviews/ReviewsSection";

const ProfilePage = () => {

    const { id } = useParams();

    const [user, setUser] = useState([]);
    const [listings, setListings] = useState([])

    useEffect(()=> {
        async function loadProfile() {
            const data = await apiFetch(`/api/user/get/${id}`)
            setUser(await data.user)
        }

        async function loadListings() {
            const data = await apiFetch(`/api/listing/by-user/${id}`);
            setListings(data.listings);
        }

        loadProfile();
        loadListings();
    }, [id]);

    return (
        <div className="listing-container">
            <div className="listing-layout">
                <main className="listing-main">

                    <div className="listing-header">
                        <h1>Название объявления</h1>
                        <div className="listing-meta">
                            <span className="listing-date">{user.createdAt}</span>
                        </div>
                    </div>

                    <div className="listing-main-content">
                        <div className="listing-details">
                            <h2 th:text="#{listing.description}">Описание</h2>
                            <p className="listing-description" th:text="${profileUser.bio ?: ''}"></p>

                            <div className="listings-grid">
                                {listings.map((listing) => (
                                        <PublicListingCard 
                                            key={listing.id}
                                            listing={listing}
                                        /> 
                                    ))
                                }
                            </div>
                        </div>

                        <UserInfoSidebar listingId='' author={user}/>
                    </div>

                    <ReviewsSection listingId='' profileId={id} />
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;