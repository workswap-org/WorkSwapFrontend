import { useTranslation } from 'react-i18next';

const PriceTypes = ({ listing, className = "" }) => {

    const { t } = useTranslation('common')

    if (!listing) return <span className={`listing-price ${className}`} >Цена не указана</span>;

    const priceTypePlaceholder = t(`priceTypes.${listing.priceType}`, { ns: 'common' })

    switch (listing.priceType) {
        case "negotiable":
            return <span className={`listing-price ${className}`}>{priceTypePlaceholder}</span>;

        default:
            return (
                <span className={`listing-price ${className}`} id="listingCardPrice">
                    {listing.price || 0} {priceTypePlaceholder}
                </span>
            );
    }
};

export default PriceTypes;