import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";

const ListingTranslations = ({ id, onChange }) => {
    const [translations, setTranslations] = useState({});
    const [currentLang, setCurrentLang] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showLangButtons, setShowLangButtons] = useState(false);
    const [langs, setLangs] = useState([])

    useEffect(() => {
        async function loadLanguages() {
            const data = await apiFetch("/api/settings/languages")
            setLangs(data.langs);
        }

        async function loadListingTranslations() {
            const data = await apiFetch(`/api/listing/translations/${id}`);
            console.log(data);
            const newTranslations = data.translations.reduce((acc, translation) => {
                const lang = Object.keys(translation)[0];
                acc[lang] = {
                    title: translation[lang].title,
                    description: translation[lang].description,
                };
                return acc;
            }, {});
            console.log(newTranslations);
            setTranslations(newTranslations);
        }

        loadListingTranslations();
        loadLanguages();
    }, [id])

    const handleAddLanguage = () => {
        if (!currentLang) return;

        const updated = {
            ...translations,
            [currentLang]: { title, description },
        };

        setTranslations(updated);
        onChange?.(updated);

        // сбрасываем форму
        setCurrentLang("");
        setTitle("");
        setDescription("");
    };

    const createTranslation = () => {
        setShowLangButtons(!showLangButtons);
    };

    const handleEdit = (lang) => {
        setCurrentLang(lang);
        setTitle(translations[lang]?.title || "");
        setDescription(translations[lang]?.description || "");
    };

    const handleDelete = (lang) => {
        const updated = { ...translations };
        delete updated[lang];
        setTranslations(updated);
        onChange?.(updated);

        if (lang === currentLang) {
            setCurrentLang("");
            setTitle("");
            setDescription("");
        }
    };

    return (
        <div className="translation-editor">
            <div className="lang-cards">
                {Object.keys(translations).map((lang) => (
                    <div key={lang} className="lang-card hover" onClick={() => handleEdit(lang)}>
                        <span>
                            {lang.toUpperCase()}
                        </span>
                        <button
                            className="delete-lang red-hover"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); // предотвращает срабатывание handleEdit
                                handleDelete(lang);
                            }}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                ))}
                <div className="lang-card create hover" onClick={() => createTranslation()}>
                    <span>
                        <i className="fa-solid fa-plus"></i>
                    </span>
                    {showLangButtons && (
                        <div className="lang-options">
                            {langs.map((lang) => (
                                <button
                                    key={lang}
                                    type="button hover"
                                    onClick={() => {
                                        setCurrentLang(lang)
                                        setShowLangButtons(false);
                                    }}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {currentLang && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
                            <label>
                                Заголовок ({currentLang.toUpperCase()}):
                                <input
                                    type="text"
                                    value={title}
                                    maxLength={250}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </label>

                            <label>
                                Описание ({currentLang.toUpperCase()}):
                                <textarea
                                    rows="4"
                                    value={description}
                                    maxLength={1900}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </label>

                            <button type="button" className="btn btn-primary" onClick={handleAddLanguage}>
                                Сохранить перевод
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListingTranslations;