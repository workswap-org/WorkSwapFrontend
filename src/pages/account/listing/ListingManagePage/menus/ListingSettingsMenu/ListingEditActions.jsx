import { 
    useNotification,
    publishListing,
    deleteListing
} from "@core/lib";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";

const ListingEditActions = ({
    listing,
}) => {

    const { t } = useTranslation('common');
    const { notificate } = useNotification();
    const navigate = useNavigate();

    return (
        <>
            <button 
                onClick={() => {
                    const confirmed = window.confirm(t(`confirms.deleteListing`, { ns: 'messages' }));
                    if (confirmed) {
                        deleteListing(listing.id)
                            .then(notificate(t(`notification.success.listingDelete`, { ns: 'messages' }), "success"))
                            .catch(notificate(t(`notification.error.listingDelete`, { ns: 'messages' }), "error"));
                        navigate(`/account/my-listings`);
                    }
                }}
                type="button" 
                className="btn btn-outline-primary"
            >
                {t(`listing.${listing.temporary ? "cleanDraft" : "delete"}`, { ns: 'buttons' })}
            </button>
            
            <Link 
                to="/account/my-listings" 
                type="button" 
                className="btn btn-outline-primary"
            >
                {t(`listing.goToMyListings`, { ns: 'buttons' })}
            </Link>

            {listing.temporary && (
                <button 
                    onClick={() => publishListing(listing.id)
                        .then(() => {
                            notificate(t(`notification.success.publish`, { ns: 'messages' }), "success");
                            navigate(`/account/my-listings`)
                        })
                    } 
                    type="button" 
                    className="btn btn-primary"
                >
                    {t(`listing.publish`, { ns: 'buttons' })}
                </button>
            )}
        </>
    );
};

export default ListingEditActions;