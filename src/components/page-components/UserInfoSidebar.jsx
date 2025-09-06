import Avatar from "@/components/small-components/Avatar";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { Link } from "react-router-dom";
import { useNotification } from "@/contexts/notifications/NotificationContext";

const UserInfoSidebar = ( {listingId, author} ) => {

    const notificate = useNotification();

    const {user} = useAuth();
    const isAuthenticated = !!user;

    const isOwner = !!(user.id == author.id);
    
    const [isFavorite, setFavorite] = useState(false);
    const [chat, setChat] = useState(0);

    useEffect(() => {

        if (!author.id) return;

        const params = {};
        if (author.id) params.sellerId = author.id;
        if (listingId) params.listingId = listingId;

        async function getChat() {
            const data = await apiFetch(`/api/chat/get`, {}, params);
            setChat(await data.chatId);
        }

        getChat();
        
    }, [author, listingId]);

    useEffect(() => {
        async function checkFavorite() {
            const data = await apiFetch(`/api/listing/${listingId}/favorite/status`);
            setFavorite(await data.isFavorite);
        }

        if (listingId) {
            checkFavorite();
        }
        
    }, [listingId]);

    const toggleFavorite = async () => {
        if (!listingId) {
            notificate("Ошибка", "error");
            return;
        }

        try {
            const res = await apiFetch(`/api/listing/${listingId}/favorite`, { method: "POST" });

            if (res?.message) {
                notificate(res.message, "success");
            } else {
                notificate("Ошибка", "error");
            }

            // сразу обновляем статус избранного
            const data = await apiFetch(`/api/listing/${listingId}/favorite/status`);
            setFavorite(data.isFavorite);

        } catch (err) {
            console.error(err);
            notificate("Ошибка при переключении избранного", "error");
        }
    };

    return (
        <aside className="listing-sidebar">
            <div className="seller-card" th:if="${user != null}">
                <Avatar
                    user={author}
                    size={100}
                    className='seller-avatar'
                />
                <div className="seller-info">
                    <h4>{author.name}</h4>
                    <div className="seller-rating">
                        <span>Рейтинг: </span>
                        <span>{author.rating}</span> ★
                    </div>
                </div>
                <div className="seller-actions">

                    {isAuthenticated && (
                        <>  
                            {!isOwner && (
                                <>
                                    <Link 
                                        to={`/secure/messenger?chat=${chat}`} 
                                        className="btn btn-primary"
                                    >Написать сообщение</Link>
                                    
                                    <button onClick={toggleFavorite} className="btn btn-outline-primary">
                                        {isFavorite && (
                                            <span>Убрать из избранного</span>
                                        )}

                                        {!isFavorite && (
                                            <span>Добавить в избраннное</span>
                                        )}
                                    </button>
                                </>
                            )}

                            {isOwner && (
                                <a th:if="${isOwner and activePage == 'listing'}"
                                    th:href="@{'/secure/listing/edit/' + ${listing.id}}"
                                    className="btn btn-primary"
                                >Редактировать объявление</a>
                            )}
                        </>
                    )}

                    {!isAuthenticated && (
                        <a href="/login" className="btn btn-primary" th:text="#{login.to.write}">Войти, чтобы написать</a>
                    )}
                </div>
            </div>

            <div className="contact-card" th:if="${user != null}">
                <h3>Контактная информация</h3>
                <div className="contact-methods">

                    {author.phone && (
                        <div className="contact-item" th:if="${user.phoneVisible and user.phone != null}">
                            <span className="contact-icon">📱</span>
                            <span>{author.phone}</span>
                        </div>
                    )}
                    {author.email && (
                        <div className="contact-item" th:if="${user.emailVisible and user.email != null}">
                            <span className="contact-icon">✉️</span>
                            <span>{author.email}</span>
                        </div>
                    )}

                    {!(author.phone && author.email) && (
                         <span>Нет контактов</span>
                    )}
                </div>
            </div>
            
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