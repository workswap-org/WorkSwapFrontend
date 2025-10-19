import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { LocationSelector } from "@/components";
import { 
    modifyListing, 
    useNotification,
    getSupportedPriceTypes,
    getListingById
} from "@core/lib";
import ListingEditActions from "./ListingEditActions";
import ListingImagesUploader from "./ListingImagesUploader";
import ListingTranslations from "./translations/ListingTranslations";
import EventSettings from "./settings/EventSettings";
import ProductSettings from "./settings/ProductSettings";
import ServiceSettings from "./settings/ServiceSettings";

const ListingEditPage = () => {

    const { t } = useTranslation('common');

    const { id } = useParams();

    const {notificate} = useNotification();

    const [priceTypes, setPriceTypes] = useState([])
    const [listing, setListing] = useState([])

    const [saving, setSaving] = useState(false);
    const [locationId, setLocationId] = useState([]);
    const [categoryId, setCategoryId] = useState([]);
    const [price, setPrice] = useState(listing?.price || "");
    const [selectedPriceType, setSelectedPriceType] = useState("");
    const [isActive, setActive] = useState(false);
    
    const updateListing = useCallback(async (updates) => {
        if (!id || updates === undefined) return;
        setSaving(true);
        try {
            modifyListing(id, updates);
            setSaving(false);
        } catch (err) {
            notificate(t(`notification.error.listingUpdate`, { ns: 'messages' }), "error");
            throw err;
        }
    }, [id, notificate, t]);

    // locationChange (у тебя уже был)
    const locationChange = useCallback((lastId, path) => {
        console.log("[L] Последний выбранный:", lastId);
        console.log("[L] Путь:", path);
        updateListing({ location: lastId });
    }, [updateListing]);

    useEffect(() => {

        async function loadPriceTypes() {
            const data = await getSupportedPriceTypes();
            setPriceTypes(data.priceTypes);
        }

        loadPriceTypes();
    }, [])

    useEffect(() => {

        async function loadListing() {
            const data = await getListingById(id);
            setListing(data.listing);
        }

        loadListing();
    }, [id]);

    useEffect(() => {

        setCategoryId(listing.categoryId);
        setLocationId(listing.locationId);
        setPrice(listing.price);
        setSelectedPriceType(listing.priceType?.toUpperCase());
        setActive(listing.active);

    }, [listing]);

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.listingEdit`, { ns: 'common' })}</h2>
                {saving && (
                    <i className="fa-regular fa-download fa-spin fa-spin-reverse fa-2xl"></i>
                )}
                {listing.temporary ? (
                    <p>({t(`statuses.draft`, { ns: 'common' })})</p>
                ) : (
                    <p>({t(`statuses.published`, { ns: 'common' })})</p>
                )} 
            </div>
            
            <div className="edit-listing-form">

                <div className="form-group two-columns-grid">
                    <h3>{t(`labels.translations`, { ns: 'common' })}</h3>
                    <ListingTranslations id={id} updateListing={updateListing} />
                </div>

                <div className="form-group">
                    <h3>{t(`labels.status.listing`, { ns: 'common' })}</h3>
                    <div className="status-toggle">
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={isActive ?? false}
                                onChange={(e) => {
                                    setActive(e.target.checked);
                                    updateListing({ active: e.target.checked });
                                }}
                                value="true"
                            />
                            <span className="slider"></span>
                        </label>
                        {isActive ? (
                            <p>{t(`statuses.active`, { ns: 'common' })}</p>
                        ) : (
                            <p>{t(`statuses.inactive`, { ns: 'common' })}</p>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="price">{t(`labels.price`, { ns: 'common' })}</label>
                    <div className="duo">
                        {selectedPriceType != 'NEGOTIABLE' && (
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
                            className={`form-control ${selectedPriceType != 'NEGOTIABLE' ? 'second' : ''}`}
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

                <div className="form-group">
                    <h3>{t(`labels.location`, { ns: 'common' })}</h3>
                    <LocationSelector locationId={locationId} onChange={locationChange} />
                </div>

                <div className="form-group two-columns-grid">
                    <ListingImagesUploader updateListing={updateListing} listing={listing}/>
                </div>

                {listing.type == 'EVENT' && (
                    <EventSettings listing={listing} setSaving={setSaving}/>
                )}

                {listing.type == 'PRODUCT' && (
                    <ProductSettings listing={listing} updateListing={updateListing} categoryId={categoryId}/>
                )}

                {listing.type == 'SERVICE' && (
                    <ServiceSettings listing={listing} updateListing={updateListing} categoryId={categoryId}/>
                )}

                <div className="form-actions two-columns-grid">
                    <ListingEditActions
                        listing={listing}
                    />
                </div>
            </div>
        </>
    );
};

export default ListingEditPage;