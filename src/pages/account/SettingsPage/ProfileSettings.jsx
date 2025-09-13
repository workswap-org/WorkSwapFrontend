import { useTranslation } from 'react-i18next';

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
                            value={email}
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
                                value={phone}
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
                        onClick={() => avatarTypeChange("uploaded", user.uploadedAvatar)}
                    >
                        <img className="avatar-preview avatar p80-avatar" src={user.uploadedAvatar || "/images/upload-foto.png"} alt="Моя" />
                        <span>{t(`settings.avatarTypes.uploaded`, { ns: 'common' })}</span>
                    </div>
                    <div
                        className={`avatar-option ${avatarType === "google" ? "selected" : ""}`}
                        onClick={() => avatarTypeChange("google", user.googleAvatar)}
                    >
                        <img className="avatar-preview avatar p80-avatar" src={user.googleAvatar} alt="Google" />
                        <span>{t(`settings.avatarTypes.google`, { ns: 'common' })}</span>
                    </div>
                    <div
                        className={`avatar-option ${avatarType === "default" ? "selected" : ""}`}
                        onClick={() => avatarTypeChange("default", "/images/avatar-placeholder.png")}
                    >
                        <img className="avatar-preview avatar p80-avatar" src="/images/avatar-placeholder.png" alt="Default" />
                        <span>{t(`settings.avatarTypes.default`, { ns: 'common' })}</span>
                    </div>
                </div>

                {avatarType === "uploaded" && (
                    <div className="upload-controls">
                        {/* Твой uploadControls компонент */}
                        <input type="file" name="avatarFile" />
                    </div>
                )}
            </div>

            {/* Bio */}
            <div className="form-section">
                <h3>{t(`settings.labels.bio`, { ns: 'common' })}</h3>
                <div className="form-group">
                    <p>{t(`settings.bio`, { ns: 'tooltips' })}</p>
                    <div className="input-wrapper">
                        <textarea 
                            value={bio}
                            onChange={(e) => bioChange(e.target.value)}
                            maxLength={maxBioLen}
                            rows={4}
                        />
                        <span className="char-counter">{bio.length} / {maxBioLen}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileSettings;