import { useTranslation } from 'react-i18next';
import { useNotification, uploadAvatar } from "@core/lib";
import { useEffect, useMemo, useState } from 'react';

const ProfileSettings = ({ user, updateUser }) => {

    const name = useMemo(() => {return user.name || ""}, [user.name]);
    const email = useMemo(() => {return user.email || ""}, [user.email]);
    const phone = useMemo(() => {return user.phone || ""}, [user.phone]);
    const bio = useMemo(() => {return user.bio || ""}, [user.bio]);
    const avatarType = useMemo(() => {return user.avatarType || "uploaded"}, [user.avatarType]);

    // Подсчёт символов
    const maxNameLen = 30;
    const maxPhoneLen = 16;
    const maxBioLen = 1900;

    const { t } = useTranslation(['tooltips', 'common'])
    const {notificate} = useNotification();

    const [uploadedAvatar, setUploadedAvatar] = useState(undefined);

    useEffect(() => {
        if(user) setUploadedAvatar(user?.uploadedAvatar)
    }, [user])

    // Валидация телефона
    function validatePhone(value) {
        let val = value;
        if (val.indexOf("+") > 0) val = val.replace(/\+/g, "");
        val = val.replace(/[^0-9+]/g, "");
        if (val.indexOf("+") > 0) val = val.replace(/\D/g, "");
        if ((val.match(/\+/g) || []).length > 1) {
            const parts = val.split("+");
            val = "+" + parts.slice(1).join("");
        }
        return val;
    }

    const uploadtoCloud = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            const imageUrl = await uploadAvatar(formData);

            if (imageUrl) {
                setUploadedAvatar(imageUrl)
                notificate("Успешно", "success");
            } else {
                return;
            }
        } catch (error) {
            console.error("Ошибка загрузки файла:", error);
            notificate("Ошибка загрузки изображения", "error");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.log("бебебе");
            return;
        }
        await uploadtoCloud(file);
        e.target.value = "";
    };

    return (
        <>
            {/* Имя, Email, Телефон */}
            <div className="form-section">
                <h3>{t(`settings.labels.baseInfo`, { ns: 'common' })}</h3>
                <div>
                    <div className="form-group">
                        <label>{t(`labels.name`, { ns: 'common' })}</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                value={name ?? ""}
                                onChange={(e) => updateUser({ name: e.target.value })}
                                maxLength={maxNameLen}
                                required
                            />
                            <span className="char-counter">{name?.length} / {maxNameLen}</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email ?? ""}
                            /* onChange={(e) => emailChange(e.target.value)} */
                            /* required */
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>{t(`labels.phone`, { ns: 'common' })}</label>
                        <div className="input-wrapper">
                            <input
                                type="tel"
                                value={phone ?? ""}
                                onChange={(e) => updateUser(validatePhone({ phone: e.target.value }))}
                                maxLength={maxPhoneLen}
                            />
                            <span className="char-counter">{phone?.length} / {maxPhoneLen}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Аватар */}
            <div className="form-section">
                <h3>{t(`settings.labels.avatar`, { ns: 'common' })}</h3>
                <div className="avatar-options">
                    <div
                        className={`avatar-option ${avatarType === "uploaded" ? "selected" : ""}`}
                        onClick={() => {
                            updateUser({ avatarType: "uploaded" });
                        }}
                    >
                        <img 
                            className="avatar-preview avatar"
                            src={uploadedAvatar || "/images/upload-foto.png"} 
                            onError={(e) => {
                                e.target.src = "/images/upload-foto.png"; // путь к запасной картинке
                            }}
                            alt="Моя" />
                        <span>{t(`settings.avatarTypes.uploaded`, { ns: 'common' })}</span>
                        <input
                            className='d-none'
                            type="file"
                            id="uploadImage"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="uploadImage" className='upload-avatar'>
                            <div><i className="fa-solid fa-upload"></i></div>
                        </label>
                    </div>
                    <div
                        className={`avatar-option ${avatarType === "google" ? "selected" : ""}`}
                        onClick={() => {
                            updateUser({ avatarType: "google" });
                        }}
                    >
                        <img 
                            className="avatar-preview avatar"
                            src={user.googleAvatar} 
                            alt="Google" />
                        <span>{t(`settings.avatarTypes.google`, { ns: 'common' })}</span>
                    </div>
                    <div
                        className={`avatar-option ${avatarType === "default" ? "selected" : ""}`}
                        onClick={() => {
                            updateUser({ avatarType: "default" });
                        }}
                    >
                        <img className="avatar-preview avatar" src="/images/avatar-placeholder.png" alt="Default" />
                        <span>{t(`settings.avatarTypes.default`, { ns: 'common' })}</span>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="form-section">
                <h3>{t(`settings.labels.bio`, { ns: 'common' })}</h3>
                <div className="form-group">
                    <p>{t(`settings.bio`, { ns: 'tooltips' })}</p>
                    <div className="input-wrapper">
                        <textarea 
                            className='bio'
                            value={bio ?? ""}
                            onChange={(e) => updateUser({ bio: e.target.value})}
                            maxLength={maxBioLen}
                            rows={4}
                        />
                        <span className="char-counter">{bio?.length} / {maxBioLen}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileSettings;