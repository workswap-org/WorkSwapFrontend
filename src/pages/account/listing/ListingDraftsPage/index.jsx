import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/apiClient";
import { useNotification } from "@/contexts/notifications/NotificationContext";
import ListingDraftItem from "@/components/cards/listing-cards/ListingDraftItem";

const ListingDraftsPage = () => {

    const [drafts, setDrafts] = useState([]);
    const notificate = useNotification();
    const navigate = useNavigate();

    async function createListing() {
        try {
            const data = await apiFetch("/api/listing/create", {method: "POST"}, {});

            if (!data.id) {
                throw new Error("Ошибка при создании объявления");
            }

            notificate(data.message, "success");

            navigate(`/secure/listing/edit/${data.id}`);
        } catch (err) {
            console.error(err);
            notificate("Ошибка при создании объявления", "error");
        }
    }

    useEffect(() => {
        async function loadDrafts() {
            try {
                const data = await apiFetch("/api/listing/drafts", {}, {});
                setDrafts(data.listings);
            } catch {
                notificate("Ошибка загрузки черновиков", "error");
            }
        }

        loadDrafts();
    }, [notificate])
    return (
        <div className="drafts-listings-grid">
            {drafts.map((listing) => (
                <ListingDraftItem key={listing.id} listing={listing}/>
            ))}
            <article onClick={() => createListing()} className="draft-listing-card new">
                <i className="fa-solid fa-plus fa-xl"></i>
            </article>
        </div>
    );
};

export default ListingDraftsPage;