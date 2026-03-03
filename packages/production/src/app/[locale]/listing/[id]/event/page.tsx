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
import ListingPageLayout from "../ListingPageLayout";
import PriceTypes from "@core/components/common/PriceTypes";
import RatingStars from "@core/components/common/RatingStars";
import FormattedDate from "@core/components/common/date/FormattedDate"
import Avatar from "@core/components/common/Avatar";
import ChatWindow from "@/components/ui/chat/ChatWindow";

const EventPage = () => {

    const { id } = useParams();
    const eventId = Number(id);
    const searchParams = useSearchParams();
    const token: string | null = searchParams.get("token");
    const { dict } = useI18n();

    const {user} = useAuth();

    const [event, setEvent] = useState<IEventPageRequest | null>(null);
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
            const event = await eventService.getEventPage(eventId, token)
            if (!event) setError(true);
            setEvent(event)
            setParticipantsCount(event.participantsCount);
            setParticipants(event.participants)
            setCurrentChatId(event.chat.id)
            setAuthor(event.author)
        }

        loadEventPage();

        subscriptionService.check(eventId, 'EVENT').then(setSubscribed)
        eventService.checkEventParticipant(eventId).then(setParticipant)

    }, [eventId, setCurrentChatId, token]);

    useEffect(() => {
        if (!currentChatId && event?.chat?.id) setCurrentChatId(event.chat.id)
    }, [currentChatId, event, setCurrentChatId])

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
    
    return event && (
        <ListingPageLayout
            listing={event}
            author={author}
            listingActions={!isOwner && (
                <div 
                    className="listing-action-item hover"
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
                    <div className="detail-item">
                        <span className="detail-label">{dict.common.labels.event.price}:</span>
                        <PriceTypes listing={event} />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{dict.common.labels.event.date}:</span>
                        <span className="detail-value">
                            <FormattedDate isoDate={event?.eventDate || ""} format="DMHM"/>
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{dict.common.labels.location}:</span>
                        <span className="detail-value">
                            {event?.location || ""}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{dict.common.labels.rating}:</span>
                        <RatingStars rating={event?.rating ?? 0}/>
                    </div>
                </>
            )}
            extraSidebarElements={(
                <>
                    {participants && (
                        <div className="listing-details fade-down">
                            <h3>{dict.common.labels.event.participants}</h3>
                            <div className="event-participants">
                                {participants.map((participant) => (
                                    <div 
                                        key={participant.name}
                                        className="event-participant"
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
                    

                    <div className="listing-details fade-down">
                        <div className="detail-item">
                            <span className="detail-label">{dict.common.labels.event.participants}:</span>
                            <span className="detail-value">{participantsCount}{event?.maxParticipants ? " / " + event.maxParticipants : ""}</span>
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
                <div className="listing-info fade-down">
                    <div className="listing-chat">
                        <ChatWindow title={event?.localizedTitle} />
                    </div>
                </div>
            }
        />
    );
};

export default EventPage;