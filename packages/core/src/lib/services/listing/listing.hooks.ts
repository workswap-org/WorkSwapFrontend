import { useCallback, useEffect, useState } from "react";
import { listingService } from "../listing";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { IShortListing } from "@core/lib/types/models/listing";

export function useFavorite(listing: IShortListing | null) {

    const { isAuthenticated } = useAuth();

    const [isFavorite, setFavorite] = useState<boolean>(listing?.liked || false);
    const [likesCount, setLikesCount] = useState<number>(listing?.likes ||0);

    useEffect(() => {
        if ((listing?.liked && listing?.likes) || !isAuthenticated || !listing?.id) return;
        
        async function checkFavorite(listingId: number) {
            const data = await listingService.checkFavorite(listingId);
            setFavorite(data)
        }

        checkFavorite(listing.id)
    }, [listing?.id, isAuthenticated]);

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
    }, [])

    return { isFavorite, likesCount, toggleFavorite }
}