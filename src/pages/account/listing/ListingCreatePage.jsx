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
    const { notificate } = useNotification();
    const [listingType, setListingType] = useState(null);
    const { t } = useTranslation('categories');
    const productTypes = listingTypes.filter(t => t.key.startsWith("PRODUCT"));
    const serviceTypes = listingTypes.filter(t => t.key.startsWith("SERVICE"));
    const miscTypes = listingTypes.filter(t => !t.key.startsWith("SERVICE") && !t.key.startsWith("PRODUCT"));

    const createL = useCallback(async (listingType) => {
        try {
            const data = await createListing(listingType);

            if (!data.newListingId) {
                throw new Error(t(`notification.misc.error.listingCreate`, { ns: 'messages' }));
            }

            notificate(t(`notification.success.createDraft`, { ns: 'messages' }), "success");

            navigate(`/account/listing/edit/${data.newListingId}`, { replace: true });
        } catch (err) {
            console.error(err);
            notificate(t(`notification.misc.error.listingCreate`, { ns: 'messages' }), "error");
        }
    }, [navigate, notificate, t]);

    return (
        <>
            <div className="account-header">
                <div className='flex-row'>
                    <div className='mobile-actions media-only-flex'>
                        <Link to='/account/my-listings' className='back-link-arrow'>
                            <div><i className={`fa-regular fa-arrow-left fa-lg`}></i></div>
                        </Link>
                    </div>
                    <h2>{t(`titles.listingCreate`, { ns: 'common' })}</h2>
                </div>
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