import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ListingRating from "@core/components/common/ListingRating"
import PriceTypes from "@core/components/common/PriceTypes"
import UserInfoSidebar from "@/components/layout/sidebar/UserInfoSidebar"
import ReviewsSection from "@/components/ui/reviews/ReviewsSection";
import CatalogContent from "@/pages/CatalogPage/CatalogContent";
import { useTranslation } from 'react-i18next';
import ListingGallery from "./ListingGallery";
import { 
    getListingById, 
    getListingImages, 
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

    const { id } = useParams();
    const {notificate} = useNotification();
    const { t } = useTranslation(['categories', 'common', 'navigation']);

    const {user, isAuthenticated} = useAuth();

    const [listing, setListing] = useState([]);
    const [author, setAuthor] = useState([]);
    const isOwner = !!(user?.id == author?.id);
    const [categories, setCategories] = useState([]);
    const [isFavorite, setFavorite] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const listingData = await getListingById(id);
                setListing(listingData.listing || null);

                const imageData = await getListingImages(id);
                setImages(imageData.images || []);

                await viewListing(id);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setListing(null);
            }
        }

        loadData();
    }, [id]);

    useEffect(() => {
        async function loadListingAuthor(authorId) {
            const data = await getUserById(authorId);
            setAuthor(await data.user);
        }

        async function loadCategoryPath(id) {
            const data = await getPathToCategory(id);
            setCategories(data.categories);
        }

        if (listing?.categoryId) loadCategoryPath(listing.categoryId);
        if (listing?.authorId) loadListingAuthor(listing.authorId);

    }, [listing])

    const params = {
        categoryId: listing?.categoryId,
    }

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
                                    <span className="listing-date">
                                        {new Date(listing.publishedAt).toLocaleDateString("ru-RU")}
                                    </span>
                                    <span className="listing-views">
                                        {t(`labels.views`, { ns: 'common' })}: <span>{listing.views}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="listing-main-content">
                                {/* Галерея изображений */}
                                <div className="listing-content">
                                    <ListingGallery images={images} mainImage={listing.imagePath}/>
                                    
                                    <div className="listing-info">
                                        <h2>{t(`labels.description`, { ns: 'common' })}</h2>
                                        <p className="listing-description">
                                            {listing.localizedDescription || "Нет описания"}
                                        </p>
                                    </div>
                                </div>

                                {/* Информация о предложении */}
                                <div className="listing-sidebar">
                                    <div className="listing-details">
                                        <div className="listing-page-price">
                                            <span className="detail-label">{t(`labels.price`, { ns: 'common' })}:</span>
                                            <h1><PriceTypes listing={listing} className={"price"} /></h1>
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
                                        {isOwner && (
                                            <Link
                                                to={`/secure/listing/edit/${listing.id}`}
                                                className="btn btn-primary"
                                            >
                                                {t(`listing.edit`, { ns: 'buttons' })}
                                            </Link>
                                        )}

                                        <div className="listing-actions">
                                            {!isOwner && (
                                                <div 
                                                    className="listing-action-item"
                                                    onClick={() => toggleFavorite(listing.id, setFavorite, isFavorite)}
                                                >
                                                    <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart like`}></i>
                                                </div>
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

                                    {/* Боковая панель с контактами */}
                                    <UserInfoSidebar listingId={listing.id} author={author} />
                                </div>
                            </div>

                            {/* Блок с отзывами */}
                            <ReviewsSection listingId={listing.id} profileId={author.id} />

                            {/* Похожие объявления */}
                            {listing.category && (
                                <section className="similar-listings">
                                    <h2>{t(`listing.similarListings`, { ns: 'common' })}</h2>
                                    <CatalogContent mainListingId={listing.id} params={params}/>
                                </section>
                            )}
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