import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@core/components';

const TranslationModal = ({
    currentLang,
    translations,
    setTranslations,
    setCurrentLang
}) => {

    const { t } = useTranslation('common');

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAddLanguage = () => {
        if (!currentLang) return;

        const updated = {
            ...translations,
            [currentLang]: { title, description },
        };

        setTranslations(updated);

        // сбрасываем форму
        setCurrentLang("");
        setTitle("");
        setDescription("");
    };

    useEffect(() => {
        if (currentLang && translations) {
            setTitle(translations[currentLang]?.title || "");
            setDescription(translations[currentLang]?.description || "");
        }
    }, [currentLang, translations])

    if (!currentLang) return null;

    return (
        <Modal
            isOpen={currentLang}
            onClose={() => setCurrentLang(null)}
            id="translationModal"
        >
            <label className='form-group'>
                {t(`labels.title`, { ns: 'common' })} ({t(`languages.${currentLang}`, { ns: 'common' })}):
                <input
                    type="text"
                    value={title}
                    maxLength={250}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </label>

            <label className='form-group' id="listingDescription">
                {t(`labels.description`, { ns: 'common' })} ({t(`languages.${currentLang}`, { ns: 'common' })}):
                <textarea
                    id="listingDescriptionTxt"
                    rows="4"
                    value={description}
                    maxLength={1900}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            <button type="button" className="btn btn-primary" onClick={handleAddLanguage}>
                {t(`listing.saveTranslation`, { ns: 'buttons' })}
            </button>
        </Modal>
    );
};

export default TranslationModal;