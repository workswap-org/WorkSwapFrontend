import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import {settingService} from "@core/lib/services/settingsService"
import { IFullListing } from "@core/lib/types/models/listing";
import { useI18n } from "@core/lib/contexts/I18nContext";

interface PriceEditProps {
    listing: IFullListing;
    updateListing: (updates: Record<string, any>) => void
}
const PriceEdit = ({ listing, updateListing }: PriceEditProps) => {

    const { dict } = useI18n();

    const [priceTypes, setPriceTypes] = useState([])

    const [price, setPrice] = useState(listing?.price || "");
    const [selectedPriceType, setSelectedPriceType] = useState("");

    useEffect(() => {
    
        async function loadPriceTypes() {
            const data = await settingService.getSupportedPriceTypes();
            setPriceTypes(data);
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
                    <option value="" disabled>{dict.common.placeholders.priceType}</option>
                    {priceTypes.map((type) => (
                        <option key={type} value={type}>
                            {dict.common.priceTypes[type]}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PriceEdit;