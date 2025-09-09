import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "@/api/config";
import { apiFetch } from "@/lib/apiClient";
import { Link } from "react-router-dom";
import Avatar from "@/components/small-components/Avatar";
import { useNotification } from "@/contexts/notifications/NotificationContext";
import "#/css/public/pages/login-page.css"

const RegisterPage = () => {

    const {setAccessToken, logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const notificate = useNotification();

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [studyAccepted, setStudyAccepted] = useState(false);
    const [regButtonActive, setRegButtonActive] = useState(false);

    const [registered, setRegistered] = useState(false);

    const registeredRef = useRef(registered);

    useEffect(() => {
        registeredRef.current = registered;
    }, [registered]);

    useEffect(() => {
        return () => {
            if (!registeredRef.current) {
                logout();
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

    }, [setAccessToken]);

    async function registerUser() {
        async function register() {
            const data = await apiFetch('/api/user/register', { method: 'PATCH' });
            if (data.success) {
                setRegistered(true);
                notificate(data.message, "success")
                const from = new URLSearchParams(location.search).get("redirect") || "/";
                navigate(from, { replace: true })
            } else {
                notificate(data.message, "error")
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
                <Link to="/catalog" className="btn btn-primary">
                    <i className="fa fa-angle-left fa-lg" aria-hidden="true"></i>
                    <span>Вернуться в каталог</span>
                </Link>
                <div className="login-container">
                    <h2>Регистрация</h2>

                    {/* Блок с данными пользователя */}
                    <div className="user-info">
                        <p>Добро пожаловать, {user?.name}!</p>
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
        </div>
    );
};

export default RegisterPage;