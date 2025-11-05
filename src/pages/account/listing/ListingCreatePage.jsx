import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    useNotification,
    createListing,
    listingTypes
} from "@core/lib";
import { useTranslation } from 'react-i18next';

export default function ListingCreatePage() {

    const navigate = useNavigate();
    const { notificate, notificateFromRes } = useNotification();
    const [listingType, setListingType] = useState(null);
    const { t } = useTranslation('categories');
    const productTypes = listingTypes.filter(t => t.key.startsWith("PRODUCT"));
    const serviceTypes = listingTypes.filter(t => t.key.startsWith("SERVICE"));
    const miscTypes = listingTypes.filter(t => !t.key.startsWith("SERVICE") && !t.key.startsWith("PRODUCT"));

    const createL = useCallback(async (listingType) => {
        try {
            const data = await createListing(listingType);

            if (!data.id) {
                throw new Error(t(`notification.misc.error.listingCreate`, { ns: 'messages' }));
            }

            notificateFromRes(data);

            navigate(`/secure/listing/edit/${data.id}`, { replace: true });
        } catch (err) {
            console.error(err);
            notificate(t(`notification.misc.error.listingCreate`, { ns: 'messages' }), "error");
        }
    }, [navigate, notificate, notificateFromRes, t]);

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.listingCreate`, { ns: 'common' })}</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(-1)}
                >
                    <i className="fa-solid fa-left perm-light"></i>
                    {t(`back`, { ns: 'navigation' })}
                </button>
            </div>
            <div className="listing-create-container">
                <h3>{t(`listingCreate.selectType`, { ns: 'common' })}</h3>

                <div className="listing-create-type-selector">
                    <div className="section">
                        <h2>{t(`listingType.SERVICE`, { ns: 'categories' })}</h2>
                        {serviceTypes.map((type) => (
                            <button 
                                key={type.key}
                                className={`btn btn-${listingType == type.key ? "" : "outline-"}primary`}
                                onClick={() => setListingType(type.key)}
                            >
                                {t(`listingType.create.${type.key}`, { ns: 'categories' })}
                            </button>
                        ))}
                    </div>
                    <div className="section">
                        <h2>{t(`listingType.PRODUCT`, { ns: 'categories' })}</h2>
                        {productTypes.map((type) => (
                            <button 
                                key={type.key}
                                className={`btn btn-${listingType == type.key ? "" : "outline-"}primary`}
                                onClick={() => setListingType(type.key)}
                            >
                                {t(`listingType.create.${type.key}`, { ns: 'categories' })}
                            </button>
                        ))}
                    </div>
                    
                    <div className="section">
                        <h2>{t(`listingType.misc`, { ns: 'categories' })}</h2>
                        {miscTypes.map((type) => (
                            <button 
                                key={type.key}
                                className={`btn btn-${listingType == type.key ? "" : "outline-"}primary`}
                                onClick={() => setListingType(type.key)}
                            >
                                {t(`listingType.create.${type.key}`, { ns: 'categories' })}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    className="btn btn-success"
                    onClick={() => createL(listingType)}
                    disabled={!listingType}
                >
                    {t(`listing.createListing`, { ns: 'buttons' })}
                </button>
            </div>
        </>
    );
}