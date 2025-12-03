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
    ReviewsSection
} from "@/components";
import CatalogContent from "@/pages/CatalogPage/CatalogContent";
import { useTranslation } from 'react-i18next';
import ListingGallery from "../ListingGallery";
import { 
    getEventListing,
    viewListing, 
    getUserById,
    useAuth,
    checkSubscribtion,
    toggleSubscription,
    checkEventParticipant,
    getEventParticipants,
    removeEventParticipant,
    addEventParticipant
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

    const [event, setEvent] = useState([]);
    const [author, setAuthor] = useState({});
    const isOwner = !!(user?.openId == author?.openId);
    const [subscribed, setSubscribed] = useState(false);
    const [participantsCount, setParticipantsCount] = useState(0)
    const [participants, setParticipants] = useState(undefined)
    const [isParticipant, setParticipant] = useState(false);

    useEffect(() => {
        const params = {token};

        getEventListing(eventId, params)
            .then(data => {
                setEvent(data)
                setParticipantsCount(data.participants);
            })
            .catch(() => setEvent(null))

        checkSubscribtion(eventId, 'EVENT').then(data => setSubscribed(data))
        checkEventParticipant(eventId).then(data => setParticipant(data))
        viewListing(eventId).then(() => {});

    }, [eventId, token]);

    useEffect(() => {
        if (isOwner) getEventParticipants(eventId).then(data => setParticipants(data));
    }, [eventId, isOwner]);

    useEffect(() => {
        if (event?.authorId) getUserById(event.authorId).then(data => setAuthor(data));
    }, [event])

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

    /* const params = {
        categoryId: event?.categoryId,
    } */

    if (!event) return <NotFoundPage/>;

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
                            <span className="detail-value">{participantsCount}{event.maxParticipants ? "/ " + event.maxParticipants : ""}</span>
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
        />
    );
};

export default EventPage;