import { Avatar } from "@core/components";
import { useAuth, useNotification } from "@core/lib";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const UserInfoSidebar = ({listingId, author} ) => { 

    const { t } = useTranslation();
    const {notificate} = useNotification();
    const {user, isAuthenticated} = useAuth();

    if (!author) return null;

    const isOwner = !!(user?.openId == author.openId);

    return (
        <aside className="user-info-sidebar">
            {author.name && (
                <div className="seller-card fade-down">
                    <div className="seller-info">
                        <Avatar
                            user={author}
                            size={100}
                            className='seller-avatar'
                        />
                        <div className="seller-meta">
                            <h3>{author.name}</h3>
                            <div className="seller-rating">
                                <span>{t(`labels.rating`, { ns: 'common' })}: </span>
                                <span>{author.rating ?? 0} ★</span>
                            </div>
                            <div className="seller-actions">
                                {isAuthenticated ? (
                                    <>  
                                        {!isOwner && (
                                            <Link 
                                                to={`/account/chat-start?listingId=${listingId}&interlocutorId=${author.id}`} 
                                                className="btn btn-primary"
                                            >
                                                {t(`listing.contactToAuthor`, { ns: 'buttons' })}
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <Link 
                                        to={`/login?redirect=${window.location.pathname}`}
                                        className="btn btn-primary"
                                    >
                                        {t(`loginToWrite`, { ns: 'buttons' })}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {author.name && (
                <div className="contact-card fade-down">
                    <h3>{t(`labels.contacts`, { ns: 'common' })}</h3>
                    <div className="contact-methods">

                        {author.phone && (
                            <div 
                                className="contact-item hover"
                                onClick={() => {
                                    navigator.clipboard.writeText(author.phone)
                                        .then(() => notificate(t(`notification.success.copyPhone`, { ns: 'messages' }), "success"))
                                        .catch(() => notificate("Ошибка", "error"));
                                }}
                            >
                                <div><i className="fa-regular fa-phone fa-lg"></i></div>
                                <span className="contact-value">{author.phone}</span>
                            </div>
                        )}

                        {author.email && (
                            <div 
                                className="contact-item hover"
                                onClick={() => {
                                    navigator.clipboard.writeText(author.email)
                                        .then(() => notificate(t(`notification.success.copyEmail`, { ns: 'messages' }), "success"))
                                        .catch(() => notificate("Ошибка", "error"));
                                }}
                            >
                                <div><i className="fa-regular fa-envelope fa-lg"></i></div>
                                <span className="contact-value ellipsis">{author.email}</span>
                            </div>
                        )}

                        {(author.phone == null && author.email == null) && (
                            <span>Нет контактов</span>
                        )}
                    </div>
                </div>
            )}

            {(!listingId && author.bio) && (
                <div className="contact-card">
                    <h3>{t(`labels.description`, { ns: 'common' })}</h3>
                    <p className="listing-description">{author.bio}</p>
                </div>
            )}
        </aside>
    );
};

export default UserInfoSidebar;