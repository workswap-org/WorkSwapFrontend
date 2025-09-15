import { useState } from "react";

const ListingGallery = ( { images } ) => {

    const openModal = (index) => {
        setMainImageIndex(index);
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

    return (
        <>
            <div className="listing-gallery">
                <div className="main-image">
                    <div className="image-container">
                        <button className="nav-arrow prev-arrow" onClick={handlePrevImage}>
                            <i className="fa-solid fa-circle-left fa-xl"></i>
                        </button>
                        <img
                            src={images[mainImageIndex]?.path ?? `/images/default-listing-${localStorage.getItem('theme')}.png`}
                            onError={(e) => e.currentTarget.src = `/images/default-listing-${localStorage.getItem('theme')}.png`}
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
                                    onError={(e) => e.currentTarget.src = `/images/default-listing-${localStorage.getItem('theme')}.png`}
                                    alt="Дополнительное изображение"
                                    className="clickable-image thumbnail-img"
                                    onClick={() => setMainImageIndex(index)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Модальное окно (fullscreen) */}
            {isModalOpen && (
                <div id="fullscreen-modal" className="fullscreen-modal">
                    <span className="close" id="close-modal" onClick={closeModal}>
                        &times;
                    </span>
                    <button className="modal-arrow modal-prev" onClick={handlePrevImage}>
                        &#10094;
                    </button>
                    <img
                        id="fullscreen-image"
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