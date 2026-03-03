import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const PrivacySettings = ({ user, updateUser }) => {

    const { t } = useTranslation(['tooltips', 'common'])

    const phoneVisible = useMemo(() => {return user.phoneVisible || false}, [user.phoneVisible]);
    const emailVisible = useMemo(() => {return user.emailVisible || false}, [user.emailVisible]);

    return (
        <div className="form-section">
            <h3>{t(`settings.labels.privacy`, { ns: 'common' })}</h3>
            <div className="form-group">
                <label>{t(`settings.privacy`, { ns: 'tooltips' })}</label>
                <div className="status-toggle">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={phoneVisible}
                            onChange={(e) => updateUser({ phoneVisible: e.target.checked })}
                        />
                        <span className="slider"></span>
                    </label>
                    <span>{t(`settings.phoneVisibility`, { ns: 'tooltips' })}</span>
                </div>
            </div>

            <div className="form-group">
                <div className="status-toggle">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={emailVisible}
                            onChange={(e) => updateUser({ emailVisible: e.target.checked })}
                        />
                        <span className="slider"></span>
                    </label>
                    <span>{t(`settings.emailVisibility`, { ns: 'tooltips' })}</span>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;