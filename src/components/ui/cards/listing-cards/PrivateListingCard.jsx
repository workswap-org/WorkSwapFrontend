import { PriceTypes } from "@core/components";
import { 
    useActivePage,
    checkFavorite,
    toggleFavorite,
    deleteListing
} from "@core/lib";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useNotification } from "@core/lib";

const PrivateListingCard  = ({listing}) => {

    const { t } = useTranslation('common')

    const {notificateFromRes} = useNotification();
    const navigate = useNavigate();
    const activePage = useActivePage();

    const [isFavorite, setFavorite] = useState(false);

    useEffect(() => {
        checkFavorite(listing.id, setFavorite);
    }, [listing])

    if (listing.temporary) return null;

    return (
        <article className="listing-card hover-animation-card" onClick={() => navigate(`/listing/${listing.id}`)}>
            <div 
                className="overlay-actions hover-show top-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Link 
                    className="overlay-action-item hover"
                    to={`/listing/${listing.id}`}
                >
                    <i className="fa-solid fa-eye fa-lg"></i>
                </Link>
                <div className="devider"/>
                {activePage === "my-listings" && (
                    <>
                        <Link 
                            className="overlay-action-item hover"
                            to={`/secure/listing/edit/${listing.id}`}
                        >
                            <i className="fa-solid fa-pen-to-square fa-lg"></i>
                        </Link>
                        <div className="devider"/>
                        <div 
                            className="overlay-action-item red-hover" 
                            onClick={() => {
                                const confirmed = window.confirm(t(`confirms.deleteListing`, { ns: 'messages' }));
                                if (confirmed) {
                                    deleteListing(listing.id, notificateFromRes);
                                }
                            }} 
                        >
                            <i className="fa-solid fa-trash fa-lg"></i>
                        </div>
                    </>
                )}
                {activePage === "favorites" && (
                    <div 
                        className="overlay-action-item hover"
                        onClick={() => toggleFavorite(listing.id, setFavorite, isFavorite)}
                    >
                        <i 
                            className={`${isFavorite ? 'fa-solid active' : 'fa-regular'} fa-heart like`} 
                        ></i>
                    </div>
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