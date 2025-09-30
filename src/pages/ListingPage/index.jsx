import "@/css/pages/listing-page.css";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useParams, Link } from "react-router-dom";
import ListingRating from "@/components/small-components/ListingRating"
import PriceTypes from "@/components/small-components/PriceTypes"
import UserInfoSidebar from "@/components/page-components/UserInfoSidebar"
import ReviewsSection from "@/components/reviews/ReviewsSection";
import CatalogContent from "@/pages/CatalogPage/CatalogContent";
import { useTranslation } from 'react-i18next';
import ListingGallery from "./ListingGallery";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { useNotification } from "@/lib/contexts/notifications/NotificationContext";

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
        async function loadListing() {
            const data = await apiFetch(`/api/listing/get/${id}`);
            setListing(data.listing);
        }

        async function loadImages() {
            const data = await apiFetch(`/api/listing/images/${id}`)
            setImages(data.images);
        }

        async function viewListing() {
            await apiFetch(`/api/listing/view/${id}`, { method: "POST" })
        }

        loadListing();
        loadImages();
        viewListing();
    }, [id])

    useEffect(() => {
        async function loadListingAuthor(authorId) {
            const data = await apiFetch(`/api/user/get/${authorId}`);
            setAuthor(await data.user);
        }

        async function loadCategoryPath(id) {
            const data = await apiFetch(`/api/categories/path/${id}`)
            setCategories(data.categories);
        }

        if (listing.categoryId) loadCategoryPath(listing.categoryId);
        if (listing.authorId) loadListingAuthor(listing.authorId);

    }, [listing])

    const params = {
        categoryId: listing.categoryId,
    }

    useEffect(() => {
        async function checkFavorite() {
            const data = await apiFetch(`/api/listing/${listing.id}/favorite/status`);
            setFavorite(await data.isFavorite);
        }

        if (listing.id && isAuthenticated) {
            checkFavorite();
        }
        
    }, [listing.id, isAuthenticated]);

    const toggleFavorite = async () => {
        if (!listing.id) {
            notificate("Ошибка", "error");
            return;
        }

        try {
            const res = await apiFetch(`/api/listing/favorite/${listing.id}`, { method: "POST" });

            if (res?.message) {
                // notificate(res.message, "success");
            } else {
                notificate("Ошибка", "error");
            }

            // сразу обновляем статус избранного
            const data = await apiFetch(`/api/listing/${listing.id}/favorite/status`);
            setFavorite(data.isFavorite);

        } catch (err) {
            console.error(err);
            notificate("Ошибка при переключении избранного", "error");
        }
    };

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
                        <span>{listing.localizedTitle}</span>
                    </nav>

                    {/* Заголовок объявления */}
                    <div className="listing-header">
                        <h1>{listing.localizedTitle}</h1>
                        <div className="listing-meta">
                            <span className="listing-date">
                                {new Date(listing.createdAt).toLocaleDateString("ru-RU")}
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
                                <div>
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
                                {isOwner ? (
                                    <Link
                                        to={`/secure/listing/edit/${listing.id}`}
                                        className="btn btn-primary"
                                    >
                                        {t(`listing.edit`, { ns: 'buttons' })}
                                    </Link>
                                ) : (
                                    <>
                                        {user && (
                                            <div className="overlay-actions top right">
                                                <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart fa-3x like`} onClick={() => toggleFavorite()}></i>
                                            </div>
                                        )}
                                    </>
                                )}
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
    );
};

export default ListingPage;