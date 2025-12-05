import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ListingGallery from "./ListingGallery";
import { ReviewsSection, UserInfoSidebar } from "@/components";
import { checkFavorite, getPathToCategory, toggleFavorite, useAuth, useNotification } from "@core/lib";

interface ListingPageLayoutProps {
    children: React.ReactNode
    details: React.ReactNode,
    extraSidebarElements: React.ReactNode,
    listingActions?: React.ReactNode,
    extraPageElements?: React.ReactNode,
    listing: {},
    author: {}
}

const ListingPageLayout = ({
    children, 
    listing, 
    author, 
    details, 
    extraSidebarElements,
    listingActions,
    extraPageElements
}: ListingPageLayoutProps) => {

    const {user, isAuthenticated} = useAuth();
    const isOwner = !!(user?.openId == author?.openId);
    const [isFavorite, setFavorite] = useState(false);
    const { notificate } = useNotification();

    const [categories, setCategories] = useState([]);
    const { t } = useTranslation(['categories', 'common', 'navigation']);

    useEffect(() => {
        if (!listing?.id || !isAuthenticated) return;
        
        checkFavorite(listing.id).then(data => setFavorite(data));
    }, [listing?.id, isAuthenticated]);

    useEffect(() => {
        if (listing?.categoryId && listing.type) getPathToCategory(listing.categoryId, listing.type).then(data => setCategories(data));
    }, [listing])

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
                        {listing.publicType && (
                            <div>
                                <Link to="/catalog">
                                    {t(`listingType.${listing.publicType}`, { ns: 'categories' })}
                                </Link>
                                <span className="divider">/</span>
                            </div>
                        )}
                        {categories?.map((cat) => (
                            <div key={cat.id}>
                                <Link to={`/catalog?category=${cat.name}`}>
                                    {t(`category.${listing.type.toLowerCase()}.${cat.name}`, { ns: 'categories' })}
                                </Link>
                                <span className="divider">/</span>
                            </div>
                        ))}
                        <span>{listing.localizedTitle}</span>
                    </nav>

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

                            {extraPageElements}
                        </div>
                        
                        <div className="listing-sidebar">
                            {children}
                            <div className="listing-details fade-down">
                                {details}

                                <div className="listing-actions">
                                    {listingActions}
                                    {!isOwner ? (
                                        <div 
                                            className="listing-action-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFavorite(!isFavorite)
                                                toggleFavorite(listing.id)
                                                    .catch(() => setFavorite(isFavorite))
                                            }}
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
                            {/* Боковая панель с контактами */}
                            <UserInfoSidebar listingId={listing.id} author={author} />
                            {extraSidebarElements}
                        </div>
                    </div>

                    <ReviewsSection listingId={listing.id} profileId={listing.authorId} />
                </main>
            </div>
        </div>
    );
}

export default ListingPageLayout;