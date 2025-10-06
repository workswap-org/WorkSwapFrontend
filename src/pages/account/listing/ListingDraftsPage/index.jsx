import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@core/lib/services/apiClient";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import ListingDraftItem from "@/components/ui/cards/listing-cards/ListingDraftItem";
import { useTranslation } from 'react-i18next';

const ListingDraftsPage = () => {

    const { t } = useTranslation('common');

    const [drafts, setDrafts] = useState([]);
    const {notificate, notificateFromRes} = useNotification();
    const navigate = useNavigate();

    async function createListing() {
        try {
            const data = await apiFetch("/api/listing/create", {method: "POST"}, {});

            if (!data.id) {
                throw new Error("Ошибка при создании объявления");
            }

            notificateFromRes(data);

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
        <>
            <div className="account-header">
                <h2>{t(`titles.listingDrafts`, { ns: 'common' })}</h2>
            </div>

            <div className="drafts-listings-grid">
                {drafts.map((listing) => (
                    <ListingDraftItem key={listing.id} listing={listing}/>
                ))}
                <article onClick={() => createListing()} className="draft-listing-card new">
                    <i className="fa-solid fa-plus fa-xl"></i>
                </article>
            </div>
        </>
    );
};

export default ListingDraftsPage;