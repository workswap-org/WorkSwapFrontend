import { IEventPageRequest, IFullListing, IListingPageRequest, IShortListing } from '@core/lib';
import { useTranslation } from 'react-i18next';

interface Props {
    listing: IFullListing | IShortListing | IListingPageRequest | IEventPageRequest;
    className?: string;
}

const PriceTypes = ({ listing, className = "" }: Props) => {

    const { t } = useTranslation('common')

    if (!listing) return <span className={`price ${className}`} >Цена не указана</span>;

    const priceTypePlaceholder = t(`priceTypes.${listing.priceType ? listing.priceType : 'FIXED'}`, { ns: 'common' })

    switch (listing.priceType) {
        case "NEGOTIABLE":
            return <span className={`price ${className}`}>{priceTypePlaceholder}</span>;

        case "SWAP":
            return <span className={`price ${className}`}>{priceTypePlaceholder}</span>;

        case "FREE":
            return <span className={`price ${className}`}>{priceTypePlaceholder}</span>;

        case "WANTED_FREE":
            return <span className={`price ${className}`}>{priceTypePlaceholder}</span>;

        default:
            return (
                <span className={`price ${className}`} id="listingCardPrice">
                    {listing.price || 0} {priceTypePlaceholder}
                </span>
            );
    }
};

export default PriceTypes;