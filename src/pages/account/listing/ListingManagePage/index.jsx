import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatType, getListingById, useChats } from "@core/lib";
import { Link, useParams } from "react-router-dom";
import ListingSettingsMenu from './menus/ListingSettingsMenu/index.tsx';
import ListingAnalyticMenu from './menus/ListingAnalyticMenu';
import ListingMessagesMenu from './menus/ListingMessagesMenu';
import { SidebarSectionLayout } from '@core/components';

export const ListingMenu = Object.freeze({
    SETTINGS: { first: true, name: "SETTINGS", icon: "gear" },
    ANALYTICS: { first: false, name: "ANALYTICS", icon: "chart-mixed" },
    MESSAGES: { first: false, name: "MESSAGES", icon: "message-lines" }
});
const ListingManagePage = () => {

    const { t } = useTranslation('common');
    const { id } = useParams();
    
    const [listing, setListing] = useState(null);

    const { unreadMessages, chats } = useChats();

    const notifCount = useMemo(() => {
        const matchingChats = chats.filter(chat => chat.targetId == id && chat.type == ChatType.LISTING_DISCUSSION);
        const matchingChatIds = new Set(matchingChats.map(chat => chat.id));

        return unreadMessages.filter(msg => matchingChatIds.has(msg.chatId)).length;
    }, [chats, id, unreadMessages])

    useEffect(() => {
    
        async function loadListing() {
            const data = await getListingById(id);
            setListing(data);
        }

        loadListing();
    }, [id]);

    return (
        <>
            <div className="account-header">
                <div className='flex-row'>
                    <div className='mobile-actions media-only-flex'>
                        <Link to='/account/my-listings' className='back-link-arrow'>
                            <div><i className={`fa-regular fa-arrow-left fa-lg`}></i></div>
                        </Link>
                    </div>
                    <h2>{t(`titles.listingManage`, { ns: 'common' })}</h2>
                </div>
            </div>

            {listing && (
                <SidebarSectionLayout
                    pageName={'listingManage'}
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