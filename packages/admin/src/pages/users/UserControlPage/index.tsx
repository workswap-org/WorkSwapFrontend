import { userService, IFullUser, IReview, IShortListing, IUserForumContent } from "@core/lib";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserControlPage = () => {
    const { userOpenId } = useParams();
    const [user, setUser] = useState<IFullUser | null>(null)
    const [listings, setListings] = useState<IShortListing[] | null>(null)
    const [reviews, setReviews] = useState<IReview[] | null>(null)
    const [forumContent, setForumContent] = useState<IUserForumContent | null>(null)

    useEffect(() => {
        async function loadUserInfo() {
            if (!userOpenId) return;
            const data = await userService.getFullUserInfo(userOpenId);
            setUser(data.user);
            setListings(data.listings);
            setReviews(data.reviews);
            setForumContent(data.forumContent);
        }
        loadUserInfo()
    }, [userOpenId])

    return (
        <>
            <div className="card admin-page">
                <div className="card__body">
                    <div className="user-control-page">
                        {user && (
                            <ul className="user-info">
                                <li>ID: {user.id}</li>
                                <li>OpenID: {user.openId}</li>
                                <li>Тип пользователя: {user.type}</li>
                                <li>Имя: {user.name}</li>
                                <li>Телефон: {user.phone ?? '—'}</li>
                                <li>Email: {user.email}</li>
                                <li>О себе: {user.bio ?? '—'}</li>
                                <li>URL аватара: {user.avatarUrl ?? '—'}</li>
                                <li>Провайдер: {user.provider}</li>
                                <li>Языки: {user.languages.join(', ')}</li>
                                <li>Роли: {user.roles.join(', ')}</li>
                                <li>ID локации: {user.locationId ?? '—'}</li>
                                <li>Статус: {user.status ?? '—'}</li>
                                <li>Тип аватара: {user.avatarType}</li>
                                <li>Рейтинг: {user.rating ?? '—'}</li>
                                <li>Telegram подключён: {user.telegramConnected ? 'Да' : 'Нет'}</li>
                                <li>Пользователь принял условия: {user.termsAccepted ? 'Да' : 'Нет'}</li>
                                <li>Дата создания: {user.createdAt}</li>
                                <li>Дата принятия условий: {user.termsAcceptanceDate}</li>
                                <li>Аватар Google: {user.googleAvatar ?? '—'}</li>
                                <li>Загруженный аватар: {user.uploadedAvatar ?? '—'}</li>
                                <li>Телефон виден: {user.phoneVisible ? 'Да' : 'Нет'}</li>
                                <li>Email виден: {user.emailVisible ? 'Да' : 'Нет'}</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserControlPage;