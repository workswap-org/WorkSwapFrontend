import { useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { LocationSelector } from "@/components";
import { 
    modifyListing, 
    useNotification
} from "@core/lib";
import ListingEditActions from "./ListingEditActions";
import ListingImagesUploader from "./ListingImagesUploader";
import ListingTranslations from "./translations/ListingTranslations";
import EventSettings from "./settings/EventSettings";
import ProductSettings from "./settings/ProductSettings";
import ServiceSettings from "./settings/ServiceSettings";
import PriceEdit from "./PriceEdit";

const ListingSettingsMenu = ({listing}) => {
    
    const { t } = useTranslation('common');

    const {notificate} = useNotification();

    const [isActive, setActive] = useState(listing?.active);
    
    const updateListing = useCallback(async (updates) => {
        if (!listing.id || updates === undefined) return;
        try {
            await modifyListing(listing.id, updates);
        } catch (err) {
            notificate(t(`notification.error.listingUpdate`, { ns: 'messages' }), "error");
            throw err;
        }
    }, [listing, notificate, t]);

    // locationChange (у тебя уже был)
    const locationChange = useCallback((lastId, path) => {
        console.log("[L] Последний выбранный:", lastId);
        console.log("[L] Путь:", path);
        updateListing({ location: lastId });
    }, [updateListing]);

    return listing ? (
        <div className="edit-listing-form">
            <div className="form-group two-columns-grid">
                <h3>{t(`labels.translations`, { ns: 'common' })}</h3>
                <ListingTranslations id={listing.id} updateListing={updateListing} />
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
                <LocationSelector locationId={listing.locationId} onChange={locationChange} />
            </div>

            <div className="form-group two-columns-grid">
                <ListingImagesUploader updateListing={updateListing} listing={listing}/>
            </div>

            {listing.type == 'EVENT' && (
                <EventSettings listing={listing} updateListing={updateListing}/>
            )}

            {listing.type == 'PRODUCT' && (
                <ProductSettings listing={listing} updateListing={updateListing}/>
            )}

            {listing.type == 'SERVICE' && (
                <ServiceSettings listing={listing} updateListing={updateListing}/>
            )}

            <div className="form-actions two-columns-grid">
                <ListingEditActions
                    listing={listing}
                />
            </div>
        </div>
    ) : (
        <></>
    );
};

export default ListingSettingsMenu;