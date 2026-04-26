import { useCallback, } from "react";
import ListingSetting from "../ListingSetting/ListingSetting";
import { IFullListing } from "@core/lib/types/models/listing";
import CategorySelector from "@/components/ui/selectors/CategorySelector";
import { useI18n } from "@core/lib/contexts/I18nContext";

const ServiceSettings = ({
    updateListing,
    listing
}: {
    updateListing: (updates: Record<string, any>) => void
    listing: IFullListing
}) => {

    const { dict } = useI18n();

    const categoryChange = useCallback((lastId: number, path: number[]) => {
        console.log("[C] Последний выбранный:", lastId);
        console.log("[C] Путь:", path);
        updateListing({ category: lastId });
    }, [updateListing]);

    return (
        <>
            <h2 className="two-columns-grid">{dict.common.labels.settings.service}</h2>
            <ListingSetting title={dict.common.labels.category}>
                <CategorySelector listing={listing} onChange={categoryChange} />
            </ListingSetting>
        </>
    );
};

export default ServiceSettings;