"use client"

import { redirect } from 'next/navigation';
import { useMemo } from "react";
import PriceTypes from '@core/components/common/PriceTypes';
import Link from 'next/link';
import { useChats } from '@core/lib/contexts/MessengerContext';
import { IFullListing } from '@core/lib/types/models/listing';
import { ChatType } from '@core/lib/constants/chatTypes';
import { useI18n } from '@core/lib/contexts/I18nContext';
import styles from "./PrivateListingCard.module.scss"
import GearIcon from "@core/components/common/icons/GearIcon"
import UnreadNotifications from '@core/components/ui/notifications/UnreadNotifications/UnreadNotifications';

const PrivateListingCard  = ({listing}: {listing: IFullListing}) => {

    const { dict } = useI18n()
    const { unreadMessages, chats } = useChats();

    const notifCount = useMemo(() => {
        const matchingChats = chats?.filter(chat => chat.targetId == listing.id && chat.type == ChatType.LISTING_DISCUSSION) ?? [];
        const matchingChatIds = new Set(matchingChats?.map(chat => chat.id));

        return unreadMessages?.filter(msg => matchingChatIds.has(msg.chatId)).length || 0;
    }, [chats, listing.id, unreadMessages])

    if (listing.temporary) return null;

    const navigator = () => {
        if (listing.type == "EVENT") {
            redirect(`/listing/${listing.id}/event`)
        } else {
            redirect(`/listing/${listing.id}`)
        }
    }

    return (
        <article className={`${styles.card} hover-animation-card`} onClick={() => navigator()}>
            <img 
                src={listing.imagePath || `/images/default-listing.svg`}
                onError={(e) => { e.currentTarget.src = `/images/default-listing.svg`; }}
            />

            <div className={styles.body}>
                <h3 className={styles.title}>{listing.localizedTitle}</h3>
                <div className={styles.footer}>
                    <PriceTypes listing={listing} />
                    <div className={styles.views}>
                        <span>{dict.common.labels.views}: </span>
                        <span>{listing.views}</span>
                    </div>
                </div>
                <Link
                    className="btn btn-primary"
                    href={`/account/listing/${listing.id}/manage`}
                    onClick={(e) => e.stopPropagation()}
                    id="notificationAnchor"
                >
                    <GearIcon />
                    {dict.buttons.listing.manage}
                    {notifCount > 0 &&
                        <UnreadNotifications count={notifCount}/>
                    }
                </Link>
            </div>
        </article>
    );
};

export default PrivateListingCard;