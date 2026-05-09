import { IFullListing } from "@core/lib/types/models/listing";
import { ChatType } from "@core/lib/constants/chatTypes";
import styles from "./ListingMessagesMenu.module.scss"
import ChatsPage from "@/components/ui/chat/ChatsPage/ChatsPage";
import { useChats } from "@core/lib/contexts/MessengerContext";
import { useEffect } from "react";

const ListingMessagesMenu = ({listing}: {listing: IFullListing}) => {

    const { setCurrentChatId } = useChats();

    useEffect(() => {
        setCurrentChatId(null);
    }, [])

    return (
        <div className={styles.layout}>
            <ChatsPage type={ChatType.LISTING_DISCUSSION} targetId={listing.id} />
        </div>
    );
}

export default ListingMessagesMenu;