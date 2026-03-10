import { useEffect, useState } from "react";
import ListingGallery from "./ListingGallery";
import { IEventPageRequest, IListingPageRequest } from "@core/lib/types/models/listing";
import { IShortUserProfile } from "@core/lib/types/models/user";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { ICategory } from "@core/lib/types/models/category";
import { listingService } from "@core/lib/services/listing";
import { categoryService } from "@core/lib/services/categoriesService";
import UserInfoSidebar from "@/components/layout/sidebar/UserInfoSidebar";
import ReviewsSection from "@/components/ui/reviews/ReviewsSection";
import Link from "next/link";
import { useI18n } from "@core/lib/contexts/I18nContext";

interface ListingPageLayoutProps {
    details: React.ReactNode,
    extraSidebarElements?: React.ReactNode,
    listingActions?: React.ReactNode,
    extraPageElements?: React.ReactNode,
    listingPage: IListingPageRequest
    author: IShortUserProfile | null
}

const ListingPageLayout = ({
    listingPage, 
    author, 
    details, 
    extraSidebarElements,
    listingActions,
    extraPageElements
}: ListingPageLayoutProps) => {

    const { listing } = listingPage;

    const {user} = useAuth();
    const isOwner = !!(user?.openId == author?.openId);

    const { isFavorite, toggleFavorite } = listingService.useFavorite(listing);
    
    const { notificate } = useNotification();

    const [categories, setCategories] = useState<ICategory[] | null>(null);
    const { dict } = useI18n();

    useEffect(() => {
        if (listing.categoryId && listing.type) categoryService.getPathToCategory(listing.categoryId, listing.type).then(setCategories);
    }, [listing])

    return (
        <main className="listing-main">
            {/* Хлебные крошки */}
            <nav className="breadcrumbs">
                <div>
                    <Link href="/catalog">
                        {dict.navigation.catalog}
                    </Link>
                    <span className="divider">/</span>
                </div>
                {listing?.publicType && (
                    <div>
                        <Link href={`/catalog?type=${listing?.publicType}`}>
                            {dict.categories.listingType[listing?.publicType]}
                        </Link>
                        <span className="divider">/</span>
                    </div>
                )}
                {categories?.map((cat) => (
                    <div key={cat.id}>
                        <Link href={`/catalog?type=${listing?.publicType}&category=${cat.id}`}>
                            {listing?.type ? dict.categories.category[listing?.type][cat.name] : ""}
                        </Link>
                        <span className="divider">/</span>
                    </div>
                ))}
                <span>{listing?.localizedTitle}</span>
            </nav>

            <div className="listing-header">
                <h1>{listing?.localizedTitle}</h1>
                <div className="listing-meta">
                    <span>{listing?.publishedAt ? new Date(listing?.publishedAt).toLocaleDateString("ru-RU") : ""}</span>
                    <span className="listing-views">
                        {dict.common.labels.views}: <span>{listing?.views}</span>
                    </span>
                </div>
            </div>

            <div className="listing-main-content">
                <div className="listing-content">
                    <ListingGallery images={listingPage?.images ?? []}/>
                    
                    {listing?.localizedDescription && (
                        <div className="listing-info fade-down">
                            <h2>{dict.common.labels.description}</h2>
                            <p className="listing-description">
                                {listing.localizedDescription || "Нет описания"}
                            </p>
                        </div>
                    )}

                    {extraPageElements}
                </div>
                
                <div className="listing-sidebar">
                    <div className="listing-details fade-down">
                        {details}

                        <div className="listing-actions">
                            {listingActions}
                            {listing && (
                                <>
                                    {!isOwner ? (
                                        <div 
                                            className="listing-action-item"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleFavorite()
                                            }}
                                        >
                                            <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart like`}></i>
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/account/listing/edit/${listing.id}`}
                                            className="listing-action-item hover"
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </Link>
                                    )}
                                </>
                            )}
                            <div 
                                className="listing-action-item hover"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href)
                                        .then(() => notificate(dict.messages.notification.success.copyListingLink, "success"))
                                        .catch(() => notificate("Ошибка", "error"));
                                }}
                            >
                                <i className="fa-regular fa-share-nodes"></i>
                            </div>
                        </div>
                    </div>
                    {/* Боковая панель с контактами */}
                    <UserInfoSidebar listingId={listing?.id ?? null} author={author} />
                    {extraSidebarElements}
                </div>
            </div>

            <ReviewsSection listingId={listing?.id ?? null} profileId={listingPage?.author.id ?? null} />
        </main>
    );
}

export default ListingPageLayout;