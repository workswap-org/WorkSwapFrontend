import { useEffect, useMemo, useState } from "react";
import ListingInfo from "./ListingInfo";
import TranslationsStatus from "./TranslationsStatus";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { IListingTranslation } from "@core/lib/types/models/listing";
import { supportedLanguages } from "@core/lib/constants/languages";
import { listingService } from "@core/lib/services/listingService";
import { useI18n } from "@core/lib/contexts/I18nContext";

const ListingTranslations = ({ id }: {id: number | null}) => {

    const { dict } = useI18n();

    const { notificate } = useNotification();

    const [initialized, setInitialized] = useState(false);

    const [loading, setLoading] = useState(true);
    const [translations, setTranslations] = useState<IListingTranslation | null>(null);
    const [currentLang, setCurrentLang] = useState("undetected");
    const [langs, setLangs] = useState<string[]>([]);
    const unusedLanguages = useMemo<string[]>(() => {
        return supportedLanguages.filter((l: string) => !langs.includes(l)) ?? supportedLanguages
    }, [langs])

    useEffect(() => {
        if (initialized && id && translations) {
            listingService.modifyTranslations(id, translations)
                .then((data: string[]) => {
                    setLangs(data)
                })
                .catch(() => notificate(dict.messages.notification.error.listingUpdate, "error"));
        }
    }, [translations, initialized, id, notificate]);

    useEffect(() => {
        if (!id) return
        listingService.getTranslations(id).then((data: IListingTranslation) => {
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
                            <span>{dict.common.languages[lang]}</span>
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
                            <button key={l} onClick={() => setCurrentLang(l)}>{dict.common.languages[l]}</button>
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