import { useEffect, useState } from "react";

import {
    getSupportedPriceTypes,
} from "@core/lib";
import { useTranslation } from 'react-i18next';

const disabledTypes = ["PRODUCT_SWAP", "PRODUCT_GIVEAWAY", "PRODUCT_WANTED_FREE"];

const PriceEdit = ({ listing, updateListing }) => {

    const { t } = useTranslation('common');

    const [priceTypes, setPriceTypes] = useState([])

    const [price, setPrice] = useState(listing?.price || "");
    const [selectedPriceType, setSelectedPriceType] = useState("");

    useEffect(() => {
    
        async function loadPriceTypes() {
            const data = await getSupportedPriceTypes();
            setPriceTypes(data.priceTypes);
        }

        loadPriceTypes();
    }, [])

    useEffect(() => {

        if (!listing) return;
        setPrice(listing.price);
        setSelectedPriceType(listing.priceType?.toUpperCase());

    }, [listing]);

    if (!listing || disabledTypes.includes(listing.publicType)) {
        return null;
    }

    return (
        <div className="form-group">
            <label htmlFor="price">{t(`labels.price`, { ns: 'common' })}</label>
            <div className="duo">
                {(selectedPriceType != 'NEGOTIABLE' && selectedPriceType != 'SWAP') && (
                    <input
                        className="form-control first"
                        type="number"
                        id="price"
                        name="price"
                        value={price ?? ""}
                        onChange={(e) => {
                            setPrice(e.target.value);
                            updateListing({ price: e.target.value });
                        }}
                        step="0.01"
                        required
                    />
                )}
                <select
                    id="priceType"
                    name="priceType"
                    className={`form-control ${(selectedPriceType != 'NEGOTIABLE' && selectedPriceType != 'SWAP') ? 'second' : ''}`}
                    required
                    value={selectedPriceType ?? ""}
                    onChange={(e) => {
                        setSelectedPriceType(e.target.value);
                        updateListing({ priceType: e.target.value });
                    }}
                >
                    <option value="" disabled>{t(`placeholders.priceType`, { ns: 'common' })}</option>
                    {priceTypes.map((type) => (
                        <option key={type.name} value={type.name}>
                            {t(`priceTypes.${type.displayName}`, { ns: 'common' })}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PriceEdit;