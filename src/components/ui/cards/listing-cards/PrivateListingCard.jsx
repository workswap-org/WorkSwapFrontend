import { PriceTypes } from "@core/components";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const PrivateListingCard  = ({listing}) => {

    const { t } = useTranslation(['common', 'buttons'])

    const navigate = useNavigate();

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
            <img 
                src={listing.imagePath || `/images/default-listing.svg`}
                onError={(e) => { e.currentTarget.src = `/images/default-listing.svg`; }}
                alt="Изображение объявления"
            />

            <div className="listing-card_body">
                <h3 className="listing-card_title">{listing.localizedTitle}</h3>
                <div className="listing-card_footer">
                    <div>
                        <PriceTypes listing={listing} />
                        <div className="listing-card_views">
                            <span>{t(`labels.views`, { ns: 'common' })}: </span>
                            <span>{listing.views}</span>
                        </div>
                    </div>
                </div>
                <Link
                    className="btn btn-primary"
                    to={`/account/listing/edit/${listing.id}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div><i className="fa-solid fa-gear fa-lg"></i></div>
                    {t('listing.manage', { ns: 'buttons' } )}
                </Link>
            </div>
        </article>
    );
};

export default PrivateListingCard;