import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { API_BASE } from "@/api/config";
import { apiFetch } from "@/lib/apiClient";
import Avatar from "@/components/small-components/Avatar";
import { useNotification } from "@/lib/contexts/notifications/NotificationContext";
import "@/css/pages/login-page.css"
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation, Trans } from "react-i18next";

const RegisterPage = () => {

    const { t } = useTranslation(['common', 'buttons'])

    const {setAccessToken, user, setUser} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const notificate = useNotification();

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [studyAccepted, setStudyAccepted] = useState(false);
    const [regButtonActive, setRegButtonActive] = useState(false);

    useEffect(() => {
        
        fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            setAccessToken(data.accessToken);
        })
        .catch(err => console.error("Auth failed:", err));

    }, [setAccessToken]);

    async function registerUser() {
        async function register() {
            const res = await apiFetch('/api/user/register', { method: 'PATCH' });
            
            if (res.success) {
                try {
                    const data = await apiFetch('/api/user/current')
                    setUser(data.user);
                } finally {
                    notificate(res.message, "success")
                    const from = new URLSearchParams(location.search).get("redirect") || "/";
                    navigate(from, { replace: true })
                }
            } else {
                notificate(res.message, "error")
            }
        }

        register();
    }

    useEffect(() => {
        if(termsAccepted && studyAccepted) {
            setRegButtonActive(true);
        } else {
            setRegButtonActive(false)
        }
    }, [studyAccepted, termsAccepted])

    return (
        <div className="login-body">
            <div style={{gap: '1rem'}}>
                <Link to='/logout' className="btn btn-primary">
                    <i className="fa fa-angle-left fa-lg" aria-hidden="true"></i>
                    <span>{t(`returnToCatalog`, { name: user?.name, ns: 'buttons' })}</span>
                </Link>
                <br/>
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

                    <div className="terms-checkbox">
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
                    </div>

                    <div className="form-footer">
                        <p th:text="#{register.after}">{t(`register.afterRegister`, { ns: 'common' })}</p>
                        <button 
                            type="button"
                            onClick={() => registerUser()} 
                            className="btn-google" 
                            id="submitBtn" 
                            disabled={!regButtonActive}
                        >
                            {t(`register`, { ns: 'buttons' })}
                        </button>
                    </div>
                </div>
            </div>
            <LanguageSwitcher/>
        </div>
    );
};

export default RegisterPage;