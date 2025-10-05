import PriceTypes from "@/components/small-components/PriceTypes";
import { useActivePage } from "@/lib/hooks/contexts/useActivePage";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/apiClient";
import { useTranslation } from 'react-i18next';
import { useNotification } from "@/lib/contexts/notifications/NotificationContext";

const PrivateListingCard  = ({listing}) => {

    const { t } = useTranslation('common')

    const {notificateFromRes} = useNotification();
    const navigate = useNavigate();
    const activePage = useActivePage();

    const [isFavorite, setFavorite] = useState(false);

    const checkFavorite = useCallback(async () => {
        if (!listing?.id) return; // защита на случай пустого listing
        const data = await apiFetch(`/api/listing/${listing.id}/favorite/status`);
        setFavorite(data.isFavorite);
    }, [listing?.id]);

    useEffect(() => {
        checkFavorite();
    }, [checkFavorite, listing])

    async function toggleFavorite() {
        const data = await apiFetch(`/api/listing/favorite/${listing.id}`, {method: 'POST'});
        if (data.message) {
            checkFavorite();
        }
    }

    async function deleteListing() {
        if (!listing?.id) return;
        const res = await apiFetch(`/api/listing/${listing.id}/delete`, {method: 'DELETE'});
        if (res.message) {
            notificateFromRes(res);
        };
    };

    if (listing.temporary) return null;

    return (
        <article className="listing-card hover-animation-card" onClick={() => navigate(`/listing/${listing.id}`)}>
            <div 
                className="overlay-actions hover-show top-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Link 
                    className="btn btn-sm btn-primary"
                    to={`/listing/${listing.id}`}
                >
                    <i className="fa-solid fa-eye fa-lg"></i>
                </Link>
                {activePage === "my-listings" && (
                    <>
                        <Link 
                            className="btn btn-sm btn-primary"
                            to={`/secure/listing/edit/${listing.id}`}
                        >
                            <i className="fa-solid fa-pen-to-square fa-lg"></i>
                        </Link>
                        <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => {
                                const confirmed = window.confirm(t(`confirms.deleteListing`, { ns: 'messages' }));
                                if (confirmed) {
                                    deleteListing();
                                }
                            }} 
                        >
                            <i className="fa-solid fa-trash fa-lg"></i>
                        </button>
                    </>
                )}
                {activePage === "favorites" && (
                    <i className={`${isFavorite ? 'fa-solid active' : 'fa-regular'} fa-heart like`} onClick={() => toggleFavorite()}></i>
                )}
            </div>
            <img 
                src={listing.imagePath || `/images/default-listing.svg`}
                className="listing-img" 
                alt="Изображение объявления"
            />

            <div className="listing-card-body">
                <h3 className="listing-card-title">{listing.localizedTitle}</h3>
                {/* <p className="listing-card-text">{listing.localizedDescription}</p> */}
                <div className="listing-card-footer">
                    <div>
                        {/* компонент для отображение цены (с типом) */}
                        <PriceTypes listing={listing} />
                        <div className="listing-card-views">
                            <span>{t(`labels.views`, { ns: 'common' })}: </span>
                            <span>{listing.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PrivateListingCard;