import { useNotification } from "@core/lib/notification/NotificationContext";
import { listingService } from "@core/lib/listing/services";
import { IFullListing, IListingImage } from "@core/lib/listing/types";
import { useEffect, useState } from "react";
import styles from "./ListingImagesUploader.module.scss"
import PlusIcon from "@core/components/common/icons/PlusIcon";
import ActionMenu from "@core/components/ui/ActionMenu/ActionMenu";
import { IKebabAction } from '@core/components/ui/ActionMenu/ActionMenu';

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

    const setListingMainImage = (mainImageUrl: string) => {
        setMainImage(mainImageUrl)
        updateListing({ mainImage: mainImageUrl })
    };

    // Удаляем изображение
    const deleteImg = async (img: IListingImage) => {
        try {
            const res = await listingService.deleteListingImage(listing.id, img.id)
            if (res) notificate(res)
        } catch {
            notificate("Ошибка удаления изображения", "error")
            throw new Error("Ошибка удаления изображения")
        }
                    
        setImages(prev => prev?.filter(item => item.path !== img.path) ?? null);
        if (mainImage === img.path) setMainImage(""); // если основное изображение удалено
    };

    // Загрузка нового изображения
    const uploadImage = async (file: File) => {

        const formData = new FormData();
        formData.append("image", file);

        const data = await listingService.uploadListingImage(listing.id, formData)

        if (data.path) {
            notificate("Изображение загружено", "success")
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
        <div className={styles.imageGallery}>
            {images?.map((img) => (
                <Image
                    key={img.id} image={img}
                    setListingMainImage={setListingMainImage}
                    deleteImg={deleteImg}
                    isMain={img.path == mainImage}
                />
            ))}
            <div className={styles.updloadImage}>
                <input
                    type="file"
                    id="uploadImage"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                />
                <label htmlFor="uploadImage">
                    <PlusIcon />
                </label>
            </div>
        </div>
    );
};

function Image({
    image, setListingMainImage, deleteImg, isMain
}: {
    image: IListingImage;
    setListingMainImage: (mainImageUrl: string) => void;
    deleteImg: (img: IListingImage) => void;
    isMain: boolean;
}) {

    const actions: IKebabAction[] = [
        {
            title: "Сделать избранным",
            func: () => setListingMainImage(image.path),
            access: !isMain
        },
        {
            title: "Удалить",
            func: () => deleteImg(image)
        }
    ]

    return (
        <div className={styles.image}>
            <img
                src={image.path ?? "/images/placeholders/default-listing.svg"}
                onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/images/placeholders/default-listing.svg';
                }}
            />
            <ActionMenu className={styles.kebab} actions={actions}/>
        </div>
    )
}

export default ListingImagesUploader;