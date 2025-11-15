import { useEffect, useState } from "react";

import {
    getSupportedPriceTypes,
} from "@core/lib";
import { useTranslation } from 'react-i18next';

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

    return (
        <div className="form-group">
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
                            {t(`priceTypes.${type.name}`, { ns: 'common' })}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PriceEdit;