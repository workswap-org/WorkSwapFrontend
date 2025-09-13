import { useTranslation, Trans } from 'react-i18next';

const SecurityPage = () => {

    const { t } = useTranslation(['common', 'errors'])

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.security`, { ns: 'common' })}</h2>
            </div>

            <h3><Trans i18nKey="ui.pageInDev" ns="errors" /></h3>
        </>
    );
};

export default SecurityPage;