import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getUserProfile, IShortListing, IShortUserProfile, IUserProfile } from "@core/lib";
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
    const [listings, setListings] = useState<IShortListing[] | null>(null);
    const [user, setUser] = useState<IShortUserProfile | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(()=> {
        getUserProfile(userOpenId)
            .then(data => {
                setUser(data.user)
                setListings(data.listings)
            })
            .catch(() => setError(true));
    }, [userOpenId]);

    if (error) return <NotFoundPage/>;

    return (
        <main className="listing-main">

            <h2>{t(`profile.listings`, { ns: 'common' })}</h2>
            <div className="listing-main-content">
                <div className="listing-content">
                    <div className="listings-grid">
                        {listings?.slice()
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

                <div className="listing-sidebar">

                    <UserInfoSidebar listingId={null} author={user}/>

                    {(user?.bio) && (
                        <div className="contact-card">
                            <h3>{t(`labels.description`, { ns: 'common' })}</h3>
                            <p className="listing-description">{user.bio}</p>
                        </div>
                    )}
                </div>
            </div>

            <ReviewsSection listingId='' profileId={user?.id} />
        </main>
    );
};

export default ProfilePage;