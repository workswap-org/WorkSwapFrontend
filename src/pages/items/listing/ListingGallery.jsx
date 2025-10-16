import { useCallback, useEffect, useState } from "react";

import { getListingImages } from '@core/lib';

const ListingGallery = ( { id } ) => {

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const imageData = await getListingImages(id);
            setImages(imageData.images || []);
            setLoading(false)
        }

        if (id) loadData();
    }, [id]);

    const openModal = (index) => {
        setMainImageIndex(index);
        console.log(index)
        setIsModalOpen(true);
    };

    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePrevImage = () => {
        setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextImage = () => {
        setMainImageIndex((prev) => (prev + 1) % images.length);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            if (isModalOpen) setIsModalOpen(false);
        }
    }, [isModalOpen])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        console.log(isModalOpen)
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown, isModalOpen]);

    return (
        <>
            {!loading && (
                <div className="listing-gallery fade-down">
                    <div className="main-image">
                        <div className="image-container">
                            <button className="nav-arrow prev-arrow" onClick={handlePrevImage}>
                                <i className="fa-solid fa-circle-left fa-xl"></i>
                            </button>
                            <img
                                src={images[mainImageIndex]?.path ?? `/images/default-listing.svg`}
                                onError={(e) => e.currentTarget.src = `/images/default-listing.svg`}
                                alt="Основное изображение"
                                className="clickable-image main-image-view"
                                id="mainImageView"
                                onClick={() => openModal(mainImageIndex)}
                            />
                            <button className="nav-arrow next-arrow" onClick={handleNextImage}>
                                <i className="fa-solid fa-circle-right fa-xl"></i>
                            </button>
                        </div>
                    </div>

                    {images?.length > 1 && (
                        <div className="thumbnails">
                            {images.map((image, index) => (
                                <div className="thumbnail" key={index} data-index={index}>
                                    <img
                                        key={image.id}
                                        src={image.path}
                                        onError={(e) => e.currentTarget.src = `/images/default-listing.svg`}
                                        alt="Дополнительное изображение"
                                        className="clickable-image"
                                        onClick={() => setMainImageIndex(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Модальное окно (fullscreen) */}
            {isModalOpen && (
                <div className="fullscreen-modal">
                    <span className="close" id="close-modal" onClick={closeModal}>
                        &times;
                    </span>
                    <button className="modal-arrow modal-prev" onClick={handlePrevImage}>
                        &#10094;
                    </button>
                    <img
                        src={images[mainImageIndex].path}
                        alt="Fullscreen"
                    />
                    <button className="modal-arrow modal-next" onClick={handleNextImage}>
                        &#10095;
                    </button>
                </div>
            )}
        </>
    );
};

export default ListingGallery;