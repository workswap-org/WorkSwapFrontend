import { useTranslation } from 'react-i18next';
import { useNotification, uploadAvatar } from "@core/lib";
import { useEffect, useState } from 'react';

const ProfileSettings = ({
    user,
    name,
    email,
    phone,
    avatarType,
    bio,

    nameChange,
    phoneChange,
    avatarTypeChange,
    bioChange,

    maxBioLen,
    maxNameLen,
    maxPhoneLen,
}) => {

    const { t } = useTranslation(['tooltips', 'common'])
    const {notificate} = useNotification();

    const [uploadedAvatar, setUploadedAvatar] = useState(undefined);

    useEffect(() => {
        if(user) setUploadedAvatar(user?.uploadedAvatar)
    }, [user])

    const uploadtoCloud = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            const data = await uploadAvatar(formData);

            if (data.imageUrl) {
                setUploadedAvatar(data.imageUrl)
                notificate("Успешно", "success");
            } else {
                return;
            }

            return data.url;
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
                                onChange={(e) => nameChange(e.target.value)}
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
                                onChange={(e) => phoneChange(e.target.value)}
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
                        onClick={() => avatarTypeChange("uploaded", uploadedAvatar)}
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
                        onClick={() => avatarTypeChange("google", user.googleAvatar)}
                    >
                        <img 
                            className="avatar-preview avatar"
                            src={user.googleAvatar} 
                            alt="Google" />
                        <span>{t(`settings.avatarTypes.google`, { ns: 'common' })}</span>
                    </div>
                    <div
                        className={`avatar-option ${avatarType === "default" ? "selected" : ""}`}
                        onClick={() => avatarTypeChange("default", "/images/avatar-placeholder.png")}
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
                            onChange={(e) => bioChange(e.target.value)}
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