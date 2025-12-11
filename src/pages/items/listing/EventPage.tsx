import { useEffect, useState } from "react";
import { useParams, useLocation} from "react-router-dom";
import {
    RatingStars,
    PriceTypes,
    FormattedDate,
    Avatar
} from "@core/components";
import { ChatWindow } from "@/components";
import { useTranslation } from 'react-i18next';
import { 
    getEventPage,
    useAuth,
    checkSubscribtion,
    toggleSubscription,
    checkEventParticipant,
    removeEventParticipant,
    addEventParticipant,
    useChats,
    IEventPageRequest,
    IShortUserProfile,
    IShortUser
} from '@core/lib';

import NotFoundPage from "@core/pages/NotFoundPage";
import ListingPageLayout from "./ListingPageLayout";

const EventPage = () => {

    const { eventId } = useParams();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const token: string | null = query.get("token");
    const { t } = useTranslation(['categories', 'common', 'navigation']);

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
        const params = {token};
        setCurrentChatId(null)

        if (token) params.token = token;

        async function loadEventPage(params: {token: string | null}) {
            const event = await getEventPage(eventId, params)
            if (!event) setError(true);
            setEvent(event)
            setParticipantsCount(event.participantsCount);
            setParticipants(event.participants)
            setCurrentChatId(event.chat.id)
            setAuthor(event.author)
        }

        loadEventPage(params);

        checkSubscribtion(eventId, 'EVENT').then(data => setSubscribed(data))
        checkEventParticipant(eventId).then(data => setParticipant(data))

    }, [eventId, setCurrentChatId, token]);

    useEffect(() => {
        if (!currentChatId && event?.chat?.id) setCurrentChatId(event.chat.id)
    }, [currentChatId, event, setCurrentChatId])

    const toggleParticipation = async () => {
        setParticipant(!isParticipant); // мгновенный отклик
        if (isParticipant) {
            removeEventParticipant(eventId)
                .then(() => setParticipantsCount(prev => prev - 1))
                .catch(() => {
                    setParticipant(true);
                    setParticipantsCount(prev => prev);
                })
        } else {
            addEventParticipant(eventId)
                .then(() => setParticipantsCount(prev => prev + 1))
                .catch(() => {
                    setParticipant(false);
                    setParticipantsCount(prev => prev);
                })
        }
    }

    if (error) return <NotFoundPage/>;
    
    return (
        <ListingPageLayout
            listing={event}
            author={author}
            listingActions={!isOwner && (
                <div 
                    className="listing-action-item hover"
                    onClick={() => 
                        toggleSubscription(eventId, setSubscribed, subscribed, 'EVENT')
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
                        <span className="detail-label">{t(`labels.event.price`, { ns: 'common' })}:</span>
                        <PriceTypes listing={event} />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{t(`labels.event.date`, { ns: 'common' })}:</span>
                        <span className="detail-value">
                            <FormattedDate isoDate={event?.eventDate || ""} format="DMHM"/>
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{t(`labels.location`, { ns: 'common' })}:</span>
                        <span className="detail-value">
                            {event?.location || ""}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{t(`labels.rating`, { ns: 'common' })}:</span>
                        <RatingStars rating={event?.rating ?? 0}/>
                    </div>
                </>
            )}
            extraSidebarElements={(
                <>
                    {participants && (
                        <div className="listing-details fade-down">
                            <h3>{t(`labels.event.participants`, { ns: 'common' })}</h3>
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
                            <span className="detail-label">{t(`labels.event.participants`, { ns: 'common' })}:</span>
                            <span className="detail-value">{participantsCount}{event?.maxParticipants ? " / " + event.maxParticipants : ""}</span>
                        </div>
                        <div 
                            className="btn btn-primary"
                            onClick={toggleParticipation}
                        >
                            {!isParticipant ? (
                                <span>{t(`event.participation.join`, { ns: 'buttons' })}</span>
                            ) : (
                                <span>{t(`event.participation.leave`, { ns: 'buttons' })}</span>
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