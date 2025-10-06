import PriceTypes from "@core/components/common/PriceTypes";
import ListingRating from "@core/components/common/ListingRating";
import { apiFetch } from "@core/lib/services/apiClient";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { useTranslation } from 'react-i18next';

const PublicListingCard = ({listing, isMainListing}) => {

    const navigate = useNavigate();
    const {notificate} = useNotification();
    const [isFavorite, setFavorite] = useState(false);
    const { t } = useTranslation('common')
    const { user } = useAuth();

    const isNew = (new Date() - new Date(listing.publishedAt)) < 3 * 24 * 60 * 60 * 1000;

    useEffect(() => {
        async function checkFavorite() {
            const data = await apiFetch(`/api/listing/${listing.id}/favorite/status`);
            setFavorite(await data.isFavorite);
        }

        if (listing.id && user) {
            checkFavorite();
        }
        
    }, [listing.id, user]);
    
    const toggleFavorite = async (e) => {
        e.stopPropagation();
        
        if (!listing.id) {
            return;
        }

        try {
            const res = await apiFetch(`/api/listing/favorite/${listing.id}`, { method: "POST" });

            if (res?.message) {
                // ничего
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

    if (listing.testMode || isMainListing || listing.temporary) return null;

    return (
        <article onClick={() => navigate(`/listing/${listing.id}`)} className="listing-card hover-animation-card">
            <img 
                src={listing.imagePath || `/images/default-listing.svg`}
                className="listing-img"
                alt="Изображение объявления"/>

            {isNew && (
                <div className="listing-status red">{t(`catalog.newListing`, { ns: 'tooltips' })}</div>
            )}
            <div className="listing-card-body">
                <h3 className="listing-card-title">{listing.localizedTitle}</h3>
                {/* <p className="listing-card-text">{listing.localizedDescription}</p> */}
                <div className="listing-card-footer">
                    <div className="flex-column">
                        {/* компонент для отображение цены (с типом) */}
                        <PriceTypes listing={listing} />
                        <ListingRating listing={listing} />
                    </div>
                    {/* <span className="partner-sign" th:if="${listing.author.role.name() == 'BUSINESS'}" th:text="#{partner}"></span> */}
                    <span className="listing-location">{listing.location}</span>
                </div>
                {user && (
                    <div className="listing-card-overlay-actions">
                        <i 
                            className={`${isFavorite ? 'fa-solid active' : 'fa-regular'} fa-heart like`} 
                            onClick={(e) => toggleFavorite(e)}></i>
                    </div>
                )}
            </div>
        </article>
    );
};

export default PublicListingCard;