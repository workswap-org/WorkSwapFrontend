"use client"

import { useEffect, useState } from "react";
import NotFoundPage from "@core/pages/NotFoundPage";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { IEventPageRequest } from "@core/lib/types/models/listing";
import { IShortUser, IShortUserProfile } from "@core/lib/types/models/user";
import { useChats } from "@core/lib/contexts/MessengerContext";
import { eventService } from "@core/lib/services/eventService";
import { subscriptionService } from "@core/lib/services/subscriptionService";
import ListingPageLayout from "../../../../../components/ui/listing/ListingPageLayout/ListingPageLayout";
import PriceTypes from "@core/components/common/PriceTypes";
import RatingStars from "@core/components/common/RatingStars";
import FormattedDate from "@core/components/common/date/FormattedDate"
import Avatar from "@core/components/common/Avatar";
import ChatWindow from "@/components/ui/chat/ChatWindow/ChatWindow";
import layoutStyles from "@/components/ui/listing/ListingPageLayout/ListingPageLayout.module.scss"
import listingPageStyles from "../ListingPage.module.scss"
import styles from "./EventPage.module.scss"

const EventPage = () => {

    const { id } = useParams();
    const eventId = Number(id);
    const searchParams = useSearchParams();
    const token: string | null = searchParams.get("token");
    const { dict } = useI18n();

    const {user} = useAuth();

    const [listingPage, setListingPage] = useState<IEventPageRequest | null>(null);
    const [author, setAuthor] = useState<IShortUserProfile | null>(null);
    const isOwner = !!(user?.openId == author?.openId);
    const [subscribed, setSubscribed] = useState<boolean>(false);
    const [participantsCount, setParticipantsCount] = useState<number>(0)
    const [participants, setParticipants] = useState<IShortUser[] | null>(null)
    const [isParticipant, setParticipant] = useState<boolean>(false);
    const { currentChatId, setCurrentChatId } = useChats();
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setCurrentChatId(null)

        async function loadEventPage() {
            if (!eventId) return
            const listing: IEventPageRequest = await eventService.getEventPage(eventId, token)
            if (!listing) setError(true);
            setListingPage(listing)
            setParticipantsCount(listing.participantsCount || 0);
            setParticipants(listing.participants)
            setCurrentChatId(listing.chat?.id || null)
            setAuthor(listing.author)
        }

        loadEventPage();

        subscriptionService.check(eventId, 'EVENT').then(setSubscribed)
        eventService.checkEventParticipant(eventId).then(setParticipant)

    }, [eventId, setCurrentChatId, token]);

    useEffect(() => {
        if (!currentChatId && listingPage?.chat?.id) setCurrentChatId(listingPage.chat.id)
    }, [currentChatId, listingPage, setCurrentChatId])

    const toggleParticipation = async () => {
        setParticipant(!isParticipant); // мгновенный отклик
        if (isParticipant) {
            eventService.removeEventParticipant(eventId)
                .then(() => setParticipantsCount(prev => prev - 1))
                .catch(() => {
                    setParticipant(true);
                    setParticipantsCount(prev => prev);
                })
        } else {
            eventService.addEventParticipant(eventId)
                .then(() => setParticipantsCount(prev => prev + 1))
                .catch(() => {
                    setParticipant(false);
                    setParticipantsCount(prev => prev);
                })
        }
    }

    if (error) return <NotFoundPage/>;
    
    return listingPage && (
        <ListingPageLayout
            listingPage={listingPage}
            author={author}
            listingActions={!isOwner && (
                <div 
                    className={`${layoutStyles.action} hover`}
                    onClick={() => 
                        subscriptionService.toggle(eventId, setSubscribed, subscribed, 'EVENT', null)
                    }
                >
                    {subscribed ? (
                        <span>Отписаться</span>
                    ) : (
                        <span>Подписаться</span>
                    )}
                </div>
            )}
            details={(
                <>
                    <div className={listingPageStyles.detail}>
                        <span className={listingPageStyles.label}>{dict.common.labels.event.price}:</span>
                        <PriceTypes listing={listingPage} />
                    </div>
                    <div className={listingPageStyles.detail}>
                        <span className={listingPageStyles.label}>{dict.common.labels.event.date}:</span>
                        <span className={listingPageStyles.value}>
                            <FormattedDate isoDate={listingPage?.event.eventDate || ""} format="DMHM"/>
                        </span>
                    </div>
                    <div className={listingPageStyles.detail}>
                        <span className={listingPageStyles.label}>{dict.common.labels.location}:</span>
                        <span className={listingPageStyles.value}>
                            {listingPage?.listing.location || ""}
                        </span>
                    </div>
                    <div className={listingPageStyles.detail}>
                        <span className={listingPageStyles.label}>{dict.common.labels.rating}:</span>
                        <RatingStars rating={listingPage?.listing.rating ?? 0}/>
                    </div>
                </>
            )}
            extraSidebarElements={(
                <>
                    {participants && (
                        <div className={`${layoutStyles.details} fade-down`}>
                            <h3>{dict.common.labels.event.participants}</h3>
                            <div className={styles.participants}>
                                {participants.map((participant) => (
                                    <div 
                                        key={participant.name}
                                        className={styles.participant}
                                    >
                                        <Avatar 
                                            user={participant}
                                            className='seller-avatar'
                                            size={50}
                                            link={false}
                                        />
                                        <span>{participant.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    

                    <div className={`${layoutStyles.details} fade-down`}>
                        <div className={listingPageStyles.detail}>
                            <span className={listingPageStyles.label}>{dict.common.labels.event.participants}:</span>
                            <span className={listingPageStyles.value}>{participantsCount}{listingPage.event?.maxParticipants ? " / " + listingPage.event.maxParticipants : ""}</span>
                        </div>
                        <div 
                            className="btn btn-primary"
                            onClick={toggleParticipation}
                        >
                            {!isParticipant ? (
                                <span>{dict.buttons.event.participation.join}</span>
                            ) : (
                                <span>{dict.buttonsevent.participation.leave}</span>
                            )}
                        </div>
                    </div>
                </>
            )}
            extraPageElements={
                <div className={`${layoutStyles.info} fade-down`}>
                    <div className={styles.chat}>
                        <ChatWindow title={listingPage.listing.localizedTitle} />
                    </div>
                </div>
            }
        />
    );
};

export default EventPage;