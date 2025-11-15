import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getListingById } from "@core/lib";
import { useParams } from "react-router-dom";
import ListingSettingsMenu from './menus/ListingSettingsMenu';
import ListingAnalyticMenu from './menus/ListingAnalyticMenu';
import ListingMessagesMenu from './menus/ListingMessagesMenu';
import { SidebarSectionLayout } from '@/components';

export const ListingMenu = Object.freeze({
    SETTINGS: { first: true, name: "SETTINGS", icon: "gear" },
    ANALYTICS: { first: false, name: "ANALYTICS", icon: "chart-mixed" },
    MESSAGES: { first: false, name: "MESSAGES", icon: "message-lines" }
});
const ListingManagePage = () => {

    const { t } = useTranslation('common');
    const { id } = useParams();
    
    const [listing, setListing] = useState(null);

    useEffect(() => {
    
        async function loadListing() {
            const data = await getListingById(id);
            console.log(data);
            setListing(data);
        }

        loadListing();
    }, [id]);

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.listingEdit`, { ns: 'common' })}</h2>
            </div>

            <SidebarSectionLayout
                pageName={'listingManage'}
                sections={ListingMenu}
            >
                {(currentSection) => (
                    currentSection === ListingMenu.SETTINGS ? <ListingSettingsMenu listing={listing} /> :
                    currentSection === ListingMenu.ANALYTICS ? <ListingAnalyticMenu listing={listing} /> :
                    currentSection === ListingMenu.MESSAGES ? <ListingMessagesMenu listing={listing} /> :
                    null
                )}
            </SidebarSectionLayout>
        </>
    );
};

export default ListingManagePage;