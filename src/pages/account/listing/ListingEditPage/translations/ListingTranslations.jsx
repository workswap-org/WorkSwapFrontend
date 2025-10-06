import { useEffect, useState } from "react";
import { apiFetch } from "@core/lib/services/apiClient";
import { useTranslation } from 'react-i18next';
import TranslationModal from "./TranslationModal";
import TranslationsStatus from "./TranslationsStatus";

const ListingTranslations = ({ id, onChange }) => {

    const { t } = useTranslation('common');

    const [initialized, setInitialized] = useState(false);

    const [translations, setTranslations] = useState({});
    const [currentLang, setCurrentLang] = useState("");
    const [langs, setLangs] = useState([]);

    useEffect(() => {
        if (initialized) {
            onChange?.(translations);
        }
    }, [translations, initialized, onChange]);

    useEffect(() => {
        async function loadLanguages() {
            const data = await apiFetch("/api/settings/languages")
            setLangs(data.langs);
        }

        async function loadListingTranslations() {
            const data = await apiFetch(`/api/listing/translations/${id}`);
            if (data.translations) {
                setTranslations(data.translations);
            }
            setInitialized(true); // включаем после загрузки
        }

        loadListingTranslations();
        loadLanguages();
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