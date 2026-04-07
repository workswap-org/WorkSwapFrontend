"use client"

import { useEffect, useMemo, useState } from 'react';
import { useChats } from '@core/lib/contexts/MessengerContext';
import { ChatType } from '@core/lib/constants/chatTypes';
import { listingService } from '@core/lib/services/listing';
import SidebarSectionLayout from '@core/components/layout/SidebarSectionLayout'
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ListingSettingsMenu from './menus/ListingSettingsMenu';
import ListingAnalyticMenu from './menus/ListingAnalyticMenu';
import ListingMessagesMenu from './menus/ListingMessagesMenu';
import { useI18n } from '@core/lib/contexts/I18nContext';
import { useChatSubscription } from '@core/lib/hooks/chat/useChatSubscription';
import { useChatsLoad } from '@core/lib/hooks/chat/useChatsLoad';

const ListingMenu = {
    SETTINGS: {
        first: true,
        name: "Settings",
        icon: "gear"
    },
    ANALYTICS: {
        first: false,
        name: "Analytics",
        icon: "chart-mixed"
    },
    MESSAGES: {
        first: false,
        name: "Messages",
        icon: "message"
    }
} as const;

const ListingManagePage = () => {

    useChatSubscription();
    useChatsLoad();

    const { dict } = useI18n();
    const { id } = useParams();
    const numberId = useMemo<number>(() => Number(id), [id]);
    
    const [listing, setListing] = useState(null);

    const { unreadMessages, chats } = useChats();

    const notifCount = useMemo<number>(() => {
        const matchingChats = chats?.filter(chat => chat.targetId == numberId && chat.type == ChatType.LISTING_DISCUSSION) || [];
        const matchingChatIds = new Set(matchingChats.map(chat => chat.id));

        return unreadMessages?.filter(msg => matchingChatIds.has(msg.chatId)).length || 0;
    }, [chats, numberId, unreadMessages])

    useEffect(() => {
    
        async function loadListing(listingId: number) {
            const data = await listingService.getById(listingId);
            setListing(data);
        }

        if (numberId) {
            loadListing(Number(numberId));
        }
    }, [numberId]);

    return (
        <>
            <div className="account-header">
                <div className='flex-row'>
                    <div className='mobile-actions media-only-flex'>
                        <Link href='/account/my-listings' className='back-link-arrow'>
                            <div><i className={`fa-regular fa-arrow-left fa-lg`}></i></div>
                        </Link>
                    </div>
                    <h2>{dict.common.titles.listingManage}</h2>
                </div>
            </div>

            {listing && (
                <SidebarSectionLayout
                    pageName="listingManage"
                    sections={ListingMenu}
                    notifications={{menu: ListingMenu.MESSAGES, count: notifCount}}
                >
                    {(currentSection) => (
                        currentSection === ListingMenu.SETTINGS ? <ListingSettingsMenu listing={listing} /> :
                        currentSection === ListingMenu.ANALYTICS ? <ListingAnalyticMenu listing={listing} /> :
                        currentSection === ListingMenu.MESSAGES ? <ListingMessagesMenu listing={listing} /> :
                        null
                    )}
                </SidebarSectionLayout>
            )}
        </>
    );
};

export default ListingManagePage;