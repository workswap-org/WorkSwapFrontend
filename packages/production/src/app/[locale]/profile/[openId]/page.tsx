"use client"

import { useEffect, useState } from 'react';
import NotFoundPage from "@core/pages/NotFoundPage";
import { useParams } from 'next/navigation';
import { IShortListing } from '@core/lib/types/models/listing';
import { IShortUserProfile } from '@core/lib/types/models/user';
import { userService } from '@core/lib/services/user';
import PublicListingCard from '@/components/ui/listings/cards/PublicListingCard/PublicListingCard';
import UserInfoSidebar from '@/components/pages/listing/UserInfoSidebar/UserInfoSidebar';
import ReviewsSection from '@/components/ui/reviews/ReviewsSection';
import { useI18n } from '@core/lib/contexts/I18nContext';
import ListingsGrid from '@/components/ui/listings/ListingsGrid/ListingsGrid';
import ItemViewLayout from '@/components/layout/ItemViewLayout/ItemViewLayout';

const ProfilePage = () => {

    const { dict } = useI18n();

    const { openId } = useParams();
    const [listings, setListings] = useState<IShortListing[] | null>(null);
    const [user, setUser] = useState<IShortUserProfile | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(()=> {
        if (!openId) return;

        async function loadUserProfile(openId: string) {
            try {
                const data = await userService.getUserProfile(openId)
                setUser(data)
                /* setListings(data.listings) */
            } catch {
                console.log("ошибка загрузки")
                setError(true)
            }
        }

        loadUserProfile(String(openId))
    }, [openId]);

    if (error) return <NotFoundPage/>;

    return (
        <ItemViewLayout
            content={(
                <>
                    <h2>{dict.common.profile.listings}</h2>
                    <ListingsGrid>
                        {listings?.slice()
                            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                            .map((listing) => (
                                <PublicListingCard
                                    key={listing.id}
                                    listing={listing}
                                /> 
                            ))
                        }
                    </ListingsGrid>
                </>
            )}

            sidebarNode={(
                (user?.bio) && (
                    <div className="contact-card">
                        <h3>{dict.common.labels.description}</h3>
                        <p className="listing-description">{user.bio}</p>
                    </div>
                )
            )}

            author={user ?? undefined}
        />
    );
};

export default ProfilePage;