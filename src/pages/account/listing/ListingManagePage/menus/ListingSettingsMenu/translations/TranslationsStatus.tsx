import { useEffect, useState } from "react";

interface TranslationsStatusProps {
    lang: string;
    translations: Record<string, {title: string, description: string}>;
}
const TranslationsStatus = ({lang, translations}: TranslationsStatusProps) => {

    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        const t = translations?.[lang];
        if (t) {
            if (t.title && t.description) {
                setProgress(100);
            } else if (t.title || t.description) {
                setProgress(50);
            } else {
                setProgress(0);
            }
        }
    }, [lang, translations]);

    return (
        <div className="translation-status">
            <div className="progress-container">
                <i className="fa-regular fa-circle first"></i>
                {progress > 0 && (
                    <i className={`fa-solid ${progress < 100 ? "fa-circle-half" : "fa-circle"} second`}></i>
                )}

                {progress === 100 && (
                    <i className="fa-solid fa-check third"></i>
                )}
            </div>
        </div>
    );
};

export default TranslationsStatus;