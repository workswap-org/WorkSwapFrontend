import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {

    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="body-center">
            <div className='card' style={{height: 'fit-content'}}>
                <div className='body'>
                    <h1>{t(`fallbacks.pageNotFound`, { ns: 'common' })}</h1>
                    <button onClick={() => navigate(-1)} className="btn btn-primary">
                        <i className="fa-solid fa-left"></i>
                        {t(`back`, { ns: 'navigation' })}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;