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
import ListingGallery from "./ListingGallery";

const ListingPage = () => {

    const { id } = useParams();

    const { t } = useTranslation(['categories', 'common', 'navigation']);

    const [listing, setListing] = useState([]);
    const [author, setAuthor] = useState([]);
    const [categories, setCategories] = useState([]);
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

        loadListing();
        loadImages();
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
        category: listing.category,
    }

    return (
        <div className="listing-container">
            <div className="listing-layout">
                <main className="listing-main">
                    {/* Хлебные крошки */}
                    <nav className="breadcrumbs">
                        <div>
                            <Link href="/catalog">
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
                        <ListingGallery images={images} mainImage={listing.imagePath}/>

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