import Avatar from "@/components/small-components/Avatar";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { Link } from "react-router-dom";
import { useNotification } from "@/lib/contexts/notifications/NotificationContext";
import { useTranslation } from 'react-i18next';

const UserInfoSidebar = ( {listingId, author} ) => {

    const { t } = useTranslation();
    const {notificate} = useNotification();

    const {user, isAuthenticated} = useAuth();

    const isOwner = !!(user?.id == author.id);

    return (
        <aside className="user-info-sidebar">
            <div className="seller-card">
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
                            <span>{author.rating}</span> ★
                        </div>
                        <div className="seller-actions">
                            {isAuthenticated ? (
                                <>  
                                    {!isOwner && (
                                        <>
                                            <Link 
                                                to={`/secure/chat-start?listingId=${listingId}&sellerId=${author.id}`} 
                                                className="btn btn-primary"
                                            >
                                                {t(`listing.contactToAuthor`, { ns: 'buttons' })}
                                            </Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="btn btn-primary"
                                >
                                    {t(`loginToWrite`, { ns: 'buttons' })}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-card">
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
                            <span className="contact-value">{author.email}</span>
                        </div>
                    )}

                    {(author.phone == null && author.email == null) && (
                         <span>Нет контактов</span>
                    )}
                </div>
            </div>

            {(!listingId && author.bio) && (
                <div className="contact-card">
                    <h3>{t(`labels.description`, { ns: 'common' })}</h3>
                    <p className="listing-description">{author.bio}</p>
                </div>
            )}
            
            
            {/* <div className="resume-card hover-animation-card" th:if="${resume != null and resume.published and activePage == 'profile'}" th:onclick="window.location.href = '/resume/' + [[${resume.id}]]">
                <img th:replace="~{fragments/small-components :: avatar(user=${user}, size='70', className='')}"></img>
                <div className="resume-info">
                    <h3 th:text="${resume.profession}">Специальность</h3>
                    <div className="resume-meta">
                        <span className="resume-education" th:text="#{'education.' + ${resume.education}}">Образование</span>
                    </div>
                </div>
            </div> */}
        </aside>
    );
};

export default UserInfoSidebar;