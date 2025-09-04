import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/apiClient";
import { useNotification } from "@/contexts/notifications/NotificationContext";

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
                notificate(err, "error");
                // можно показать ошибку пользователю
            }
        }

        createListing();
    }, [navigate]);

    return <p>Создаём объявление...</p>;
}