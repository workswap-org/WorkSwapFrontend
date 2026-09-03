import { useI18n } from '@core/lib/common/contexts/I18nContext';
import { useNotification } from '@core/lib/notification/NotificationContext';
import { listingService } from '@core/lib/listing/services';
import { IFullListing } from '@core/lib/listing/types';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const ListingEditActions = ({listing}: {listing: IFullListing}) => {

    const { dict } = useI18n();
    const { notificate } = useNotification();

    return (
        <>
            <button 
                onClick={() => {
                    const confirmed = window.confirm(dict.messages.confirms.deleteListing);
                    if (confirmed) {
                        listingService.deleteListing(listing.id)
                            .then(() => notificate(dict.messages.notification.success.listingDelete, "success"))
                            .catch(() => notificate(dict.messages.notification.error.listingDelete, "error"));
                        redirect(`/account/my-listings`);
                    }
                }}
                type="button" 
                className="btn btn-outline-primary"
            >
                {dict.buttons.listing[listing.temporary ? "cleanDraft" : "delete"]}
            </button>
            
            <Link
                href="/account/my-listings" 
                type="button" 
                className="btn btn-outline-primary"
            >
                {dict.buttons.listing.goToMyListings}
            </Link>

            {listing.temporary && (
                <button 
                    onClick={() => listingService.publish(listing.id)
                        .then(() => {
                            notificate(dict.messages.notification.success.publish, "success");
                            redirect(`/account/my-listings`)
                        })
                    } 
                    type="button" 
                    className="btn btn-primary"
                >
                    {dict.buttons.listing.publish}
                </button>
            )}
        </>
    );
};

export default ListingEditActions;