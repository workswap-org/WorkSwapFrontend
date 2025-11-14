import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getListingById } from "@core/lib";
import { useParams } from "react-router-dom";
import ListingSettingsMenu from './menus/ListingSettingsMenu';
import ListingAnalyticMenu from './menus/ListingAnalyticMenu';
import ListingMessagesMenu from './menus/ListingMessagesMenu';

export const ListingMenu = Object.freeze({
    SETTINGS: "SETTINGS",
    ANALYTICS: "ANALYTICS",
    MESSAGES: "MESSAGES"
});
const ListingManagePage = () => {

    const { t } = useTranslation('common');

    const [listing, setListing] = useState(null);
    const { id } = useParams();

    const [currentMenu, setCurrentMenu] = useState(ListingMenu.SETTINGS);

    useEffect(() => {
    
        async function loadListing() {
            const data = await getListingById(id);
            console.log(data);
            setListing(data);
        }

        loadListing();
    }, [id]);

    const renderMenuContent = () => {
        if (!listing) return null;

        switch (currentMenu) {
            case "SETTINGS":
                return <ListingSettingsMenu listing={listing} />;

            case "ANALYTICS":
                return <ListingAnalyticMenu />;

            case "MESSAGES":
                return <ListingMessagesMenu />;

            default:
                return null;
        }
    };


    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.listingEdit`, { ns: 'common' })}</h2>
                {listing?.temporary ? (
                    <p>({t(`statuses.draft`, { ns: 'common' })})</p>
                ) : (
                    <p>({t(`statuses.published`, { ns: 'common' })})</p>
                )} 
            </div>

            <div className="listing-manage-page">
                <div className="listing-manage-menus">
                    {Object.values(ListingMenu).map((menu) => (
                        <button
                            key={menu}
                            className={`listing-manage-menu-item hover ${menu == currentMenu ? "active" : ""}`}
                            onClick={() => setCurrentMenu(menu)}
                        >
                            {t(`listingManage.menus.${menu}`)}
                        </button>
                    ))}
                </div>
                <div className="listing-settings">
                    {renderMenuContent()}
                </div>
            </div>
        </>
    );
};

export default ListingManagePage;