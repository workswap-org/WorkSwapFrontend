import { useNotification } from "@core/lib/contexts/NotificationContext";
import { listingService } from "@core/lib/services/listing";
import { cloudService } from "@core/lib/services/cloudService";
import { IFullListing, IListingImage } from "@core/lib/types/models/listing";
import { useEffect, useState } from "react";

const ListingImagesUploader = ({
    updateListing,
    listing
}: {
    updateListing: (updates: Record<string, any>) => void
    listing: IFullListing
}) => {

    const {notificate} = useNotification();

    const [mainImage, setMainImage] = useState<string>('');
    const [images, setImages] = useState<IListingImage[] | null>(null);

    useEffect(() => {
        setImages(images);
        setMainImage(listing.imagePath);
    }, [images, listing])

    useEffect(() => {
        if (!listing.id) return;
        listingService.getImages(listing.id).then(setImages)
    }, [listing.id]);

    // Добавляем новое изображение
    const addListingImageUrl = (newImage: IListingImage) => {
        setImages(prev => {
            if (!prev) return prev;
            return [...prev, newImage]
        });
    };

    const setMainImageToListing = (mainImageUrl: string) => {
        setMainImage(mainImageUrl)
        updateListing({ mainImage: mainImageUrl })
    };

    // Удаляем изображение
    const deleteListingImageUrl = (img: IListingImage) => {
        setImages(prev => prev?.filter(item => item.path !== img.path) ?? null);
        if (mainImage === img.path) setMainImage(""); // если основное изображение удалено
    };

    // Загрузка нового изображения
    const uploadImage = async (file: File) => {

        const formData = new FormData();
        formData.append("image", file);

        const data = await cloudService.uploadListingImage(listing.id, formData)

        if (data.path) {
            notificate("Успешно", "success")
            const newImage: IListingImage = { id: data.id, listingId: listing.id, path: data.path }
            addListingImageUrl(newImage);
            if (!mainImage) setMainImage(data.path);
        } else {
            notificate("Ошибка загрузки изображения", "error")
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        for (let file of files) {
            await uploadImage(file);
        }
    };

    return (
        <div className="image-gallery-grid">
            {images?.map((img) => (
                <div key={img.id} className="image-item">
                    <div className="card">
                        <img
                            src={img.path ?? "/images/placeholders/default-listing.svg"}
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = '/images/placeholders/default-listing.svg';
                            }}
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
                                onClick={() => cloudService.deleteListingImage(listing.id, img)
                                    .then(message => {
                                        notificate(message)
                                        deleteListingImageUrl(img)
                                    })
                                    .catch(() => notificate("Ошибка удаления изображения с сервера", "error"))
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
    );
};

export default ListingImagesUploader;