import { useI18n } from '@core/lib/common/contexts/I18nContext';
import { IListingTranslation } from '@core/lib/listing/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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

    const { dict } = useI18n();

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
                {dict.common.labels.title}{currentLang != 'undetected' && ` (${dict.common.languages[currentLang]})`}:
                <input
                    type="text"
                    value={title}
                    maxLength={250}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={dict.common.placeholders.listing.title}  
                />
            </label>

            <label className='form-group' id="listingDescription">
                {dict.common.labels.description}{currentLang != 'undetected' && ` (${dict.common.languages[currentLang]})`}:
                <textarea
                    id="listingDescriptionTxt"
                    rows={4}
                    value={description}
                    maxLength={1900}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={dict.common.placeholders.listing.description}
                />
            </label>

            <button type="button" className="btn btn-primary" onClick={handleAddLanguage}>
                {dict.buttons.listing.saveTranslation}
            </button>
        </>
    );
};

export default ListingInfo;