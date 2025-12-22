import { useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { LocationSelector } from "@/components";
import { 
    IFullListing,
    modifyListing, 
    useNotification
} from "@core/lib";
import ListingEditActions from "./ListingEditActions.jsx";
import ListingImagesUploader from "./ListingImagesUploader.js";
import ListingTranslations from "./translations/ListingTranslations.tsx";
import EventSettings from "./settings/EventSettings.tsx";
import ProductSettings from "./settings/ProductSettings.tsx";
import ServiceSettings from "./settings/ServiceSettings.tsx";
import PriceEdit from "./PriceEdit.jsx";
import ListingSetting from "./ListingSetting.jsx";

const disabledTypesForPrice = ["PRODUCT_SWAP", "PRODUCT_GIVEAWAY", "PRODUCT_WANTED_FREE"];

const ListingSettingsMenu = ({listing}: {listing: IFullListing}) => {
    
    const { t } = useTranslation('common');

    const {notificate} = useNotification();

    const [isActive, setActive] = useState(listing?.active);
    
    const updateListing = useCallback(async (updates: Record<string, any>) => {
        if (!listing.id || updates === undefined) return;
        modifyListing(listing.id, updates)
            .catch(() => notificate(t(`notification.error.listingUpdate`, { ns: 'messages' }), "error"))
    }, [listing, notificate, t]);

    // locationChange (у тебя уже был)
    const locationChange = useCallback((lastId: number, path: number[]) => {
        console.log("[L] Последний выбранный:", lastId);
        console.log("[L] Путь:", path);
        updateListing({ location: lastId });
    }, [updateListing]);

    return listing ? (
        <>
            <h2>{t(`labels.settings.main`, { ns: 'common' })}</h2>
            <ListingSetting title={t(`labels.translations`, { ns: 'common' })}>
                <div className="form-group">
                    <ListingTranslations id={listing.id} />
                </div>
            </ListingSetting>

            <ListingSetting title={t(`labels.status.listing`, { ns: 'common' })}>
                <div className="form-group">
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
                    {listing?.temporary ? (
                        <p>({t(`statuses.draft`, { ns: 'common' })})</p>
                    ) : (
                        <p>({t(`statuses.published`, { ns: 'common' })})</p>
                    )} 
                </div>
            </ListingSetting>

            {listing && !disabledTypesForPrice.includes(listing.publicType) &&
                <ListingSetting title={t(`labels.price`, { ns: 'common' })}>
                    <PriceEdit listing={listing} updateListing={updateListing}/>
                </ListingSetting>
            }

            <ListingSetting title={t(`labels.location`, { ns: 'common' })}>
                <LocationSelector locationId={listing.locationId} onChange={locationChange} />
            </ListingSetting>

            <ListingSetting title={t(`labels.images`, { ns: 'common' })}>
                <ListingImagesUploader updateListing={updateListing} listing={listing}/>
            </ListingSetting>

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
        </>
    ) : (
        <></>
    );
};

export default ListingSettingsMenu;