import CategorySelector from "@/components/selectors/CategorySelector";
import LocationSelector from "@/components/selectors/LocationSelector";
import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/apiClient";
import ListingImagesUploader from "./ListingImagesUploader";
import "@/css/pages/listing-edit-page.css"
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { useNotification } from "@/lib/contexts/notifications/NotificationContext";
import { useNavigate } from "react-router-dom";
import ListingTranslations from "./translations/ListingTranslations";
import { useTranslation } from 'react-i18next';

const ListingEditPage = () => {

    const { t } = useTranslation('common');

    const { id } = useParams();

    const {notificate, notificateFromRes} = useNotification();
    const navigate = useNavigate();

    const [priceTypes, setPriceTypes] = useState([])
    const [listing, setListing] = useState([])

    const [saving, setSaving] = useState(false);
    const [locationId, setLocationId] = useState([]);
    const [categoryId, setCategoryId] = useState([]);
    const [images, setImages] = useState([]);
    const [price, setPrice] = useState(listing?.price || "");
    const [selectedPriceType, setSelectedPriceType] = useState("");
    const [isActive, setActive] = useState(false);
    
    const updateListing = useCallback(async (updates) => {
        try {
            const res = await apiFetch(`/api/listing/modify/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            if (res.message) {
                setSaving(false);
            } else {
                notificate(t(`notification.error.listingUpdate`, { ns: 'messages' }), "error");
            }
        } catch (err) {
            notificate(t(`notification.error.listingUpdate`, { ns: 'messages' }), "error");
            throw err;
        }
    }, [id, notificate, t]);
    
    const translationsChange = useCallback((translation) => {
        console.log("[T] Перевод:", translation);
        setSaving(true);
        updateListing({ translation });
    }, [updateListing]);

    // categoryChange
    const categoryChange = useCallback((lastId, path) => {
        console.log("[C] Последний выбранный:", lastId);
        console.log("[C] Путь:", path);
        setSaving(true);
        updateListing({ category: lastId });
    }, [updateListing]);

    // locationChange (у тебя уже был)
    const locationChange = useCallback((lastId, path) => {
        console.log("[L] Последний выбранный:", lastId);
        console.log("[L] Путь:", path);
        setSaving(true);
        updateListing({ location: lastId });
    }, [updateListing]);

    // imagesChange
    const imagesChange = useCallback((images, mainImage) => {
        console.log("[I] Изображения:", images);
        setImages(images);
        setSaving(true);
        updateListing({ mainImage })
    }, [updateListing]);

    // changePrice
    const changePrice = useCallback((price) => {
        setPrice(price);
        setSaving(true);
        updateListing({ price });
    }, [updateListing]);

    // changePriceType
    const changePriceType = useCallback((type) => {
        setSelectedPriceType(type);
        setSaving(true);
        updateListing({ priceType: type });
    }, [updateListing]);

    const changeActive = useCallback((active) => {
        setActive(active);
        setSaving(true);
        updateListing({ active });
    }, [updateListing])

    async function publishListing() {
        const data = await apiFetch(`/api/listing/publish/${id}`, {method: 'POST'});
        if (data.message) {
            notificateFromRes(data);
            navigate(`/secure/my-listings`);
        }
    }

    async function deleteDraft() {
        const data = await apiFetch(`/api/listing/${id}/delete`, {method: 'DELETE'});
        if (data.message) {
            notificateFromRes(data);
            navigate(`/secure/my-listings`);
        }
    }

    useEffect(() => {

        async function loadPriceTypes() {
            const data = await apiFetch('/api/settings/price-types')
            setPriceTypes(data.priceTypes);
        }

        loadPriceTypes();
    }, [])

    useEffect(() => {

        async function loadListing() {
            const data = await apiFetch(`/api/listing/get/${id}`)
            setListing(data.listing);
        }

        async function loadImages() {
            const data = await apiFetch(`/api/listing/images/${id}`)
            setImages(data.images);
        }

        loadListing();
        loadImages();
    }, [id]);

    useEffect(() => {

        setCategoryId(listing.categoryId);
        setLocationId(listing.locationId);
        setPrice(listing.price);
        setSelectedPriceType(listing.priceType?.toUpperCase());
        setActive(listing.active);

    }, [listing]);

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.listingEdit`, { ns: 'common' })}</h2>
                {saving && (
                    <i className="fa-regular fa-download fa-spin fa-spin-reverse fa-2xl"></i>
                )}
                {listing.temporary ? (
                    <p>({t(`statuses.draft`, { ns: 'common' })})</p>
                ) : (
                    <p>({t(`statuses.published`, { ns: 'common' })})</p>
                )} 
            </div>
            <div className="edit-listing-form form-grid">

                <div className="form-group two-columns-grid">
                    <h3>{t(`labels.translations`, { ns: 'common' })}</h3>
                    <ListingTranslations id={id} onChange={translationsChange} />
                </div>

                <div className="form-group">
                    <h3>{t(`labels.listingStatus`, { ns: 'common' })}</h3>
                    <div className="status-toggle">
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={isActive ?? false}
                                onChange={(e) => changeActive(e.target.checked)}
                                value="true"
                            />
                            <span className="slider"></span>
                        </label>
                        {isActive ? (
                            <p>{t(`statuses.active`, { ns: 'common' })}</p>
                        ) : (
                            <p>{t(`statuses.inactive`, { ns: 'common' })}</p>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="price">{t(`labels.price`, { ns: 'common' })}</label>
                    <div className="price-edit">
                        {selectedPriceType != 'NEGOTIABLE' && (
                            <input
                                className="form-control price-edit-duo"
                                type="number"
                                id="price"
                                name="price"
                                value={price ?? ""}
                                onChange={(e) => changePrice(e.target.value)}
                                step="0.01"
                                required
                            />
                        )}
                        <select
                            id="priceType"
                            name="priceType"
                            className={`form-control ${selectedPriceType != 'NEGOTIABLE' ? 'price-edit-duo' : ''}`}
                            required
                            value={selectedPriceType ?? ""}
                            onChange={(e) => changePriceType(e.target.value)}
                        >
                            <option value="" disabled>{t(`placeholders.priceType`, { ns: 'common' })}</option>
                            {priceTypes.map((type) => (
                                <option key={type.name} value={type.name}>
                                    {t(`priceTypes.${type.displayName}`, { ns: 'common' })}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <h3>{t(`labels.category`, { ns: 'common' })}</h3>
                    <CategorySelector categoryId={categoryId} onChange={categoryChange} />
                </div>

                <div className="form-group">
                    <h3>{t(`labels.location`, { ns: 'common' })}</h3>
                    <LocationSelector locationId={locationId} onChange={locationChange} />
                </div>

                <ListingImagesUploader images={images} onChange={imagesChange} listing={listing}/>

                <div className="form-actions two-columns-grid">
                    <button 
                        onClick={() => {
                            const confirmed = window.confirm(t(`confirms.deleteListing`, { ns: 'messages' }));
                            if (confirmed) {
                                deleteDraft();
                            }
                        }}
                        type="button" 
                        className="btn btn-outline-primary"
                    >
                        {t(`listing.${listing.temporary ? "cleanDraft" : "delete"}`, { ns: 'buttons' })}
                    </button>
                    <Link 
                        to="/secure/listing/drafts" 
                        type="button" 
                        className="btn btn-outline-primary"
                    >
                        {t(`listing.goToDrafts`, { ns: 'buttons' })}
                    </Link>

                    {listing.temporary && (
                        <button 
                            onClick={() => publishListing()} 
                            type="button" 
                            className="btn btn-primary"
                        >
                            {t(`listing.publish`, { ns: 'buttons' })}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ListingEditPage;