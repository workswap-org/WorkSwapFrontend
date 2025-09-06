
import { useNavigate } from "react-router-dom";
const ListingDraftItem = ( { listing } ) => {

    const navigate = useNavigate();

    return (
        <article className="draft-listing-card" onClick={() => navigate(`/secure/listing/edit/${listing.id}`)}>
            <img 
                src={listing.imagePath || "/images/default-listing.png"}
                className="draft-listing-card-img"
            />
            <div className="draft-listing-card-body">
                {listing.localizedTitle ? (
                    <span>{listing.localizedTitle}</span>
                ) : (
                    <span>Нет названия</span>
                )}
            </div>
        </article>
    );
};

export default ListingDraftItem;