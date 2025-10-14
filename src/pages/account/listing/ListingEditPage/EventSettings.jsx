import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const recurrencePatterns = [
    "NONE",
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "YEARLY"
];

const EventSettings = ({
    updateListing,
    listing
}) => {

    const { t } = useTranslation('common');

    useEffect(() => {
    
        setEventDate(listing.eventDate);
        setRecurrence(listing.recurrencePattern);
        setRecurring(listing.recurring);

    }, [listing]);

    const [eventDate, setEventDate] = useState(0)
    const [recurrence, setRecurrence] = useState('NONE')
    const [isRecurring, setRecurring] = useState(false);

    return (
        <>
            <h2 className="two-columns-grid">Настройки события</h2>
            <div className="form-group">
                <label for="event-date">Выберите дату события:</label>
                <input 
                    type="datetime-local"
                    value={eventDate}
                    id="event-date" 
                    name="eventDate"
                    onChange={(e) => {
                        setEventDate(e.target.value);
                        updateListing({ eventDate: e.target.value });
                    }}
                />
            </div>

            <div className="form-group">
                <h3>Событие многоразовое?</h3>
                <div className="status-toggle">
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={isRecurring ?? false}
                            onChange={(e) => {
                                setRecurring(e.target.checked);
                                updateListing({ recurring: e.target.checked });
                            }}
                            value="true"
                        />
                        <span className="slider"></span>
                    </label>
                    {isRecurring ? (
                        <p>Да</p>
                    ) : (
                        <p>Нет</p>
                    )}
                </div>
            </div>

            {isRecurring && (
                <div className="form-group">
                    <h3>Частота проведения</h3>
                    <div className="status-toggle">
                        <select
                            id="categorySelector"
                            value={recurrence}
                            onChange={(e) => {
                                setRecurrence(e.target.value);
                                updateListing({ recurrence: e.target.value });
                            }}
                        >
                            {recurrencePatterns.map((r) => (
                                <option 
                                    key={r} 
                                    value={r}
                                    selected={r == recurrence}
                                >
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventSettings;