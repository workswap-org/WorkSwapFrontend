import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { LocationSelector } from "@/components";
import { 
    modifyListing, 
    useNotification,
    getListingById
} from "@core/lib";
import ListingEditActions from "./ListingEditActions";
import ListingImagesUploader from "./ListingImagesUploader";
import ListingTranslations from "./translations/ListingTranslations";
import EventSettings from "./settings/EventSettings";
import ProductSettings from "./settings/ProductSettings";
import ServiceSettings from "./settings/ServiceSettings";
import PriceEdit from "./PriceEdit";

const ListingEditPage = () => {

    const { t } = useTranslation('common');

    const { id } = useParams();

    const {notificate} = useNotification();

    const [listing, setListing] = useState(null)

    const [saving, setSaving] = useState(false);
    const [locationId, setLocationId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [isActive, setActive] = useState(false);
    
    const updateListing = useCallback(async (updates) => {
        if (!id || updates === undefined) return;
        setSaving(true);
        try {
            await modifyListing(id, updates);
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

        async function loadListing() {
            const data = await getListingById(id);
            setListing(data);
        }

        loadListing();
    }, [id]);

    useEffect(() => {

        if (!listing) return;
        setCategoryId(listing.categoryId);
        setLocationId(listing.locationId);
        setActive(listing.active);

    }, [listing]);

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.listingEdit`, { ns: 'common' })}</h2>
                {saving && (
                    <i className="fa-regular fa-download fa-spin fa-spin-reverse fa-2xl"></i>
                )}
                {listing?.temporary ? (
                    <p>({t(`statuses.draft`, { ns: 'common' })})</p>
                ) : (
                    <p>({t(`statuses.published`, { ns: 'common' })})</p>
                )} 
            </div>
            
            {listing && (
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

                    <PriceEdit listing={listing} updateListing={updateListing}/>

                    <div className="form-group">
                        <h3>{t(`labels.location`, { ns: 'common' })}</h3>
                        <LocationSelector locationId={locationId} onChange={locationChange} />
                    </div>

                    <div className="form-group two-columns-grid">
                        <ListingImagesUploader updateListing={updateListing} listing={listing}/>
                    </div>

                    {listing.type == 'EVENT' && (
                        <EventSettings listing={listing} updateListing={updateListing} setSaving={setSaving}/>
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
            )}
        </>
    );
};

export default ListingEditPage;