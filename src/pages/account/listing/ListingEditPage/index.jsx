import CategorySelector from "@/components/selectors/CategorySelector";
import LocationSelector from "@/components/selectors/LocationSelector";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import ListingImagesUploader from "./ListingImagesUploader";
import "#/css/public/pages/listing-edit-page.css"
import { useParams } from "react-router-dom";

import { useNotification } from "@/contexts/notifications/NotificationContext";

const ListingEditPage = () => {

    const { id } = useParams();

    const notificate = useNotification();

    const [priceTypes, setPriceTypes] = useState([])
    const [listing, setListing] = useState([])

    const [locationId, setLocationId] = useState([]);
    const [categoryId, setCategoryId] = useState([]);
    const [price, setPrice] = useState(listing?.price || "");
    const [selectedPriceType, setSelectedPriceType] = useState("");

    const categoryChange = (lastId, path) => {
        console.log("[C] Последний выбранный:", lastId);
        console.log("[C] Путь:", path);
        updateListing({category: lastId});
    }

    const locationChange = (lastId, path) => {
        console.log("[L] Последний выбранный:", lastId);
        console.log("[L] Путь:", path);
        updateListing({location: lastId});
    }

    function changePrice(price) {
        setPrice(price);
        updateListing({price: price});
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
            console.log(await data)
            setListing(data.listing);
        }

        loadListing();
    }, [id]);

    useEffect(() => {

        setCategoryId(listing.categoryId);
        setLocationId(listing.locationId);
        setPrice(listing.price);
        setSelectedPriceType(listing.priceType);

    }, [listing]);

    /**
     * Обновляет объявление по id
     * @param {number|string} listingId - ID объявления
     * @param {Object} updates - Объект с полями для обновления
     * @returns {Promise<Object>} - обновлённое объявление
     */
    async function updateListing(updates) {

        try {
            const res = await apiFetch(`/api/listing/modify/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            if (res.message) {
                notificate(res.message, "success");
            } else {
                notificate("Ошибка обновления объявления", "error");
            }
        } catch (err) {
            notificate("Ошибка обновления объявления", "error");
            throw err;
        }
    }

    return (
        <>
            <div className="account-header">
                <h2>Управление объявлением</h2>
                {listing.temporary && 
                    <p>(Опубликовано)</p>
                } 
            </div>
            <div className="edit-listing-form form-grid">
                {/* <div className="form-group">
                    <label th:text="#{listing.editing.status}">Статус объявления</label>
                    <div className="status-toggle">
                        <label className="switch">
                            <input type="checkbox" name="active" th:checked="${listing.active}" value="true"/>
                            <span className="slider"></span>
                        </label>
                        <span th:text="${listing.active} ? #{listing.editing.status.enable} : #{listing.editing.status.disable}"></span>
                    </div>
                </div> */}

                <div className="form-group">
                    <label htmlFor="price">Цена</label>
                    <input
                        className="form-control"
                        type="number"
                        id="price"
                        name="price"
                        value={price}
                        onChange={(e) => changePrice(e.target.value)}
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="priceType">Тип цены</label>
                    <select
                        id="priceType"
                        name="priceType"
                        className="form-control"
                        required
                        value={selectedPriceType}
                        onChange={(e) => setSelectedPriceType(e.target.value)}
                    >
                        <option value="" disabled>Выберите тип цены</option>
                        {priceTypes.map((type) => (
                            <option key={type.name} value={type.name}>
                                {`price.${type.displayName}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Категория</label>
                    <CategorySelector categoryId={categoryId} onChange={categoryChange} />
                </div>

                <div className="form-group">
                    <label>Местоположение</label>
                    <LocationSelector locationId={locationId} onChange={locationChange} />
                </div>

                <div className="form-group">
                    <ListingImagesUploader/>
                </div>
            </div>
        </>
    );
};

export default ListingEditPage;