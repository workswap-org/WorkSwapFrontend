import { useAuth } from '@core/lib/contexts/AuthContext';
import { useI18n } from '@core/lib/contexts/I18nContext';
import { useNotification } from '@core/lib/contexts/NotificationContext';
import { userService } from '@core/lib/services/user';
import { redirect } from 'next/navigation';

const SecurityPage = () => {

    const { notificate } = useNotification();
    const { user } = useAuth();

    const { dict } = useI18n();

    async function deleteAccount() {
        const res = await userService.deleteCurrentUser();
        if (res.ok) {
            notificate(`Account ${user?.email} successfully deleted`, 'success')
            redirect('/logout');
        }
    }

    return (
        <>
            <div className="account-header">
                <h2>{dict.common.titles.security}</h2>
            </div>

            <button 
                onClick={() => {
                    const confirmed = window.confirm(dict.messages.confirms.deleteAccount);
                    if (confirmed) {
                        deleteAccount();
                    }
                }} 
                className='btn btn-outline-danger'
            >
                {dict.buttons.security.deleteAccount}
            </button>
        </>
    );
};

export default SecurityPage;