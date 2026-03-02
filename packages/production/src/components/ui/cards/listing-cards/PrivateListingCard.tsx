"use client"

import { redirect } from 'next/navigation';
import { useMemo } from "react";
import PriceTypes from '@core/components/common/PriceTypes';
import Link from 'next/link';
import { useChats } from '@core/lib/contexts/MessengerContext';
import { IFullListing } from '@core/lib/types/models/listing';
import { ChatType } from '@core/lib/constants/chatTypes';
import { useI18n } from '@core/lib/contexts/I18nContext';

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
            redirect(`/event/${listing.id}`)
        } else {
            redirect(`/listing/${listing.id}`)
        }
    }

    return (
        <article className="listing-card hover-animation-card" onClick={() => navigator()}>
            <img 
                src={listing.imagePath || `/images/default-listing.svg`}
                onError={(e) => { e.currentTarget.src = `/images/default-listing.svg`; }}
                /* alt="Изображение объявления" */
            />

            <div className="listing-card_body">
                <h3 className="listing-card_title">{listing.localizedTitle}</h3>
                <div className="listing-card_footer">
                    <div>
                        <PriceTypes listing={listing} />
                        <div className="listing-card_views">
                            <span>{dict.common.labels.views}: </span>
                            <span>{listing.views}</span>
                        </div>
                    </div>
                </div>
                <Link
                    className="btn btn-primary"
                    href={`/account/listing/edit/${listing.id}`}
                    onClick={(e) => e.stopPropagation()}
                    id="notificationAnchor"
                >
                    <div><i className="fa-solid fa-gear fa-lg"></i></div>
                    {dict.buttons.listing.manage}
                    {notifCount > 0 &&
                        <span id="unreadNotifications" className="unread-notifications-count">
                            {notifCount}
                        </span>
                    }
                </Link>
            </div>
        </article>
    );
};

export default PrivateListingCard;