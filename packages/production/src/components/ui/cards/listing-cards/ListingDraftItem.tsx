
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { IFullListing } from "@core/lib";

const ListingDraftItem = ({ listing }: {listing: IFullListing}) => {

    const { t } = useTranslation('common')

    const navigate = useNavigate();

    return (
        <article className="draft-listing-card" onClick={() => navigate(`/account/listing/edit/${listing.id}`)}>
            <img 
                src={listing.imagePath || `/images/default-listing.svg`}
                onError={(e) => { e.currentTarget.src = `/images/default-listing.svg`; }}
            />
            <div className="body">
                {listing.localizedTitle ? (
                    <span>{listing.localizedTitle}</span>
                ) : (
                    <span>{t(`fallbacks.noTitle`, { ns: 'common' })}</span>
                )}
            </div>
        </article>
    );
};

export default ListingDraftItem;