import { useEffect, useState } from "react";
import ListingGallery from "../ListingGallery/ListingGallery";
import { IListingPageRequest } from "@core/lib/types/models/listing";
import { IShortUserProfile } from "@core/lib/types/models/user";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { ICategory } from "@core/lib/types/models/category";
import { listingService } from "@core/lib/services/listing";
import { categoryService } from "@core/lib/services/category";
import UserInfoSidebar from "@/components/pages/listing/UserInfoSidebar/UserInfoSidebar";
import ReviewsSection from "@/components/ui/reviews/ReviewsSection";
import Link from "next/link";
import { useI18n } from "@core/lib/contexts/I18nContext";
import HeartIcon from "@core/components/common/icons/HeartIcon"
import styles from "./ListingPageLayout.module.scss"

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

    const { user } = useAuth();
    const isOwner = !!(user?.openId == author?.openId);

    const { isFavorite, toggleFavorite } = listingService.useFavorite(listing);
    
    const { notificate } = useNotification();

    const [categories, setCategories] = useState<ICategory[] | null>(null);
    const { dict } = useI18n();

    useEffect(() => {
        if (listing?.categoryId && listing?.type) categoryService.getPathToCategory(listing.categoryId, listing.type).then(setCategories);
    }, [listing])

    return (
        <main className={styles.main}>
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

            <div className={styles.header}>
                <h1>{listing?.localizedTitle}</h1>
                <div className={styles.meta}>
                    <span>{listing?.publishedAt ? new Date(listing?.publishedAt).toLocaleDateString("ru-RU") : ""}</span>
                    <span className={styles.views}>
                        {dict.common.labels.views}: <span>{listing?.views}</span>
                    </span>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.content}>
                    <ListingGallery images={listingPage?.images ?? []}/>
                    
                    {listing?.localizedDescription && (
                        <div className={`${styles.info} fade-down`}>
                            <h2>{dict.common.labels.description}</h2>
                            <p className={styles.description}>
                                {listing.localizedDescription || "Нет описания"}
                            </p>
                        </div>
                    )}

                    {extraPageElements}
                </div>
                
                <div className={styles.sidebar}>
                    <div className={`${styles.details} fade-down`}>
                        {details}

                        <div className={styles.actions}>
                            {listingActions}
                            {listing && (
                                <>
                                    {!isOwner ? (
                                        <div 
                                            className={styles.action}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleFavorite()
                                            }}
                                        >
                                            <HeartIcon
                                                filled={isFavorite}
                                                className={"like"}
                                                size={24}
                                            />
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/account/listing/edit/${listing.id}`}
                                            className={`${styles.action} hover`}
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </Link>
                                    )}
                                </>
                            )}
                            <div 
                                className={`${styles.action} hover`}
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