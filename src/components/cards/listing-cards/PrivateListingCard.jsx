import PriceTypes from "@/components/small-components/PriceTypes";
import { useActivePage } from "@/contexts/active-page/useActivePage";
import { Link } from "react-router-dom";

const PrivateListingCard  = ({listing}) => {

    const activePage = useActivePage();

    return (
        <article className="listing-card hover-animation-card">
            <img 
                src={listing.imagePath || "/images/default-listing.png"}
                className="listing-img" 
                alt="Изображение объявления"/>

            <div className="listing-card-body">
                <h3 className="listing-card-title">{listing.localizedTitle}</h3>
                <p className="listing-card-text">{listing.localizedDescription}</p>
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
                <div className="listing-actions">
                    <Link 
                        className="btn btn-sm btn-outline-primary"
                        to={`/secure/listing/edit/${listing.id}`}
                    >
                        Редактировать
                    </Link>

                    {activePage === "my-listings" && (
                        <button className="btn btn-sm btn-outline-danger">Удалить</button>
                    )}
                    {activePage === "favorites" && (
                        <button className="btn btn-sm btn-outline-danger">Убрать из избранных</button>
                    )}
                </div>
            </div>
        </article>
    );
};

export default PrivateListingCard;