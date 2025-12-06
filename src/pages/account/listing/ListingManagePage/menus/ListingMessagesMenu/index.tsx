import { useTranslation } from "react-i18next";
import { ChatType, FullListingType, useChats } from "@core/lib";
import { useEffect, useState } from "react";
import { ChatWindow, DialogItem } from "@/components";

const ListingMessagesMenu = ({listing}: {listing: FullListingType}) => {

    const { chats } = useChats();
    const { t } = useTranslation('common');
    const [pageLoading, setPageLoading] = useState<boolean>(true);

    return (
        <div className="listing-messages-menu">
            <div className="dialogs-list">
                {chats?.length === 0 ? (
                    <div className="no-dialogs" id="no-dialogs">
                        <p>{t(`messenger.placeholders.noDialogs`, { ns: 'common' })}</p>
                        <p>{t(`messenger.placeholders.startChats`, { ns: 'common' })}</p>
                    </div>
                ) : chats
                        .filter(c => c.type === ChatType.LISTING_DISCUSSION && c.targetId === listing.id)
                        .slice()
                        .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
                        .map(chat => (
                            <DialogItem
                                key={chat.id}
                                chat={chat}
                                setPageLoading={setPageLoading}
                                pageLoading={pageLoading}
                            />
                        ))
                }
            </div>
            
            <ChatWindow/>
        </div>
    );
}

export default ListingMessagesMenu;