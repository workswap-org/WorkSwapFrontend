import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getListingsByUserId, getUserById } from "@core/lib";
import {
    PublicListingCard,
    UserInfoSidebar,
    ReviewsSection
} from "@/components";
import { useTranslation } from 'react-i18next';
import NotFoundPage from "@core/pages/NotFoundPage";

const ProfilePage = () => {

    const { t } = useTranslation(['common']);

    const { userId } = useParams();

    const [user, setUser] = useState([]);
    const [listings, setListings] = useState([])

    useEffect(()=> {
        getListingsByUserId(userId).then(data => setListings(data));
        getUserById(userId).then(data => setUser(data)).catch(setUser(undefined));
    }, [userId]);

    return (
        <>
            {(user && user.status != 'TEMP') ? (
                <div className="listing-container">
                    <div className="listing-layout">
                        <main className="listing-main">

                            <h2>{t(`profile.listings`, { ns: 'common' })}</h2>
                            <div className="listing-main-content">
                                <div className="listing-content">
                                    <div className="listings-grid">
                                        {listings
                                            .slice()
                                            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                                            .map((listing) => (
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

                            <ReviewsSection listingId='' profileId={userId} />
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