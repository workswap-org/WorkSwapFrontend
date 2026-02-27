import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
    apiFetchJson,
    useAuth,
    useNotification
} from "@core/lib";
import {
    Avatar
} from "@core/components";
import { useTranslation, Trans } from "react-i18next";

const RegisterOauthPage = () => {

    const { t } = useTranslation(['common', 'buttons'])

    const {loadUser, user} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const {notificate} = useNotification();

    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
   /*  const [studyAccepted, setStudyAccepted] = useState<boolean>(false); */

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    async function register() {
        const res = await apiFetchJson('/api/auth/google/register', { method: 'PATCH' });
        
        if (res.success) {
            console.log("перезагружаем пользователя")
            const res2 = await loadUser();
            if(res2) {
                notificate(res.message, "success")
                const from = new URLSearchParams(location.search).get("redirect") || "/";
                console.log("Перенаправляем")
                navigate(from, { replace: true }) 
            }
        } else {
            notificate(res.message, "error")
        }
    }

    return (
        <div className="login-body">

            <Link to='/' className="to-main hover">
                <i className="fa fa-angle-left fa-lg" aria-hidden="true"></i>
                <span>{t(`returnToCatalog`, { ns: 'buttons' })}</span>
            </Link>
            <div className="card login-container">
                <h2>{t(`register.label`, { ns: 'common' })}</h2>

                {/* Блок с данными пользователя */}
                <div className="user-info">
                    <p>{t(`register.welcomeUser`, { name: user?.name, ns: 'common' })}</p>
                    <Avatar 
                        user={user} 
                        size={70}
                    />
                    <p>{user?.email ?? ""}</p>
                </div>

                {/* Форма регистрации */}
                <div className="terms-checkbox">
                    <input 
                        type="checkbox" 
                        id="terms" 
                        name="acceptTerms" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        required
                    />
                    <label htmlFor="terms">
                        <Trans i18nKey="register.acceptTerms" ns="common">
                            <a href="/terms" target="_blank" className="text-link"></a>
                            <a href="/privacy-policy" target="_blank" className="text-link"></a>
                        </Trans>
                    </label>
                </div>

                {/* <div className="terms-checkbox">
                    <input 
                        type="checkbox" 
                        id="terms" 
                        name="acceptTerms" 
                        checked={studyAccepted}
                        onChange={(e) => setStudyAccepted(e.target.checked)}
                        required
                    />
                    <label htmlFor="terms">
                        <span>{t(`register.acceptStudy`, { ns: 'common' })}</span>
                    </label>
                </div> */}

                <p>{t(`register.afterRegister`, { ns: 'common' })}</p>
                <button 
                    type="button"
                    onClick={() => register()} 
                    className="btn-login" 
                    id="submitBtn" 
                    disabled={!termsAccepted}
                >
                    {t(`registerButton`, { ns: 'buttons' })}
                </button>
            </div>
        </div>
    );
};

export default RegisterOauthPage;