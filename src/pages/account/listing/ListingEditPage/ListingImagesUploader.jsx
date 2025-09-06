import { useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useNotification } from "@/contexts/notifications/NotificationContext";

const ListingImagesUploader = ({ onChange, images, initialMainImage = "", listingId }) => {

    const notificate = useNotification();

    const [imageList, setImageList] = useState(images);
    const [mainImage, setMainImage] = useState(initialMainImage);

    // Добавляем новое изображение
    const addListingImageUrl = (newImage) => {
        setImageList(prev => [...prev, newImage]);
        onChange(imageList);
    };

    // Удаляем изображение
    const deleteListingImageUrl = (img) => {
        setImageList(prev => prev.filter(item => item.path !== img.path));
        if (mainImage === img.path) setMainImage(""); // если основное изображение удалено
    };

    // Загрузка нового изображения
    const uploadListingImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            const data = await apiFetch(`/api/cloud/upload/listing-image?listingId=${listingId}`, {
                method: "POST",
                body: formData
            }, {});

            if (data.imageUrl) {
                notificate("Успешно", "success");
            } else {
                return;
            }

            const newImage = {
                id: data.imageId,
                path: data.imageUrl
            }

            addListingImageUrl(newImage);
            if (!mainImage) setMainImage(data.imageUrl); // если основное еще не выбрано

            return data.url;
        } catch (error) {
            console.error("Ошибка загрузки файла:", error);
            notificate("Ошибка загрузки изображения", "error");
        }
    };

    // Удаление изображения с сервера
    const deleteListingImage = async (img) => {
        try {
            const response = await apiFetch(`/api/cloud/delete/listing-image`, {
                method: "DELETE"
            }, {
                imageUrl: encodeURIComponent(img.path),
                imageId: img.id
            });

            if (!response.message) throw new Error(`Ошибка при удалении: ${response.statusText}`);
            deleteListingImageUrl(img);
            notificate(response.message, "success")
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
                    {imageList.map((img) => (
                        <div key={img.id} className="image-item col-md-3 mb-3">
                            <div className="card">
                                <img
                                    src={img.path}
                                    onError={(e) => e.target.src = "/images/default-listing.png"}
                                    className="card-img-top img-thumbnail"
                                />
                                <div className="card-body p-2">
                                    <div className="btn-group btn-group-sm w-100">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={() => setMainImage(img.path)}
                                        >
                                            <i className="fa-solid fa-star c-primary"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => deleteListingImage(img)}
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
        </div>
    );
};

export default ListingImagesUploader;