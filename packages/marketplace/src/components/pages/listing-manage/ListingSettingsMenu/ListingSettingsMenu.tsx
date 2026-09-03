import { useState, useCallback } from "react";
import ListingEditActions from "./ListingEditActions";
import ListingImagesUploader from "./ListingImagesUploader/ListingImagesUploader";
import ListingTranslations from "./translations/ListingTranslations/ListingTranslations";
import EventSettings from "./settings/EventSettings";
import ProductSettings from "./settings/ProductSettings";
import ServiceSettings from "./settings/ServiceSettings";
import PriceEdit from "./PriceEdit";
import ListingSetting from "./ListingSetting/ListingSetting";
import { IFullListing } from "@core/lib/listing/types";
import { useNotification } from "@core/lib/notification/NotificationContext";
import { listingService } from "@core/lib/listing/services";
import { useI18n } from "@core/lib/common/contexts/I18nContext";
import LocationSelector from "@/components/ui/selectors/LocationSelector";
import SliderCheckbox from "@core/components/common/checkbox/SliderCheckbox/SliderCheckbox";

const disabledTypesForPrice = ["PRODUCT_SWAP", "PRODUCT_GIVEAWAY", "PRODUCT_WANTED_FREE"];

const ListingSettingsMenu = ({listing}: {listing: IFullListing}) => {
    
    const { dict } = useI18n();

    const { notificate } = useNotification();

    const [isActive, setActive] = useState<boolean>(listing?.active || false);
    
    const updateListing = useCallback(async (updates: Record<string, any>) => {
        if (!listing.id || updates === undefined) return;
        listingService.modify(listing.id, updates)
            .catch(() => notificate(dict.messages.notification.error.listingUpdate, "error"))
    }, [listing, notificate]);

    // locationChange (у тебя уже был)
    const locationChange = useCallback((lastId: number, path: number[]) => {
        console.log("[L] Последний выбранный:", lastId);
        console.log("[L] Путь:", path);
        updateListing({ location: lastId });
    }, [updateListing]);

    return listing ? (
        <>
            <h2>{dict.common.labels.settings.main}</h2>
            <ListingSetting title={dict.common.labels.translations}>
                <div className="form-group">
                    <ListingTranslations id={listing.id} />
                </div>
            </ListingSetting>

            <ListingSetting title={dict.common.labels.status.listing}>
                <div className="form-group">
                    <SliderCheckbox
                        checked={isActive}
                        onChange={(e) => {
                            setActive(e.target.checked);
                            updateListing({ active: e.target.checked });
                        }}
                        options={{
                            checked: <p>{dict.common.statuses.active}</p>, 
                            unchecked: <p>{dict.common.statuses.inactive}</p>
                        }}
                        id="listingActive"
                    />
                    <div className="form-group">
                        {listing?.temporary ? (
                            <p>({dict.common.statuses.draft})</p>
                        ) : (
                            <p>({dict.common.statuses.published})</p>
                        )} 
                    </div>
                </div>
            </ListingSetting>

            {listing && !disabledTypesForPrice.includes(listing.publicType ?? "") &&
                <ListingSetting title={dict.common.labels.price}>
                    <PriceEdit listing={listing} updateListing={updateListing}/>
                </ListingSetting>
            }

            <ListingSetting title={dict.common.labels.location}>
                <LocationSelector locationId={listing.locationId} onChange={locationChange} />
            </ListingSetting>

            <ListingSetting title={dict.common.labels.images}>
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