import { useCallback, useEffect, useState } from "react";
import { 
    getSupportedLanguages,
    getListingTranslations
} from "@core/lib";
import { useTranslation } from 'react-i18next';
import TranslationModal from "./TranslationModal";
import TranslationsStatus from "./TranslationsStatus";

const ListingTranslations = ({ id, updateListing }) => {

    const { t } = useTranslation('common');

    const [initialized, setInitialized] = useState(false);

    const [translations, setTranslations] = useState({});
    const [currentLang, setCurrentLang] = useState("");
    const [langs, setLangs] = useState([]);

    const translationsChange = useCallback((translation) => {
        console.log("[T] Перевод:", translation);
        updateListing({ translation });
    }, [updateListing]);

    useEffect(() => {
        if (initialized) {
            translationsChange?.(translations);
        }
    }, [translations, initialized, translationsChange]);

    useEffect(() => {
        getSupportedLanguages().then(data => setLangs(data));
        getListingTranslations(id).then(data => {
            if (data) {
                setTranslations(data);
            }
            setInitialized(true)
        })
    }, [id]);

    return (
        <div className="translation-editor">
            <div className="lang-cards">
                {langs.map((lang) => (
                    <div key={lang} className="lang-card hover" onClick={() => setCurrentLang(lang)}>
                        <span>{t(`languages.${lang}`, { ns: 'common' })}</span>
                        <TranslationsStatus lang={lang} translations={translations}/>
                    </div>
                ))}
            </div>

            <TranslationModal
                currentLang={currentLang}
                translations={translations}
                setTranslations={setTranslations}
                setCurrentLang={setCurrentLang}
            />
        </div>
    );
}

export default ListingTranslations;