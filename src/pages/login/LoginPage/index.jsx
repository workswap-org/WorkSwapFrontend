import { API_BASE } from "@/api/config";
import "@/css/pages/login-page.css"
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const LoginPage = () => {

    const { t } = useTranslation(['common', 'buttons'])

    const params = new URLSearchParams(window.location.search);
    const error = params.get("error") || "";

    // Редирект на Google OAuth
    const handleGoogleLogin = () => {
        // Получаем откуда пользователь пришёл (если есть)
        const redirect = params.get("redirect") || `${window.location.origin}/`; // дефолт — корень

        // Добавляем redirect к ссылке OAuth
        window.location.href = `${API_BASE}/api/auth/authorize?redirect=${encodeURIComponent(redirect)}`;
    };

    return (
        <div className="login-body">
            <div className="card login-container">
                <h2>{t('login.label', { ns: 'common' })}</h2>

                {/* Ошибка входа (если понадобится) */}
                {error && 
                    <div className="alert alert-danger">{t(`register.${error}`, { ns: 'errors' })}</div>
                }

                <div>
                    <button
                        type="button"
                        className="btn btn-google"
                        onClick={handleGoogleLogin}
                    >
                        {t('loginGoogle', { ns: 'buttons' })}
                    </button>
                </div>
            </div>
            <LanguageSwitcher/>
        </div>
    );
};

export default LoginPage;