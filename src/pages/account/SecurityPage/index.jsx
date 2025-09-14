import { useTranslation, Trans } from 'react-i18next';
import { apiFetch } from "@/lib/apiClient";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/contexts/notifications/NotificationContext";

const SecurityPage = () => {

    const navigate = useNavigate();
    const notificate = useNotification();

    const { t } = useTranslation(['common', 'errors'])

    async function deleteAccount() {
        const res = await apiFetch('/api/user/current/delete', { method: 'DELETE'})
        if (res.success) {
            notificate(res.message, 'success')
            navigate('/logout');
        }
    }

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.security`, { ns: 'common' })}</h2>
            </div>

            <h3><Trans i18nKey="ui.pageInDev" ns="errors" /></h3>

            <button onClick={() => deleteAccount()} className='btn btn-outline-danger'>Удалить аккаунт</button>
        </>
    );
};

export default SecurityPage;