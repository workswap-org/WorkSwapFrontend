import { useCallback, useEffect, useState } from "react";
import { listingService } from "../listing";
import { IShortListing } from "@core/lib/types/models/listing";

export function useFavorite(listing: IShortListing | null) {

    const [isFavorite, setFavorite] = useState<boolean>(listing?.liked || false);
    const [likesCount, setLikesCount] = useState<number>(listing?.likes ||0);

    const toggleFavorite = useCallback(async () => {
        if (!listing?.id) return;
        setFavorite(!isFavorite); // мгновенный отклик
        if (isFavorite) {
            listingService.removeFavorite(listing.id)
                .then(() => setLikesCount(prev => prev - 1))
                .catch(() => {
                    setFavorite(true);
                    setLikesCount(prev => prev);
                })
        } else {
            listingService.addFavorite(listing.id)
                .then(() => setLikesCount(prev => prev + 1))
                .catch(() => {
                    setFavorite(false);
                    setLikesCount(prev => prev);
                })
        }
    }, [isFavorite])

    return { isFavorite, likesCount, toggleFavorite }
}

export function useMyFavorites() {
    const [listings, setListings] = useState<IShortListing[] | null>([]);

    useEffect(() => {
        async function loadFavorites() {
            const data = await listingService.getFavorites();
            console.log(data)
            setListings(data);
        }

        loadFavorites()
    }, [])

    return listings;
}