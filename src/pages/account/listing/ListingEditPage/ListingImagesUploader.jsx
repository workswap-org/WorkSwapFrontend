import { useCallback, useEffect, useState } from "react";
import { 
    useNotification, 
    deleteListingImage,
    uploadListingImage,
    getListingImages
} from "@core/lib";
import { useTranslation } from 'react-i18next';

const ListingImagesUploader = ({ updateListing, listing }) => {

    const { t } = useTranslation('common');

    const {notificate} = useNotification();

    const [imageList, setImageList] = useState([]);
    const [mainImage, setMainImage] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        setImageList(images);
        setMainImage(listing.imagePath);
    }, [images, listing])

    useEffect(() => {
        async function loadImages() {
            const data = await getListingImages(listing.id);
            setImages(data.images);
        }

        if (listing.id) loadImages();
    }, [listing.id]);

    const imagesChange = useCallback((images, mainImage) => {
        console.log("[I] Изображения:", images);
        setImages(images);
        updateListing({ mainImage })
    }, [updateListing]);

    // Добавляем новое изображение
    const addListingImageUrl = (newImage) => {
        setImageList(prev => [...prev, newImage]);
    };

    const setMainImageToListing = (mainImageUrl) => {
        setMainImage(mainImageUrl)
        imagesChange(images, mainImageUrl);
    };

    // Удаляем изображение
    const deleteListingImageUrl = (img) => {
        setImageList(prev => prev.filter(item => item.path !== img.path));
        if (mainImage === img.path) setMainImage(""); // если основное изображение удалено
    };

    // Загрузка нового изображения
    const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            const data = await uploadListingImage(listing.id, formData);

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
    const deleteImage = async (img) => {
        try {
            const response = await deleteListingImage();

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
            await uploadImage(file);
        }
    };

    return (
        <>
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
                                    onClick={() => deleteImage(img)}
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
        </>
    );
};

export default ListingImagesUploader;