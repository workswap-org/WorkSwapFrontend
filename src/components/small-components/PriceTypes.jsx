
// Для локализации можно использовать i18n или простой объект
const priceLabels = {
    negotiable: "Договорная",
    per_hour: "€/ч",
    per_day: "€/день",
    fixed: "€"
};

const PriceTypes = ({ listing }) => {
    if (!listing) return <span className="price">Цена не указана</span>;

    switch (listing.priceType) {
        case "negotiable":
            return <span className="price">{priceLabels.negotiable}</span>;

        case "per-hour":
            return (
                <span className="price" id="listingCardPrice">
                    {listing.price || 0} {priceLabels.per_hour}
                </span>
            );

        case "per-day":
            return (
                <span className="price" id="listingCardPrice">
                    {listing.price || 0} {priceLabels.per_day}
                </span>
            );

        case "fixed":
            return (
                <span className="price" id="listingCardPrice">
                    {listing.price || 0} {priceLabels.fixed}
                </span>
            );

        default:
            return <span className="price">Цена не указана</span>;
    }
};

export default PriceTypes;