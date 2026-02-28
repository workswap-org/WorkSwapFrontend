import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@core/components';
import { IListingTranslation } from '@core/lib';

interface ListingInfoProps {
    currentLang: string
    translations: IListingTranslation | null
    setTranslations: Dispatch<SetStateAction<IListingTranslation | null>>
}
const ListingInfo = ({
    currentLang,
    translations,
    setTranslations
}: ListingInfoProps) => {

    const { t } = useTranslation('common');

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAddLanguage = () => {
        var key: string;
        if (currentLang) {
            key = currentLang;
        } else {
            key = 'undetected';
        }

        const updated = {
            ...translations,
            [key]: { title, description },
        };

        setTranslations(updated);
    };

    useEffect(() => {
        if (currentLang && translations) {
            setTitle(translations[currentLang]?.title || "");
            setDescription(translations[currentLang]?.description || "");
        }
    }, [currentLang, translations])

    return (
        <>
            <label className='form-group'>
                {t(`labels.title`, { ns: 'common' })}{currentLang != 'undetected' && ` (${t("languages." + currentLang)})`}:
                <input
                    type="text"
                    value={title}
                    maxLength={250}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t(`placeholders.listing.title`, { ns: 'common' })}  
                />
            </label>

            <label className='form-group' id="listingDescription">
                {t(`labels.description`, { ns: 'common' })}{currentLang != 'undetected' && ` (${t("languages." + currentLang, { ns: 'common' })})`}:
                <textarea
                    id="listingDescriptionTxt"
                    rows={4}
                    value={description}
                    maxLength={1900}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("placeholders.listing.description", { ns: 'common' })}
                />
            </label>

            <button type="button" className="btn btn-primary" onClick={handleAddLanguage}>
                {t(`listing.saveTranslation`, { ns: 'buttons' })}
            </button>
        </>
    );
};

export default ListingInfo;