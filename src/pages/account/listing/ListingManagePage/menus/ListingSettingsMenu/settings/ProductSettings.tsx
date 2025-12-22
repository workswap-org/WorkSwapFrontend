import { useCallback, } from "react";
import { useTranslation } from 'react-i18next';

import { CategorySelector } from "@/components";
import ListingSetting from "../ListingSetting";
import { IFullListing } from "@core/lib";

const ProductSettings = ({
    updateListing,
    listing
}: {
    updateListing: (updates: Record<string, any>) => void
    listing: IFullListing
}) => {

    const { t } = useTranslation('common');

    // categoryChange
    const categoryChange = useCallback((lastId: number, path: number[]) => {
        console.log("[C] Последний выбранный:", lastId);
        console.log("[C] Путь:", path);
        updateListing({ category: lastId });
    }, [updateListing]);

    return (
        <>
            <h2 className="two-columns-grid">{t(`labels.settings.product`, { ns: 'common' })}</h2>
            <ListingSetting title={t(`labels.category`, { ns: 'common' })}>
                <CategorySelector listing={listing} onChange={categoryChange} />
            </ListingSetting>
        </>
    );
};

export default ProductSettings;