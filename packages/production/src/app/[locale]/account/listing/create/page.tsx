"use client"

import { listingPublicTypes, ListingPublicTypeValue } from "@core/lib/constants/listingTypes";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { listingService } from "@core/lib/services/listing";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import accountStyles from "@/app/[locale]/account/AccountLayout.module.scss"

export default function ListingCreatePage() {

    const { notificate } = useNotification();
    const [listingType, setListingType] = useState<ListingPublicTypeValue | null>(null);
    const { dict } = useI18n();
    const productTypes = listingPublicTypes.filter(t => t.key.startsWith("PRODUCT"));
    const serviceTypes = listingPublicTypes.filter(t => t.key.startsWith("SERVICE"));
    const miscTypes = listingPublicTypes.filter(t => !t.key.startsWith("SERVICE") && !t.key.startsWith("PRODUCT"));

    return (
        <>
            <div className={`${accountStyles.accountHeader} flex-row`}>
                <div className='mobile-actions media-only-flex'>
                    <Link href='/account/my-listings' className='back-link-arrow'>
                        <div><i className={`fa-regular fa-arrow-left fa-lg`}></i></div>
                    </Link>
                </div>
                <h2>{dict.common.titles.listingCreate}</h2>
            </div>
            <div className="listing-create-container">
                <h3>{dict.common.listingCreate.selectType}</h3>

                <div className="listing-create-type-selector">
                    <div className="section">
                        <h2>{dict.categories.listingType.SERVICE}</h2>
                        {serviceTypes.map((type) => (
                            <button 
                                key={type.key}
                                className={`btn btn-${listingType == type.key ? "" : "outline-"}primary`}
                                onClick={() => setListingType(type.key)}
                            >
                                {dict.categories.listingType.create[type.key]}
                            </button>
                        ))}
                    </div>
                    <div className="section">
                        <h2>{dict.categories.listingType.PRODUCT}</h2>
                        {productTypes.map((type) => (
                            <button 
                                key={type.key}
                                className={`btn btn-${listingType == type.key ? "" : "outline-"}primary`}
                                onClick={() => setListingType(type.key)}
                            >
                                {dict.categories.listingType.create[type.key]}
                            </button>
                        ))}
                    </div>
                    
                    <div className="section">
                        <h2>{dict.categories.listingType.misc}</h2>
                        {miscTypes.map((type) => (
                            <button 
                                key={type.key}
                                className={`btn btn-${listingType == type.key ? "" : "outline-"}primary`}
                                onClick={() => setListingType(type.key)}
                            >
                                {dict.categories.listingType.create[type.key]}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    className="btn btn-success"
                    onClick={() => listingService.create(String(listingType))
                        .then(data => {
                            notificate(dict.messages.notification.success.createDraft, "success");
                            redirect(`/account/listing/edit/${data}`);
                        })
                        .catch(() => notificate(dict.messages.notification.misc.error.listingCreate, "error"))}
                    disabled={!listingType}
                >
                    {dict.buttons.listing.createListing}
                </button>
            </div>
        </>
    );
}