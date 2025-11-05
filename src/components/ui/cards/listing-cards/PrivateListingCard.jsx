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

    const navigator = () => {
        if (listing.type == "EVENT") {
            navigate(`/event/${listing.id}`)
        } else {
            navigate(`/listing/${listing.id}`)
        }
    }

    return (
        <article className="listing-card hover-animation-card" onClick={() => navigator()}>
            <div 
                className="overlay-actions hover-show top-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div 
                    className="overlay-action-item hover"
                    onClick={() => navigator()}
                >
                    <i className="fa-solid fa-eye fa-lg"></i>
                </div>
                <div className="devider"/>
                {activePage === "my-listings" && (
                    <>
                        <Link 
                            className="overlay-action-item hover"
                            to={`/account/listing/edit/${listing.id}`}
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
                onError={(e) => { e.currentTarget.src = `/images/default-listing.svg`; }}
                alt="Изображение объявления"
            />

            <div className="body">
                <h3 className="title">{listing.localizedTitle}</h3>
                {/* <p className="text">{listing.localizedDescription}</p> */}
                <div className="footer">
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