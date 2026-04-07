"use client";

import { redirect } from 'next/navigation';
import { IFullListing } from '@core/lib/types/models/listing';
import { useI18n } from '@core/lib/contexts/I18nContext';

const ListingDraftItem = ({ listing }: {listing: IFullListing}) => {

    const { dict } = useI18n()

    return (
        <article className="draft-listing-card" onClick={() => redirect(`/account/listing/edit/${listing.id}`)}>
            <img 
                src={listing.imagePath || `/images/placeholders/default-listing.svg`}
                onError={(e) => { e.currentTarget.src = `/images/placeholders/default-listing.svg`; }}
            />
            <div className="body">
                {listing.localizedTitle ? (
                    <span>{listing.localizedTitle}</span>
                ) : (
                    <span>{dict.common.fallbacks.noTitle}</span>
                )}
            </div>
        </article>
    );
};

export default ListingDraftItem;