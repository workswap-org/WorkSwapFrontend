import { useState } from "react";
import { IFullListing } from "@core/lib/types/models/listing";
import { useChats } from "@core/lib/contexts/MessengerContext";
import { ChatType } from "@core/lib/constants/chatTypes";
import DialogItem from "@/components/ui/chat/DialogItem";
import ChatWindow from "@/components/ui/chat/ChatWindow/ChatWindow";
import { useI18n } from "@core/lib/contexts/I18nContext";

const ListingMessagesMenu = ({listing}: {listing: IFullListing}) => {

    const { chats } = useChats();
    const { dict } = useI18n();
    const [pageLoading, setPageLoading] = useState<boolean>(true);

    return (
        <div className="listing-messages-menu">
            <div className="dialogs-list">
                {chats?.length === 0 ? (
                    <div className="no-dialogs" id="no-dialogs">
                        <p>{dict.common.messenger.placeholders.noDialogs}</p>
                        <p>{dict.common.messenger.placeholders.startChats}</p>
                    </div>
                ) : chats?.filter(c => c.type === ChatType.LISTING_DISCUSSION && c.targetId === listing.id)
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