import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/apiClient";
import { useNotification } from "@/lib/contexts/notifications/NotificationContext";

export default function ListingCreatePage() {

    const navigate = useNavigate();
    const notificate = useNotification();

    useEffect(() => {
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

        async function loadDrafts() {
            try {
                const data = await apiFetch("/api/listing/drafts", {}, {});
                const drafts = data.listings;
                if (drafts.length === 0) {
                    createListing()
                } else if (drafts.length === 1) {
                    const id = drafts[0]?.id;
                    navigate(`/secure/listing/edit/${id}`);
                    notificate("У вас остался сохранённый черновик", "info");
                } else if (drafts.length > 1) {
                    navigate(`/secure/listing/drafts`);
                } else {
                    notificate("Ошибка загрузки черновиков", "error");
                }
            } catch {
                notificate("Ошибка загрузки черновиков", "error");
            }
        }

        loadDrafts();
    }, [navigate, notificate]);

    return <p>Создаём объявление...</p>;
}