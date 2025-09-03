import { useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useNotification } from "@/contexts/notifications/NotificationContext";

const ListingImagesUploader = ({ initialImages = [], initialMainImage = "" }) => {

    const notificate = useNotification();

    const [imagesList, setImagesList] = useState(initialImages);
    const [mainImage, setMainImage] = useState(initialMainImage);

    // Добавляем новое изображение
    const addListingImageUrl = (url) => {
        setImagesList(prev => [...prev, url]);
    };

    // Удаляем изображение
    const deleteListingImageUrl = (url) => {
        setImagesList(prev => prev.filter(item => item !== url));
        if (mainImage === url) setMainImage(""); // если основное изображение удалено
    };

    // Загрузка нового изображения
    const uploadListingImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            const data = await apiFetch("/api/upload/listing-image", {
                method: "POST",
                body: formData
            }, {});

            if (data.imageUrl) {
                notificate("Успешно", "success");
            } else {
                return;
            }

            addListingImageUrl(data.imageUrl);
            if (!mainImage) setMainImage(data.imageUrl); // если основное еще не выбрано

            return data.url;
        } catch (error) {
            console.error("Ошибка загрузки файла:", error);
            notificate("Ошибка загрузки изображения", "error");
        }
    };

    // Удаление изображения с сервера
    const deleteListingImage = async (url) => {
        try {
            const response = await apiFetch(`/proxy/secure/cloud/delete/listing-image?imageUrl=${encodeURIComponent(url)}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error(`Ошибка при удалении: ${response.statusText}`);
            deleteListingImageUrl(url);
            return true;
        } catch (error) {
            console.error("Ошибка удаления:", error);
            return false;
        }
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files) return;
        for (let file of files) {
            await uploadListingImage(file);
        }
    };

    return (
        <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label>Изображения</label>
            <input type="hidden" name="mainImageUrl" value={mainImage} />
            <div className="image-gallery">
                <div className="image-gallery-grid">
                    {imagesList.map((url) => (
                        <div key={url} className="image-item col-md-3 mb-3">
                            <div className="card">
                                <img
                                    src={url}
                                    onError={(e) => e.target.src = "/images/default-listing.png"}
                                    className="card-img-top img-thumbnail"
                                />
                                <div className="card-body p-2">
                                    <div className="btn-group btn-group-sm w-100">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={() => setMainImage(url)}
                                        >
                                            <i className="fa-solid fa-star c-primary"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => deleteListingImage(url)}
                                        >
                                            <i className="fa-solid fa-trash c-danger"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="upload-controls mt-2">
                <input
                    type="file"
                    id="uploadedImages"
                    name="uploadedImages"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                />
                <label htmlFor="uploadedImages" className="btn btn-outline-primary">
                    Выбрать файлы
                </label>
            </div>

            {/* Скрытое поле для отправки всех изображений на сервер */}
            <input type="hidden" name="images" value={imagesList.join(",")} />
        </div>
    );
};

export default ListingImagesUploader;