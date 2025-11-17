import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ListingRating,
    PriceTypes
} from "@core/components";
import {
    UserInfoSidebar,
    ReviewsSection
} from "@/components";
import CatalogContent from "@/pages/CatalogPage/CatalogContent";
import { useTranslation } from 'react-i18next';
import ListingGallery from "../ListingGallery";
import { 
    getListingById,
    viewListing, 
    getUserById,
    getPathToCategory,
    useAuth,
    toggleFavorite,
    checkFavorite,
    useNotification
} from '@core/lib';

import NotFoundPage from "@core/pages/NotFoundPage";

const ListingPage = () => {

    const { listigId } = useParams();
    const {notificate} = useNotification();
    const { t } = useTranslation(['categories', 'common', 'navigation']);

    const {user, isAuthenticated} = useAuth();

    const [listing, setListing] = useState([]);
    const [author, setAuthor] = useState([]);
    const isOwner = !!(user?.id == author?.id);
    const [categories, setCategories] = useState([]);
    const [isFavorite, setFavorite] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const listingData = await getListingById(listigId);
                setListing(listingData || null);

                await viewListing(listigId);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setListing(null);
            }
        }

        loadData();
    }, [listigId]);

    useEffect(() => {
        async function loadListingAuthor(authorId) {
            const user = await getUserById(authorId);
            setAuthor(await user);
        }

        async function loadCategoryPath(listigId) {
            const data = await getPathToCategory(listigId);
            setCategories(data.categories);
        }

        if (listing?.categoryId) loadCategoryPath(listing.categoryId);
        if (listing?.authorId) loadListingAuthor(listing.authorId);

    }, [listing])

    /* const params = {
        categoryId: listing?.categoryId,
    } */

    useEffect(() => {

        if (listing?.id && isAuthenticated) {
            checkFavorite(listing.id, setFavorite);
        }
        
    }, [listing?.id, isAuthenticated]);

    return (
        <>
            {listing ? (
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
                                <div>
                                    <Link to="/catalog">
                                        {t(`listingType.${listing.publicType}`, { ns: 'categories' })}
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
                                <span>{listing.localizedTitle}</span>
                            </nav>

                            {/* Заголовок объявления */}
                            <div className="listing-header">
                                <h1>{listing.localizedTitle}</h1>
                                <div className="listing-meta">
                                    <span>{new Date(listing.publishedAt).toLocaleDateString("ru-RU")}</span>
                                    <span className="listing-views">
                                        {t(`labels.views`, { ns: 'common' })}: <span>{listing.views}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="listing-main-content">
                                {/* Галерея изображений */}
                                <div className="listing-content">
                                    <ListingGallery id={listing.id}/>
                                    
                                    {listing.localizedDescription && (
                                        <div className="listing-info fade-down">
                                            <h2>{t(`labels.description`, { ns: 'common' })}</h2>
                                            <p className="listing-description">
                                                {listing.localizedDescription || "Нет описания"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Информация о предложении */}
                                <div className="listing-sidebar">
                                    {listing.id && (
                                        <div className="listing-details fade-down">
                                            <div className="detail-item">
                                                <span className="detail-label">{t(`labels.price`, { ns: 'common' })}:</span>
                                                <h1><PriceTypes listing={listing} className={"listing"} /></h1>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">{t(`labels.location`, { ns: 'common' })}:</span>
                                                <span className="detail-value">
                                                    {listing.location || ""}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">{t(`labels.rating`, { ns: 'common' })}:</span>
                                                <ListingRating listing={listing}/>
                                            </div>

                                            <div className="listing-actions">
                                                {!isOwner ? (
                                                    <div 
                                                        className="listing-action-item"
                                                        onClick={() => toggleFavorite(listing.id, setFavorite, isFavorite)}
                                                    >
                                                        <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart like`}></i>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        to={`/account/listing/edit/${listing.id}`}
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
                                    )}

                                    {/* Боковая панель с контактами */}
                                    <UserInfoSidebar listingId={listing.id} author={author} />
                                </div>
                            </div>

                            {/* Блок с отзывами */}
                            <ReviewsSection listingId={listing.id} profileId={author.id} />

                            {/* Похожие объявления */}
                            {/* {listing.category && (
                                <section className="similar-listings">
                                    <h2>{t(`listing.similarListings`, { ns: 'common' })}</h2>
                                    <CatalogContent mainListingId={listing.id} params={params}/>
                                </section>
                            )} */}
                        </main>
                    </div>
                </div>
            ) : (
                <NotFoundPage/>
            )}
        </>
    );
};

export default ListingPage;