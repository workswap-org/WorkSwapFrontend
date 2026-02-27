import { useCallback, useEffect, useState } from "react";
import { apiFetch, useAuth } from "@core/lib";
import { useNavigate } from "react-router-dom"

const VerifyAccountPage = () => {

    const navigate = useNavigate();
    
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || `/`;
    const { loadUser, user } = useAuth();
    const [code, setCode] = useState<string>('');
    const [message, setMessage] = useState<{ message: string, success: boolean } | null>(null)
    const [isCodeSent, setCodeSent] = useState(false);

    useEffect(() => {
        if (user?.status == "PENDING") return;
        navigate(`/login/success?redirect=${encodeURIComponent(redirect)}`)
    }, [user]);

    const sendCode = useCallback(async () => {
        setCodeSent(true);
    
        const res = await apiFetch("/api/auth/send-verify-code", { method: 'POST' });

        if (res.ok) {
            setMessage({message: "Проверьте почту", success: true});
        } else {
            setMessage({message: "Ошибка отправки письма", success: false});
            setCodeSent(false);
        }
    }, []);

    const verifyAccount = useCallback(async () => {
    
        const res = await apiFetch(`/api/auth/verify?code=${code}`, { method: 'POST' });

        if (res.ok) {
            loadUser();
        }
    }, [code]);

    return (
        <div className="login-body">
            <div className="card login-container">
                <h2>Верификация Email</h2>

                {/* Ошибка входа (если понадобится) */}

                {message?.message && 
                    <div className={`alert alert-${message.success == true ? "success" : "danger"}`}>{message.message}</div>
                }

                {isCodeSent && (
                    <input 
                        id="login"
                        value={code ?? ""}
                        placeholder="Код из почты"
                        onChange={(e) => setCode(e.target.value)}
                    />
                )}

                {isCodeSent && 
                    <div className="alert alert-info">Должно прийти письмо от kkodolov40@gmail.com</div>
                }

                <button
                    type="button"
                    className="btn"
                    id="sendCode"
                    disabled={isCodeSent}
                    onClick={() => sendCode()}
                >
                    {!isCodeSent ? 
                        `Отправить код на почту ${user?.email}` : 
                        "Код отправлен"
                    }
                </button>

                <button
                    type="button"
                    className="btn hover"
                    id="sendCode"
                    disabled={!isCodeSent || code.length < 6}
                    onClick={() => verifyAccount()}
                >
                    Подтвердить
                </button>
            </div>
        </div>
    );
};

export default VerifyAccountPage;