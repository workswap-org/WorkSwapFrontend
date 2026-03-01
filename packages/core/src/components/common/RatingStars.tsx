"use client";

function RatingStars({ rating }: {rating: number}) {
    // Берём рейтинг или 0, если listing/rating нет
    const countedRating = Math.max(0, Math.min(5, Number(rating ?? 0)));

    // Для каждого индекса 1..5 выбираем класс:
    // - полная звезда, если rating >= i
    // - половинка, если rating >= i - 0.5
    // - пустая иначе
    const stars = Array.from({ length: 5 }, (_, idx) => {
        const i = idx + 1;
        const cls =
            countedRating >= i 
                ? "fa-solid fa-star"
                : countedRating >= i - 0.5
                ? "fa-solid fa-star-half-stroke"
                : "fa-regular fa-star";
        return <i key={i} className={cls} aria-hidden="true"></i>;
    });

    return (
        <div className="rating normal-only">{stars}</div>
    );
}

export default RatingStars;