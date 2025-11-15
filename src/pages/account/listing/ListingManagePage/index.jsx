import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getListingById } from "@core/lib";
import { useParams } from "react-router-dom";
import ListingSettingsMenu from './menus/ListingSettingsMenu';
import ListingAnalyticMenu from './menus/ListingAnalyticMenu';
import ListingMessagesMenu from './menus/ListingMessagesMenu';

export const ListingMenu = Object.freeze({
    SETTINGS: { name: "SETTINGS", icon: "gear" },
    ANALYTICS: { name: "ANALYTICS", icon: "chart-mixed" },
    MESSAGES: { name: "MESSAGES", icon: "message-lines" }
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

        switch (currentMenu.name) {
            case "SETTINGS":
                return <ListingSettingsMenu listing={listing} />;

            case "ANALYTICS":
                return <ListingAnalyticMenu listing={listing}  />;

            case "MESSAGES":
                return <ListingMessagesMenu listing={listing}  />;

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
                            key={menu.name}
                            className={`listing-manage-menu-btn hover ${menu == currentMenu ? "active" : ""}`}
                            onClick={() => setCurrentMenu(menu)}
                        >
                            <div><i className={`fa-regular fa-${menu.icon}`}></i></div>
                            {t(`listingManage.menus.${menu.name}`)}
                        </button>
                    ))}
                </div>
                <div className="listing-menu">
                    {renderMenuContent()}
                </div>
            </div>
        </>
    );
};

export default ListingManagePage;