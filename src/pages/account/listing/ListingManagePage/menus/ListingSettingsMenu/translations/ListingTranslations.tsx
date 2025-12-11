import { useEffect, useMemo, useState } from "react";
import { getListingTranslations, IListingTranslation, modifyListingTranslations, supportedLanguages, useNotification } from "@core/lib";
import { useTranslation } from 'react-i18next';
import ListingInfo from "./ListingInfo";
import TranslationsStatus from "./TranslationsStatus";

const ListingTranslations = ({ id }: {id: number | null}) => {

    const { t } = useTranslation(['common', 'messages']);

    const { notificate } = useNotification();

    const [initialized, setInitialized] = useState(false);

    const [loading, setLoading] = useState(true);
    const [translations, setTranslations] = useState<IListingTranslation | null>(null);
    const [currentLang, setCurrentLang] = useState("undetected");
    const [langs, setLangs] = useState<string[]>([]);
    const unusedLanguages = useMemo<string[]>(() => {
        return supportedLanguages.filter(l => !langs.includes(l)) ?? supportedLanguages
    }, [langs])

    useEffect(() => {
        if (initialized) {
            modifyListingTranslations(id, translations)
                .then(data => {
                    setLangs(data)
                })
                .catch(() => notificate(t(`notification.error.listingUpdate`, { ns: 'messages' }), "error"));
        }
    }, [translations, initialized, id, notificate, t]);

    useEffect(() => {
        getListingTranslations(id).then(data => {
            setTranslations(data);
            const firstLang = Object.keys(data)[0];
            setLangs(Object.keys(data))
            if (firstLang) setCurrentLang(firstLang)
            setLoading(false);
            setInitialized(true)
        })
    }, [id]);

    return (
        <div className="translation-editor">
            {langs.length > 0 && (
                <div className="lang-cards">
                    {langs.map((lang) => (
                        <div 
                            key={lang} 
                            className={`lang-card hover ${currentLang == lang ? "active" : ""}`} 
                            onClick={() => setCurrentLang(lang)}
                        >
                            <span>{t(`languages.${lang}`, { ns: 'common' })}</span>
                            <TranslationsStatus lang={lang} translations={translations}/>
                        </div>
                    ))}
                    {unusedLanguages.length > 0 && (
                        <div 
                            className={`lang-card hover ${currentLang == "undetected" ? "active" : ""}`} 
                            onClick={() => setCurrentLang("undetected")}
                        >
                            <span>+ Добавить язык</span>
                        </div>
                    )}
                </div>
            )}

            {currentLang == "undetected" && (
                <div className="language-selector">
                    {unusedLanguages.map(l => (
                            <button onClick={() => setCurrentLang(l)}>{t(`languages.${l}`, { ns: 'common' })}</button>
                        ))
                    }
                </div>
            )}

            {!loading && (
                <ListingInfo
                    currentLang={currentLang}
                    translations={translations}
                    setTranslations={setTranslations}
                />
            )}            
        </div>
    );
}

export default ListingTranslations;