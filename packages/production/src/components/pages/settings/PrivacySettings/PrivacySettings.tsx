import { useI18n } from '@core/lib/contexts/I18nContext';
import { IFullUser } from '@core/lib/types/models/user';
import { useMemo } from 'react';
import SettingSection from '../SettingSection/SettingSection';

interface SettingsProps {
    user: IFullUser;
    updateUser: (updates: Partial<IFullUser>) => void;
}
const PrivacySettings = ({ user, updateUser }: SettingsProps) => {

    const { dict } = useI18n()

    const phoneVisible = useMemo(() => {return user.phoneVisible || false}, [user.phoneVisible]);
    const emailVisible = useMemo(() => {return user.emailVisible || false}, [user.emailVisible]);

    return (
        <SettingSection
            title={dict.common.settings.labels.privacy}
        >
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
        </SettingSection>
    );
};

export default PrivacySettings;