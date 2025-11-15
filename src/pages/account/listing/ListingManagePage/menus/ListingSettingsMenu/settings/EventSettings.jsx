import { useCallback, useEffect, useState } from "react";
import { 
    useTranslation
} from 'react-i18next';
import { 
    useNotification,
    modifyEvent,
    getEventSettings,
    getListingAccessToken
} from "@core/lib";
import ListingSetting from "../ListingSetting";

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
    updateListing,
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

    const [accessToken, setAccessToken] = useState("");

    const updateEvent = useCallback(async (updates) => {
            if (!listing.id || updates === undefined) return;
            try {
                modifyEvent(listing.id, updates);
            } catch (err) {
                notificate(t(`notification.error.listingUpdate`, { ns: 'messages' }), "error");
                throw err;
            }
        }, [listing.id, notificate, t]);

    useEffect(() => {

        async function loadEventSettings() {
            const data = await getEventSettings(listing.id);
            setEvent(data);
        }

        const loadToken = async () => {
            const data = await getListingAccessToken(listing.id);
            setAccessToken(data.token);
        };

        loadEventSettings();

        loadToken();
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
            <h2 className="two-columns-grid">{t(`labels.settings.event`, { ns: 'common' })}</h2>
            <ListingSetting title={t(`labels.event.date`, { ns: 'common' })}>
                <div className="form-group">
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
            </ListingSetting>

            <ListingSetting title={t(`labels.event.registerClosingDate`, { ns: 'common' })}>
                <div className="form-group">
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
            </ListingSetting>

            <ListingSetting title={t(`labels.status.event.title`, { ns: 'common' })}>
                <div className="form-group">
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
                            {eventStatuses.map((es) => (
                                <option 
                                    key={es} 
                                    value={es}
                                    selected={es == eventStatus}
                                >
                                    {t(`labels.status.event.${es}`, { ns: 'common' })}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </ListingSetting>
            
            <ListingSetting title={t(`labels.event.minMaxParticipants`, { ns: 'common' })}>
                <div className="form-group">
                    <div className="duo">
                        <input
                            id="minParticipants"
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
                            id="maxParticipants"
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
            </ListingSetting>

            <ListingSetting title={t(`labels.event.visibility.title`, { ns: 'common' })}>
                <div className="form-group">
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
                            <p>{t(`labels.event.visibility.public`, { ns: 'common' })}</p>
                        ) : (
                            <p>{t(`labels.event.visibility.private`, { ns: 'common' })}</p>
                        )}
                    </div>

                    {!isPublic && (
                        <>
                            <h4>Пароль к объявлению</h4>
                            <input
                                className="form-control first"
                                type="text"
                                id="accessToken"
                                value={accessToken ?? ""}
                                onChange={(e) => {
                                    setAccessToken(e.target.value);
                                    updateListing({ accessToken: e.target.value });
                                }}
                                step="0.01"
                                required
                            />
                            <div 
                                className="btn hover"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.origin + `/event/${listing.id}/?token=${accessToken}`)
                                        .then(() => notificate(t(`notification.success.copyListingLink`, { ns: 'messages' }), "success"))
                                        .catch(() => notificate("Ошибка", "error"));
                                }}
                            >Скопировать ссылку</div>
                        </>
                    )}
                </div>
            </ListingSetting>

            <ListingSetting title={t(`labels.event.recurrence.title`, { ns: 'common' })}>
                <div className="form-group">
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
                            <p>{t(`labels.event.recurrence.repeat`, { ns: 'common' })}</p>
                        ) : (
                            <p>{t(`labels.event.recurrence.single`, { ns: 'common' })}</p>
                        )}
                    </div>

                    {isRecurring && (
                        <>
                            <h4>{t(`labels.event.recurrenceParam.title`, { ns: 'common' })}</h4>
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
                                            {t(`labels.event.recurrenceParam.${r}`, { ns: 'common' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </div>
            </ListingSetting>
        </>
    );
};

export default EventSettings;