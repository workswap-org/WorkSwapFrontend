import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { apiFetch } from "@/lib/apiClient";
import PublicListingCard from "@/components/cards/listing-cards/PublicListingCard";
import UserInfoSidebar from "@/components/page-components/UserInfoSidebar"
import ReviewsSection from "@/components/reviews/ReviewsSection";
import { useTranslation } from 'react-i18next';
import NotFoundPage from "@/pages/NotFoundPage";

const ProfilePage = () => {

    const { t } = useTranslation(['common']);

    const { id } = useParams();

    const [user, setUser] = useState([]);
    const [listings, setListings] = useState([])

    useEffect(()=> {
        async function loadProfile() {
            try {
                const data = await apiFetch(`/api/user/get/${id}`);
                const tempUser = data.user;
                if (tempUser) {
                    setUser(tempUser);
                } else {
                    setUser(undefined);
                }
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
                setUser(undefined); // при 500 выставляем undefined
            }
        }

        async function loadListings() {
            const data = await apiFetch(`/api/listing/by-user/${id}`);
            setListings(data.listings);
        }

        loadProfile();
        loadListings();
    }, [id]);

    return (
        <>
            {user ? (
                <div className="listing-container">
                    <div className="listing-layout">
                        <main className="listing-main">

                            <h2>{t(`profile.listings`, { ns: 'common' })}</h2>
                            <div className="listing-main-content">
                                <div className="listing-content">
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
            ) : (
                <NotFoundPage/>
            )}
        </>
    );
};

export default ProfilePage;