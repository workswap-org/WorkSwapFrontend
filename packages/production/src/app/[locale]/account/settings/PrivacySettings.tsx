import { useI18n } from '@core/lib/contexts/I18nContext';
import { IFullUser } from '@core/lib/types/models/user';
import { useMemo } from 'react';

interface SettingsProps {
    user: IFullUser;
    updateUser: (updates: Partial<IFullUser>) => void;
}
const PrivacySettings = ({ user, updateUser }: SettingsProps) => {

    const { dict } = useI18n()

    const phoneVisible = useMemo(() => {return user.phoneVisible || false}, [user.phoneVisible]);
    const emailVisible = useMemo(() => {return user.emailVisible || false}, [user.emailVisible]);

    return (
        <div className="form-section">
            <h3>{dict.common.settings.labels.privacy}</h3>
            <div className="form-group">
                <label>{dict.tooltips.settings.privacy}</label>
                <div className="status-toggle">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={phoneVisible}
                            onChange={(e) => updateUser({ phoneVisible: e.target.checked })}
                        />
                        <span className="slider"></span>
                    </label>
                    <span>{dict.tooltips.settings.phoneVisibility}</span>
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
                    <span>{dict.tooltips.settings.emailVisibility}</span>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;