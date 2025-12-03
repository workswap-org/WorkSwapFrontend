import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getUserProfile } from "@core/lib";
import {
    PublicListingCard,
    UserInfoSidebar,
    ReviewsSection
} from "@/components";
import { useTranslation } from 'react-i18next';
import NotFoundPage from "@core/pages/NotFoundPage";

const ProfilePage = () => {

    const { t } = useTranslation(['common']);

    const { userOpenId } = useParams();
    const [user, setUser] = useState({listings: []});

    useEffect(()=> {
        getUserProfile(userOpenId).then(data => setUser(data)).catch(() => setUser(undefined));
    }, [userOpenId]);

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
                                        {user.listings
                                            .slice()
                                            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
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

                            <ReviewsSection listingId='' profileId={user.id} />
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