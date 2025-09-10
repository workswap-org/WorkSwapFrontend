import { Trans, useTranslation } from 'react-i18next';

const AccountPage = () => {

    const { t } = useTranslation('common')

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.account`, { ns: 'common' })}</h2>
            </div>

            <h3><Trans i18nKey="errors.pageInDev" ns="errors" /></h3>
        </>
    );
};

export default AccountPage;