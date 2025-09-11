import "#/css/public/pages/listing-page.css";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useParams, Link } from "react-router-dom";
import ListingRating from "@/components/small-components/ListingRating"
import PriceTypes from "@/components/small-components/PriceTypes"
import UserInfoSidebar from "@/components/page-components/UserInfoSidebar"
import ReviewsSection from "@/components/reviews/ReviewsSection";
import CatalogContent from "@/pages/CatalogPage/CatalogContent";
import { useTranslation } from 'react-i18next';

const ListingPage = () => {

    const { id } = useParams();

    const { t } = useTranslation(['categories', 'common', 'navigation']);

    const [listing, setListing] = useState([]);
    const [author, setAuthor] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadListing() {
            const data = await apiFetch(`/api/listing/get/${id}`);
            setListing(data.listing);
        }

        loadListing();
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

    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const images = listing.images && listing.images.length > 0
        ? listing.images
        : [{ path: listing.imagePath || "/images/default-listing.png" }];

    const handlePrevImage = () => {
        setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextImage = () => {
        setMainImageIndex((prev) => (prev + 1) % images.length);
    };

    const openModal = (index) => {
        setMainImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const params = {
        category: listing.category,
    }

    return (
        <div className="listing-container">
            <div className="listing-layout">
                <main className="listing-main">
                    {/* Хлебные крошки */}
                    <nav className="breadcrumbs">
                        <a href="/catalog">
                            {t(`breadcrumps.catalog`, { ns: 'navigation' })}
                        </a>
                        <span> / </span>
                        {categories.map((cat) => (
                            <>
                                <Link to={`/catalog?category=${cat.name}`}>
                                    {t(`category.${cat.name}`, { ns: 'categories' })}
                                </Link>
                                <span> / </span>
                            </>
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
                        <div className="listing-gallery">
                            <div className="main-image">
                                <div className="image-container">
                                    <button className="nav-arrow prev-arrow" onClick={handlePrevImage}>
                                        &#10094;
                                    </button>
                                    <img
                                        src={images[mainImageIndex].path}
                                        onError={(e) => e.currentTarget.src = "/images/default-listing.png"}
                                        alt="Основное изображение"
                                        className="clickable-image main-image-view"
                                        id="mainImageView"
                                        onClick={() => openModal(mainImageIndex)}
                                    />
                                    <button className="nav-arrow next-arrow" onClick={handleNextImage}>
                                        &#10095;
                                    </button>
                                </div>
                            </div>

                            {images.length > 1 && (
                                <div className="thumbnails">
                                    {images.map((image, index) => (
                                        <div className="thumbnail" key={index} data-index={index}>
                                            <img
                                                src={image.path}
                                                onError={(e) => e.currentTarget.src = "/images/default-listing.png"}
                                                alt="Дополнительное изображение"
                                                className="clickable-image thumbnail-img"
                                                onClick={() => setMainImageIndex(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Модальное окно (fullscreen) */}
                        {isModalOpen && (
                            <div id="fullscreen-modal" className="fullscreen-modal">
                                <span className="close" id="close-modal" onClick={closeModal}>
                                    &times;
                                </span>
                                <button className="modal-arrow modal-prev" onClick={handlePrevImage}>
                                    &#10094;
                                </button>
                                <img
                                    id="fullscreen-image"
                                    src={images[mainImageIndex].path}
                                    alt="Fullscreen"
                                />
                                <button className="modal-arrow modal-next" onClick={handleNextImage}>
                                    &#10095;
                                </button>
                            </div>
                        )}

                        {/* Информация о предложении */}
                        <div className="listing-content">
                            <div className="listing-details">
                                <h2>{t(`labels.description`, { ns: 'common' })}</h2>
                                <p className="listing-description">
                                    {listing.localizedDescription || "Нет описания"}
                                </p>

                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">{t(`labels.price`, { ns: 'common' })}:</span>
                                        <PriceTypes listing={listing}/>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">{t(`labels.location`, { ns: 'common' })}:</span>
                                        <span className="detail-value">
                                            {listing.location || ""}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">{t(`labels.category`, { ns: 'common' })}:</span>
                                        {t(`category.${listing.category}`, { ns: 'categories' })}
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">{t(`labels.rating`, { ns: 'common' })}:</span>
                                        <ListingRating />
                                    </div>
                                </div>
                            </div>

                            {/* Боковая панель с контактами */}
                            <UserInfoSidebar listingId={listing.id} author={author} />
                        </div>
                    </div>

                    {/* Блок с отзывами */}
                    <ReviewsSection listingId={listing.id} profileId='' />

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