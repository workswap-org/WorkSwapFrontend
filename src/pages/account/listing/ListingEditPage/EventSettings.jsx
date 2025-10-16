import { useCallback, useEffect, useState } from "react";
import { 
    useTranslation
} from 'react-i18next';
import { 
    useNotification,
    modifyEvent,
    getEventSettings
} from "@core/lib";

const recurrencePatterns = [
    "NONE",
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "YEARLY"
];

const eventStatuses = [
    "RECRUITING",
    "CLOSED",
    "FINISHED",
    "ARCHIVED"
];

const EventSettings = ({
    setSaving,
    listing
}) => {

    const { t } = useTranslation('common');
    const {notificate} = useNotification();

    const [event, setEvent] = useState([])

    const [eventDate, setEventDate] = useState(0)
    const [recurrence, setRecurrence] = useState('DAILY')
    const [isRecurring, setRecurring] = useState(false);
    const [maxParticipants, setMaxParticipants] = useState(undefined);
    const [minParticipants, setMinParticipants] = useState(0);
    const [eventStatus, setEventStatus] = useState('RECRUITING');
    const [registrationCloseTime, setRegistrationCloseTime] = useState(0);
    const [isPublic, setPublic] = useState(true);

    const updateEvent = useCallback(async (updates) => {
            if (!listing.id || updates === undefined) return;
            setSaving(true);
            try {
                modifyEvent(listing.id, updates);
                setSaving(false);
            } catch (err) {
                notificate(t(`notification.error.listingUpdate`, { ns: 'messages' }), "error");
                throw err;
            }
        }, [listing.id, notificate, setSaving, t]);

    useEffect(() => {

        async function loadEventSettings() {
            const data = await getEventSettings(listing.id);
            setEvent(data);
        }

        loadEventSettings();
    }, [listing.id]);

    useEffect(() => {

        console.log(event);
    
        setEventDate(event.eventDate);
        setRegistrationCloseTime(event.registrationCloseTime)
        setRecurrence(event.recurrencePattern);
        setRecurring(event.recurring);
        setMaxParticipants(event.maxParticipants);
        setMinParticipants(event.minParticipants);
        setEventStatus(event.eventStatus);
        setPublic(event.public);

    }, [event]);

    return (
        <>
            <h2 className="two-columns-grid">Настройки события</h2>
            <div className="form-group">
                <label htmlFor="event-date">Выберите дату события:</label>
                <input 
                    type="datetime-local"
                    value={eventDate}
                    id="event-date" 
                    name="eventDate"
                    onChange={(e) => {
                        setEventDate(e.target.value);
                        updateEvent({ eventDate: e.target.value });
                    }}
                />
            </div>

            <div className="form-group">
                <label htmlFor="event-date">Выберите дату закрытия набора участников:</label>
                <input 
                    type="datetime-local"
                    value={registrationCloseTime}
                    id="event-date" 
                    name="eventDate"
                    onChange={(e) => {
                        setRegistrationCloseTime(e.target.value);
                        updateEvent({ registrationCloseTime: e.target.value });
                    }}
                />
            </div>

            <div className="form-group">
                <h3>Статус</h3>
                <div className="status-toggle">
                    <select
                        value={eventStatus}
                        onChange={(e) => {
                            setEventStatus(e.target.value);
                            updateEvent({ eventStatus: e.target.value });
                        }}
                    >
                        <option 
                            selected
                            disabled
                        >
                            Выберите статус события
                        </option>
                        {eventStatuses.map((r) => (
                            <option 
                                key={r} 
                                value={r}
                                selected={r == eventStatus}
                            >
                                {r}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <h3 htmlFor="price">Участники минимально/максимально</h3>
                <div className="duo">
                    <input
                        className="form-control first"
                        type="number"
                        value={minParticipants ?? ""}
                        onChange={(e) => {
                            setMinParticipants(e.target.value);
                            updateEvent({ minParticipants: e.target.value });
                        }}
                        step="1"
                    />
                    <input
                        className="form-control second"
                        type="number"
                        value={maxParticipants ?? ""}
                        onChange={(e) => {
                            setMaxParticipants(e.target.value);
                            updateEvent({ maxParticipants: e.target.value });
                        }}
                        step="1"
                    />
                </div>
            </div>

            <div className="form-group">
                <h3>Доступность</h3>
                <div className="status-toggle">
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={isPublic ?? true}
                            onChange={(e) => {
                                setPublic(e.target.checked);
                                updateEvent({ isPublic: e.target.checked });
                            }}
                            value="true"
                        />
                        <span className="slider"></span>
                    </label>
                    {isPublic ? (
                        <p>Открытое</p>
                    ) : (
                        <p>Закрытое</p>
                    )}
                </div>
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
                                updateEvent({ recurring: e.target.checked });
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
                            value={recurrence}
                            onChange={(e) => {
                                setRecurrence(e.target.value);
                                updateEvent({ recurrence: e.target.value });
                            }}
                        >
                            <option 
                                selected
                                disabled
                            >
                                Выберите частоту повторения
                            </option>
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