import PriceTypes from "@/components/small-components/PriceTypes";
import ListingRating from "@/components/small-components/ListingRating";
import { useNavigate } from "react-router-dom";

const PublicListingCard = ({listing, isMainListing}) => {

    const navigate = useNavigate();
    
    if (listing.testMode || isMainListing || listing.temporary) return null;

    return (
        <article onClick={() => navigate(`/listing/${listing.id}`)} className="listing-card hover-animation-card">
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
                        <ListingRating listing={listing} />
                    </div>
                    {/* <span className="partner-sign" th:if="${listing.author.role.name() == 'BUSINESS'}" th:text="#{partner}"></span> */}
                    <span className="listing-location">{listing.location}</span>
                </div>
            </div>
        </article>
    );
};

export default PublicListingCard;