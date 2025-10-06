import { useTranslation } from 'react-i18next';
import { apiFetch } from "@core/lib/services/apiClient";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@core/lib/contexts/NotificationContext";

const SecurityPage = () => {

    const navigate = useNavigate();
    const {notificate} = useNotification();

    const { t } = useTranslation(['common', 'errors'])

    async function deleteAccount() {
        const res = await apiFetch('/api/user/current/delete', { method: 'DELETE'})
        if (res.success) {
            notificate(res.message, 'success')
            navigate('/logout', { replace: true });
        }
    }

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.security`, { ns: 'common' })}</h2>
            </div>

            {/* <h3><Trans i18nKey="ui.pageInDev" ns="errors" /></h3> */}

            <button 
                onClick={() => {
                    const confirmed = window.confirm(t(`confirms.deleteAccount`, { ns: 'messages' }));
                    if (confirmed) {
                        deleteAccount();
                    }
                }} 
                className='btn btn-outline-danger'
            >
                {t(`security.deleteAccount`, { ns: 'buttons' })}
            </button>
        </>
    );
};

export default SecurityPage;