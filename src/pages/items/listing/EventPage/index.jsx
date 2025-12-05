import { useEffect, useState } from "react";
import { useParams, Link, useLocation} from "react-router-dom";
import {
    ListingRating,
    PriceTypes,
    FormattedDate,
    Avatar
} from "@core/components";
import {
    UserInfoSidebar,
    ReviewsSection,
    ChatWindow
} from "@/components";
import CatalogContent from "@/pages/CatalogPage/CatalogContent";
import { useTranslation } from 'react-i18next';
import ListingGallery from "../ListingGallery";
import { 
    getEventPage,
    useAuth,
    checkSubscribtion,
    toggleSubscription,
    checkEventParticipant,
    removeEventParticipant,
    addEventParticipant,
    useChats
} from '@core/lib';

import NotFoundPage from "@core/pages/NotFoundPage";
import ListingPageLayout from "../ListingPageLayout";

const EventPage = () => {

    const { eventId } = useParams();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const token = query.get("token");
    const { t } = useTranslation(['categories', 'common', 'navigation']);

    const {user} = useAuth();

    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState([]);
    const [author, setAuthor] = useState({});
    const isOwner = !!(user?.openId == author?.openId);
    const [subscribed, setSubscribed] = useState(false);
    const [participantsCount, setParticipantsCount] = useState(0)
    const [participants, setParticipants] = useState(undefined)
    const [isParticipant, setParticipant] = useState(false);
    const { setCurrentChatId } = useChats();

    useEffect(() => {
        const params = {token};

        async function loadEventPage(params) {
            const event = await getEventPage(eventId, params)

            setEvent(event)
            setParticipantsCount(event.participants.length);
            setParticipants(event.participants)
            setCurrentChatId(event.chat.id)
            setAuthor(event.author)
            setLoading(true);
        }

        loadEventPage(params);

        checkSubscribtion(eventId, 'EVENT').then(data => setSubscribed(data))
        checkEventParticipant(eventId).then(data => setParticipant(data))

    }, [eventId, setCurrentChatId, token]);

    const toggleParticipation = async () => {
        setParticipant(!isParticipant); // мгновенный отклик
        if (isParticipant) {
            removeEventParticipant(eventId, event?.type)
                .then(() => setParticipantsCount(prev => prev - 1))
                .catch(() => {
                    setParticipant(true);
                    setParticipantsCount(prev => prev);
                })
        } else {
            addEventParticipant(eventId, event?.type)
                .then(() => setParticipantsCount(prev => prev + 1))
                .catch(() => {
                    setParticipant(false);
                    setParticipantsCount(prev => prev);
                })
        }
    }

    if (!event && !loading) return <NotFoundPage/>;

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
                            <FormattedDate isoDate={event.eventDate || ""} format="DMHM"/>
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{t(`labels.location`, { ns: 'common' })}:</span>
                        <span className="detail-value">
                            {event.location || ""}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{t(`labels.rating`, { ns: 'common' })}:</span>
                        <ListingRating listing={event}/>
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
                            <span className="detail-value">{participantsCount}{event.maxParticipants ? " / " + event.maxParticipants : ""}</span>
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
                        <ChatWindow title={event.localizedTitle} />
                    </div>
                </div>
            }
        />
    );
};

export default EventPage;