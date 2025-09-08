import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useLocation } from "react-router-dom";
import { API_BASE } from "@/api/config";
import { apiFetch } from "@/lib/apiClient";
import { Link } from "react-router-dom";
import Avatar from "@/components/small-components/Avatar";
import { t } from "i18next";

const RegisterPage = () => {

    const {setAccessToken, logout } = useAuth();
    const location = useLocation();

    const [error, setError] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [studyAccepted, setStudyAccepted] = useState(false);
    const [regButtonActive, setRegButtonActive] = useState(false);
    const [user, setUser] = useState([]);

    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        return () => {
            if (!registered) {
                logout();
                console.log("сработал логаут при уходе со страницы");
            }
        };
    }, []);

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
        
        async function loadRegUser() {
            const data = await apiFetch('/api/user/current')
            setUser(data.user);
        }

        setTimeout(() => loadRegUser(), 0);
    }, [setAccessToken]);

    async function registerUser() {
        setRegistered(true);

        setTimeout(async () => {
            try {
                await apiFetch('/api/user/register')
            } finally {
                const from = new URLSearchParams(location.search).get("redirect") || "/";
                window.location.href = from;
            }
        }, 0);
    }

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

    useEffect(() => {
        if(termsAccepted && studyAccepted) {
            setRegButtonActive(true);
        } else {
            setRegButtonActive(false)
        }
    }, [studyAccepted, termsAccepted])

    return (
        <div style={{gap: '1rem'}}>
            <Link to="/catalog" className="btn btn-primary">
                <i className="fa fa-angle-left fa-lg" aria-hidden="true"></i>
                <span>Вернуться в каталог</span>
            </Link>
            <div className="login-container">
                <h2>Регистрация</h2>

                {/* Отображение ошибок */}
                {error && (
                    <div className="error-message">
                        <p>Ошибка регистрации</p>
                    </div>
                )}

                {/* Блок с данными пользователя */}
                <div th:if="${name}" className="user-info">
                    <p>Добро пожаловать, {user.name}!</p>
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
                        <span>Я принимаю</span>
                        <a href="/terms" target="_blank" className="text-link"> условия пользования</a>
                        <span> и</span>
                        <a href="/privacy-policy" target="_blank" className="text-link"> политику конфиденциальности</a>
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
                        <span>Я понимаю, что это учебный проект и сайт не является коммерческим сервисом</span>
                    </label>
                </div>

                <div id="terms-error" className="error-message" style={{display: 'none'}} th:text="#{register.need.agree}">
                    Необходимо принять условия пользования
                </div>

                <div className="form-footer">
                    <p th:text="#{register.after}">После подтверждения регистрации вы будете перенаправлены в каталог.</p>
                    <button 
                        type="button"
                        onClick={() => registerUser()} 
                        className="btn-google" 
                        id="submitBtn" 
                        disabled={!regButtonActive}
                    >
                        Завершить регистрацию
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;