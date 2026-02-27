import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
    apiFetchJson,
    useAuth
} from "@core/lib";
import { useTranslation, Trans } from "react-i18next";

const RegisterPage = () => {

    const { t } = useTranslation(['common', 'buttons', 'errors']);

    const {loadUser} = useAuth();
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || `/`;
    const error = params.get("error") || "";
    const navigate = useNavigate();

    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [message, setMessage] = useState<{message: string, success: boolean} | null>(null);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const register = async (name: string, email: string, password: string) => {

        if (!validateName(name)) return;
        if (!validateEmail(email)) return;
        if (!validatePassword(password)) return;

        // Добавляем redirect к ссылке OAuth encodeURIComponent(redirect)
        const data = { name, email, password }

        const res = await apiFetchJson("/api/auth/register", { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (res) {
            setMessage(res)
        }

        if (res.success == true) {
            loadUser();
            navigate(`/login/success?redirect=${encodeURIComponent(redirect)}`)
        }
    };

    function validateName(name: string) {
        if (!name) {
            setMessage({success: false, message: "name_required"});
            return false;
        }
        const pattern = /^[A-Za-zА-Яа-яЁёÖÄÅöäå\s'-]+$/u;
        if(!pattern.test(name.trim())) {
            setMessage({success: false, message: "name_invalid"});
            return false;
        }
        return true;
    }

    function validateEmail(email: string) {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setMessage({success: false, message: "email_required"});
            return false;
        }

        if (!emailRegex.test(email)) {
            setMessage({success: false, message: "email_invalid"});
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

        if (password != passwordConfirm) {
            setMessage({success: false, message: "password_mismatch"});
            return false;
        }
        return true;
    }

    return (
        <div className="login-body">

            <Link to='/' className="to-main hover">
                <i className="fa fa-angle-left fa-lg" aria-hidden="true"></i>
                <span>{t(`returnToCatalog`, { ns: 'buttons' })}</span>
            </Link>

            <div className="card login-container">
                <h2>{t(`register.label`, { ns: 'common' })}</h2>

                {/* Ошибка входа (если понадобится) */}
                {error && 
                    <div className="alert alert-danger">{t(`login.login_error`, { ns: 'errors' })}</div>
                }

                {message?.message && 
                    <div className={`alert alert-${message.success == true ? "success" : "danger"}`}>
                        {t(`login.${message.message}`, { ns: 'messages' })}
                    </div>
                }

                <div className="playername-input">
                    <input
                        id="name"
                        placeholder={t(`placeholders.name`, { ns: 'common' })}
                        value={name ?? ""}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="playername-input">
                    <input
                        id="email"
                        placeholder={t(`placeholders.email`, { ns: 'common' })}
                        value={email ?? ""}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <input 
                    id="password"
                    type="password"
                    placeholder={t(`placeholders.password`, { ns: 'common' })}
                    value={password ?? ""}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input 
                    id="password-2"
                    type="password"
                    placeholder={t(`placeholders.passwordConfirm`, { ns: 'common' })}
                    value={passwordConfirm ?? ""}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />

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

                <button
                    type="button"
                    className="btn btn-login"
                    disabled={!termsAccepted}
                    onClick={() => register(name, email, password)}
                >
                    {t(`registerButton`, { ns: 'buttons' })}
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;