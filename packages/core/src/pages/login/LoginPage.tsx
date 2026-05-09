import { API_BASE } from "@core/config";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { apiFetchJson } from "@core/lib/services/utils/apiClient";

const LoginPage = () => {

    const { t } = useTranslation(['common', 'buttons'])

    const params = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    const error = params.get("error") || "";
    const redirect = params.get("redirect") || `/`;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{message: string, success: boolean} | null>(null);

    // Редирект на Google OAuth
    const handleGoogleLogin = () => {

        openGoogleAuth();

        function openGoogleAuth() {
            const width = 600;
            const height = 700;
            const left = (screen.width - width) / 2;
            const top = (screen.height - height) / 2;

            const redirectDomain = window.location.origin;

            window.open(
                `${API_BASE}/api/auth/google?redirect=${encodeURIComponent(redirectDomain)}`,
                'googleAuth',
                `width=${width},height=${height},top=${top},left=${left}`
            );
        }
    };

    function validateEmail(email: string) {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setMessage({success: false, message: "login.email_required"});
            return false;
        }

        if (!emailRegex.test(email)) {
            setMessage({success: false, message: "login.email_invalid"});
            return false;
        }
        return true;
    }

    function validatePassword(password: string) {

        if (!password) {
            setMessage({success: false, message: "password_required"});
            return false;
        }

        if (password.length < 8) {
            setMessage({success: false, message: "password_short"});
            return false;
        }
        return true;
    }

    const handleLogin = async (email: string, password: string) => {

        const emailOk = validateEmail(email);
        if (!emailOk) return;
        const passwordOk = validatePassword(password);
        if (!passwordOk) return;

        // Добавляем redirect к ссылке OAuth encodeURIComponent(redirect)
        const data = {
            email,
            password
        }
        const res = await apiFetchJson("/api/auth/login", { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        setMessage(res);
        if (res.success == true) {
            setTimeout(() => {
                navigate(`/login/success?redirect=${encodeURIComponent(redirect)}`)
            }, 1500);
        }
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            console.log("Oauth авторизация прошла успешно", event)
            if (event.data?.type === 'oauthSuccess') {
                setMessage({success: false, message: "login_success"});
                navigate((event.data.isNewUser ? "/register/oauth" : "/login/success") + `?redirect=${encodeURIComponent(redirect)}` || '/');
            } else if (event.data?.type === 'oauthFailure') {
                setMessage({success: false, message: "login_error"});
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

    return (
        <div className="login-body">

            <Link to='/' className="to-main hover">
                <i className="fa fa-angle-left fa-lg" aria-hidden="true"></i>
                <span>{t(`returnToCatalog`, { ns: 'buttons' })}</span>
            </Link>

            <div className="card login-container">
                <h2>{t('login.label', { ns: 'common' })}</h2>

                {/* Ошибка входа (если понадобится) */}
                {error && 
                    <div className="alert alert-danger">{t(`register.${error}`, { ns: 'errors' })}</div>
                }

                {message?.message && 
                    <div className={`alert alert-${message.success == true ? "success" : "danger"}`}>
                        {t(`login.${message.message}`, { ns: 'messages' })}
                    </div>
                }

                <input 
                    id="login"
                    value={email ?? ""}
                    placeholder={t(`placeholders.email`, { ns: 'common' })}
                    onChange={(e) => setEmail(e.target.value)}
                /> 

                <input 
                    id="password"
                    type="password"
                    value={password ?? ""}
                    placeholder={t(`placeholders.password`, { ns: 'common' })}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="button"
                    className="btn btn-login"
                    onClick={() => handleLogin(email, password)}
                >
                    {t('login', { ns: 'buttons' })}
                </button>

                <button
                    type="button"
                    className="btn btn-google hover"
                    onClick={handleGoogleLogin}
                >
                    <img src="/images/google.png" className="google-logo" alt="Google" />
                    <span>{t('loginGoogle', { ns: 'buttons' })}</span>
                </button>

                <Link to="/register" className="to-register hover">{t('createAccount', { ns: 'buttons' })}</Link>
            </div>
        </div>
    );
};

export default LoginPage;