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
    const { notificate, notificateFromRes} = useNotification();
    const navigate = useNavigate();

    async function publishL() {
        const res = await publishListing(listing.id);
        if (res.ok) {
            notificate(t(`notification.success.publish`, { ns: 'messages' }), "success");
            navigate(`/account/my-listings`);
        }
    }

    return (
        <>
            <button 
                onClick={() => {
                    const confirmed = window.confirm(t(`confirms.deleteListing`, { ns: 'messages' }));
                    if (confirmed) {
                        deleteListing(listing.id, notificateFromRes);
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
                    onClick={() => publishL()} 
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