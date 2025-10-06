import { useEffect, useState } from "react";
import { apiFetch } from "@core/lib/services/apiClient";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { useTranslation } from 'react-i18next';

const ListingImagesUploader = ({ onChange, images, listing }) => {

    const { t } = useTranslation('common');

    const {notificate} = useNotification();

    const [imageList, setImageList] = useState([]);
    const [mainImage, setMainImage] = useState([]);

    useEffect(() => {
        setImageList(images);
        setMainImage(listing.imagePath);
    }, [images, listing])

    // Добавляем новое изображение
    const addListingImageUrl = (newImage) => {
        setImageList(prev => [...prev, newImage]);
    };

    const setMainImageToListing = (mainImageUrl) => {
        setMainImage(mainImageUrl)
        onChange(images, mainImageUrl);
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

            const data = await apiFetch(`/api/cloud/upload/listing-image?listingId=${listing.id}`, {
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
        <div className="form-group two-columns-grid">
            <h3>{t(`labels.images`, { ns: 'common' })}</h3>
            <div className="image-gallery-grid">
                {imageList.map((img) => (
                    <div key={img.id} className="image-item">
                        <div className="card">
                            <img
                                src={img.path}
                                onError={(e) => e.target.src = `/images/default-listing.svg`}
                                className="card-img-top"
                            />
                            <div className="overlay-actions bottom right">
                                {(img.path != mainImage) && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-gold"
                                        onClick={() => setMainImageToListing(img.path)}
                                    >
                                        <i className="fa-solid fa-star"></i>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteListingImage(img)}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="updload-image">
                    <input
                        type="file"
                        id="uploadImage"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="uploadImage">
                        <i className="fa-regular fa-image-circle-plus fa-3x border-color"></i>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ListingImagesUploader;