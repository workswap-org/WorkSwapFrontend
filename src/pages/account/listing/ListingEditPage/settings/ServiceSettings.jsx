import { useCallback, } from "react";
import { useTranslation } from 'react-i18next';

import { CategorySelector } from "@/components";

const ServiceSettings = ({
    updateListing,
    categoryId,
    listing
}) => {

    const { t } = useTranslation('common');

    // categoryChange
    const categoryChange = useCallback((lastId, path) => {
        console.log("[C] Последний выбранный:", lastId);
        console.log("[C] Путь:", path);
        updateListing({ category: lastId });
    }, [updateListing]);

    return (
        <>
            <h2 className="two-columns-grid">{t(`labels.settings.service`, { ns: 'common' })}</h2>
            <div className="form-group">
                <h3>{t(`labels.category`, { ns: 'common' })}</h3>
                <CategorySelector listing={listing} categoryId={categoryId} onChange={categoryChange} />
            </div>
        </>
    );
};

export default ServiceSettings;