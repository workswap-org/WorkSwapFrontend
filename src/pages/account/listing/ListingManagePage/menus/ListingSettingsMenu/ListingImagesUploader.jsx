import { useCallback, useEffect, useState } from "react";
import { 
    useNotification, 
    deleteListingImage,
    uploadListingImage,
    getListingImages
} from "@core/lib";

const ListingImagesUploader = ({ updateListing, listing }) => {

    const {notificate} = useNotification();

    const [imageList, setImageList] = useState([]);
    const [mainImage, setMainImage] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        setImageList(images);
        setMainImage(listing.imagePath);
    }, [images, listing])

    useEffect(() => {
        if (!listing.id) return;
        getListingImages(listing.id).then(data => setImages(data))
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

        const formData = new FormData();
        formData.append("image", file);

        uploadListingImage(listing.id, formData)
            .then(data => {
                notificate("Успешно", "success")
                const newImage = { id: data.id, path: data.path }
                addListingImageUrl(newImage);
                if (!mainImage) setMainImage(data.path);
            })
            .catch(notificate("Ошибка загрузки изображения", "error"))
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
                                    onClick={() => deleteListingImage(listing.id, img)
                                        .then(message => {
                                            notificate(message)
                                            deleteListingImageUrl(img)
                                        })
                                        .catch(notificate("Ошибка удаления изображения с сервера", "error"))
                                    }
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