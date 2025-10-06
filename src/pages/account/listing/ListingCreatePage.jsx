import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    getDraftsListings,
    useNotification,
    createListing
} from "@core/lib";
import { useTranslation } from 'react-i18next';

export default function ListingCreatePage() {

    const navigate = useNavigate();
    const { notificate, notificateFromRes } = useNotification();
    const { t } = useTranslation('common');

    useEffect(() => {
        async function createL() {
            try {
                const data = await createListing();

                if (!data.id) {
                    throw new Error(t(`notification.misc.error.listingCreate`, { ns: 'messages' }));
                }

                notificateFromRes(data);

                navigate(`/secure/listing/edit/${data.id}`, { replace: true });
            } catch (err) {
                console.error(err);
                notificate(t(`notification.misc.error.listingCreate`, { ns: 'messages' }), "error");
            }
        }

        async function loadDrafts() {
            try {
                const data = await getDraftsListings();
                const drafts = data.listings;
                if (drafts.length === 0) {
                    createL()
                } else if (drafts.length === 1) {
                    const id = drafts[0]?.id;
                    navigate(`/secure/listing/edit/${id}`, { replace: true });
                    notificate(t(`notification.misc.hadDraft`, { ns: 'messages' }), "info");
                } else if (drafts.length > 1) {
                    navigate(`/secure/listing/drafts`, { replace: true });
                } else {
                    notificate(t(`notification.misc.error.draftLoading`, { ns: 'messages' }), "error");
                }
            } catch {
                notificate(t(`notification.misc.error.draftLoading`, { ns: 'messages' }), "error");
            }
        }

        loadDrafts();
    }, [navigate, notificate, notificateFromRes, t]);

    return <p>Создаём объявление...</p>;
}