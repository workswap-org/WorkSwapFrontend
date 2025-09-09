import PriceTypes from "@/components/small-components/PriceTypes";
import { useActivePage } from "@/hooks/contexts/useActivePage";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/apiClient";

const PrivateListingCard  = ({listing}) => {

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

    return (
        <article className="listing-card hover-animation-card">
            <div className="overlay-actions top right">
                <Link 
                    className="btn btn-sm btn-primary"
                    to={`/secure/listing/edit/${listing.id}`}
                >
                    <i className="fa-solid fa-pen-to-square fa-lg"></i>
                </Link>
                {activePage === "my-listings" && (
                    <button className="btn btn-sm btn-danger">
                        <i className="fa-solid fa-trash fa-lg"></i>
                    </button>
                )}
                {activePage === "favorites" && (
                    <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart fa-2xl like`} onClick={() => toggleFavorite()}></i>
                )}
            </div>
            <img 
                src={listing.imagePath || "/images/default-listing.png"}
                className="listing-img" 
                alt="Изображение объявления"/>

            <div className="listing-card-body">
                <h3 className="listing-card-title">{listing.localizedTitle}</h3>
                {/* <p className="listing-card-text">{listing.localizedDescription}</p> */}
                <div className="listing-card-footer">
                    <div>
                        {/* компонент для отображение цены (с типом) */}
                        <PriceTypes listing={listing} />
                        <div className="listing-card-views">
                            <span>Просмотры: </span>
                            <span>{listing.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PrivateListingCard;