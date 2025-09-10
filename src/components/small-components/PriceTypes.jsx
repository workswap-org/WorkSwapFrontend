import { useTranslation } from 'react-i18next';

const PriceTypes = ({ listing }) => {

    const { t } = useTranslation('common')

    if (!listing) return <span className="price">Цена не указана</span>;

    const priceTypePlaceholder = t(`priceTypes.${listing.priceType}`, { ns: 'common' })

    switch (listing.priceType) {
        case "negotiable":
            return <span className="price">{priceTypePlaceholder}</span>;

        default:
            return (
                <span className="price" id="listingCardPrice">
                    {listing.price || 0} {priceTypePlaceholder}
                </span>
            );
    }
};

export default PriceTypes;