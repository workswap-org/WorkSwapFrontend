import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { 
    deleteCurrentUser, 
    useAuth, 
    useNotification 
} from "@core/lib";

const SecurityPage = () => {

    const navigate = useNavigate();
    const {notificate} = useNotification();
    const {user} = useAuth();

    const { t } = useTranslation(['common', 'errors'])

    async function deleteAccount() {
        const res = await deleteCurrentUser();
        if (res.ok) {
            notificate(`Account ${user.email} successfully deleted`, 'success')
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