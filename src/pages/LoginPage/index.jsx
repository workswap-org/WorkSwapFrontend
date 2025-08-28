import { API_BASE } from "@/api/config";
import { useEffect } from "react";

const LoginPage = () => {
    useEffect(() => {
        // Создаём link для CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/css/public/pages/login-page.css"; // путь к CSS из public
        link.id = "login-page-css";
        document.head.appendChild(link);

        // Убираем стили при размонтировании
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    // Редирект на Google OAuth
    const handleGoogleLogin = () => {
        // Получаем откуда пользователь пришёл (если есть)
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") || `${window.location.origin}/`; // дефолт — корень

        // Добавляем redirect к ссылке OAuth
        window.location.href = `${API_BASE}/api/auth/authorize?redirect=${encodeURIComponent(redirect)}`;
    };

    return (
        <div className="login-container">
            <h2>Вход в систему</h2>

            {/* Ошибка входа (если понадобится) */}
            {/* {error && <div className="alert alert-danger">Неверные учетные данные</div>} */}

            <div>
                <button
                    type="button"
                    className="btn btn-google"
                    onClick={handleGoogleLogin}
                >
                    Войти через Google
                </button>
            </div>
        </div>
    );
};

export default LoginPage;