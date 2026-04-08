"use client"

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotFoundPage from "@core/pages/NotFoundPage";
import { useParams } from 'next/navigation';
import { IShortListing } from '@core/lib/types/models/listing';
import { IShortUserProfile } from '@core/lib/types/models/user';
import { userService } from '@core/lib/services/user';
import PublicListingCard from '@/components/ui/cards/PublicListingCard/PublicListingCard';
import UserInfoSidebar from '@/components/layout/sidebar/UserInfoSidebar';
import ReviewsSection from '@/components/ui/reviews/ReviewsSection';
import { useI18n } from '@core/lib/contexts/I18nContext';

const ProfilePage = () => {

    const { dict } = useI18n();

    const { openId } = useParams();
    const [listings, setListings] = useState<IShortListing[] | null>(null);
    const [user, setUser] = useState<IShortUserProfile | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(()=> {
        if (!openId) return;
        userService.getUserProfile(String(openId))
            .then(data => {
                setUser(data.user)
                setListings(data.listings)
            })
            .catch(() => setError(true));
    }, [openId]);

    if (error) return <NotFoundPage/>;

    return (
        <main className="listing-main">

            <h2>{dict.common.profile.listings}</h2>
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
                            <h3>{dict.common.labels.description}</h3>
                            <p className="listing-description">{user.bio}</p>
                        </div>
                    )}
                </div>
            </div>

            <ReviewsSection listingId={null} profileId={user?.id || null} />
        </main>
    );
};

export default ProfilePage;