import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ListingRating,
    PriceTypes,
    FormattedDate
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
    getPathToCategory,
    useAuth,
    toggleFavorite,
    checkFavorite,
    useNotification,
    checkSubscribtion,
    toggleSubscription,
    checkEventParticipant,
    toggleParticipation
} from '@core/lib';

import NotFoundPage from "@core/pages/NotFoundPage";

const EventPage = () => {

    const { eventId } = useParams();
    const {notificate} = useNotification();
    const { t } = useTranslation(['categories', 'common', 'navigation']);

    const {user, isAuthenticated} = useAuth();

    const [event, setEvent] = useState([]);
    const [author, setAuthor] = useState([]);
    const isOwner = !!(user?.id == author?.id);
    const [categories, setCategories] = useState([]);
    const [isFavorite, setFavorite] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [participants, setParticipants] = useState(0)
    const [isParticipant, setParticipant] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const listingData = await getEventListing(eventId);
                setEvent(listingData);
                setParticipants(listingData.participants);

                const subscribeData = await checkSubscribtion(eventId, 'EVENT');
                setSubscribed(subscribeData);

                const participantData = await checkEventParticipant(eventId);
                setParticipant(participantData)

                await viewListing(eventId);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setEvent(null);
            }
        }

        loadData();
    }, [eventId]);

    useEffect(() => {
        async function loadListingAuthor(authorId) {
            const data = await getUserById(authorId);
            setAuthor(await data.user);
        }

        async function loadCategoryPath(id) {
            const data = await getPathToCategory(id);
            setCategories(data.categories);
        }

        if (event?.categoryId) loadCategoryPath(event.categoryId);
        if (event?.authorId) loadListingAuthor(event.authorId);

    }, [event])

    const params = {
        categoryId: event?.categoryId,
    }

    useEffect(() => {

        if (event?.id && isAuthenticated) {
            checkFavorite(event.id, setFavorite);
        }
        
    }, [event?.id, isAuthenticated]);

    if (!event) return <NotFoundPage/>;

    return (
        <div className="listing-container">
            <div className="listing-layout">
                <main className="listing-main">
                    {/* Хлебные крошки */}
                    <nav className="breadcrumbs">
                        <div>
                            <Link to="/catalog">
                                {t(`breadcrumps.catalog`, { ns: 'navigation' })}
                            </Link>
                            <span className="divider">/</span>
                        </div>
                        {categories.map((cat) => (
                            <div key={cat.id}>
                                <Link to={`/catalog?category=${cat.name}`}>
                                    {t(`category.${cat.name}`, { ns: 'categories' })}
                                </Link>
                                <span className="divider">/</span>
                            </div>
                        ))}
                        <span>{event.localizedTitle}</span>
                    </nav>

                    {/* Заголовок объявления */}
                    <div className="listing-header">
                        <h1>{event.localizedTitle}</h1>
                        <div className="listing-meta">
                            <span className="listing-date">
                                {new Date(event.publishedAt).toLocaleDateString("ru-RU")}
                            </span>
                            <span className="listing-views">
                                {t(`labels.views`, { ns: 'common' })}: <span>{event.views}</span>
                            </span>
                        </div>
                    </div>

                    <div className="listing-main-content">
                        {/* Галерея изображений */}
                        <div className="listing-content">
                            <ListingGallery id={event.id}/>
                            
                            {event.localizedDescription && (
                                <div className="listing-info fade-down">
                                    <h2>{t(`labels.description`, { ns: 'common' })}</h2>
                                    <p className="listing-description">
                                        {event.localizedDescription || "Нет описания"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Информация о предложении */}
                        <div className="listing-sidebar">
                            {event.id && (
                                <>
                                    <div className="listing-details fade-down">
                                        <div className="detail-item">
                                            <span className="detail-label">{t(`labels.event.price`, { ns: 'common' })}:</span>
                                            <PriceTypes listing={event} className={'detail-value'}/>
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

                                        <div className="listing-actions">
                                            {!isOwner ? (
                                                <>
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

                                                    <div 
                                                        className="listing-action-item"
                                                        onClick={() => toggleFavorite(eventId, setFavorite, isFavorite)}
                                                    >
                                                        <i className={`
                                                                ${isFavorite ? 
                                                                    'fa-solid' : 
                                                                    'fa-regular'
                                                                } 
                                                                fa-heart like
                                                            `}
                                                        ></i>
                                                    </div>
                                                </>
                                            ) : (
                                                <Link
                                                    to={`/secure/listing/edit/${event.id}`}
                                                    className="listing-action-item hover"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </Link>
                                            )}
                                            <div 
                                                className="listing-action-item hover"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.href)
                                                        .then(() => notificate(t(`notification.success.copyListingLink`, { ns: 'messages' }), "success"))
                                                        .catch(() => notificate("Ошибка", "error"));
                                                }}
                                            >
                                                <i className="fa-regular fa-share-nodes"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="listing-details fade-down">
                                        <div className="detail-item">
                                            <span className="detail-label">{t(`labels.event.participants`, { ns: 'common' })}:</span>
                                            <span className="detail-value">{participants}/{event.maxParticipants}</span>
                                        </div>
                                        <div 
                                            className="btn btn-primary"
                                            onClick={() => toggleParticipation(eventId, participants, setParticipants, isParticipant, setParticipant)}
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

                            {/* Боковая панель с контактами */}
                            <UserInfoSidebar listingId={event.id} author={author} />
                        </div>
                    </div>

                    {/* Блок с отзывами */}
                    <ReviewsSection listingId={event.id} profileId={author.id} />

                    {/* Похожие объявления */}
                    {event.category && (
                        <section className="similar-listings">
                            <h2>{t(`listing.similarListings`, { ns: 'common' })}</h2>
                            <CatalogContent mainListingId={event.id} params={params}/>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default EventPage;