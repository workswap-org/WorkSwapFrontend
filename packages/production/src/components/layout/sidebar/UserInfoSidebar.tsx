"use client"

import { useTranslation } from 'react-i18next';
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { IShortUserProfile } from "@core/lib/types/models/user";
import Avatar from "@core/components/common/Avatar";
import Link from 'next/link';
import { useI18n } from '@core/lib/contexts/I18nContext';

const UserInfoSidebar = ({listingId, author}: {listingId: number | null, author: IShortUserProfile | null}) => { 

    const { dict } = useI18n();
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
                                <span>{dict.common.labels.rating}: </span>
                                <span>{author.rating ?? 0} ★</span>
                            </div>
                            <div className="seller-actions">
                                {isAuthenticated ? (
                                    <>  
                                        {!isOwner && (
                                            <Link 
                                                href={`/account/chat-start?listingId=${listingId}&interlocutorId=${author.id}`} 
                                                className="btn btn-primary"
                                            >
                                                {dict.buttons.listing.contactToAuthor}
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={`/login?redirect=${window.location.pathname}`}
                                        className="btn btn-primary"
                                    >
                                        {dict.buttons.loginToWrite}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {author.name && (
                <div className="contact-card fade-down">
                    <h3>{dict.common.labels.contacts}</h3>
                    <div className="contact-methods">

                        {author.phone && (
                            <div 
                                className="contact-item hover"
                                onClick={() => {
                                    navigator.clipboard.writeText(author.phone ?? "")
                                        .then(() => notificate(dict.messages.notification.success.copyPhone, "success"))
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
                                    navigator.clipboard.writeText(author.email ?? "")
                                        .then(() => notificate(dict.messages.notification.success.copyEmail, "success"))
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
        </aside>
    );
};

export default UserInfoSidebar;