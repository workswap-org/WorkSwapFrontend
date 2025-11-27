import { useEffect, useState } from 'react';
import { createForumTopic, getRecentTopics, ShortForumTopic } from '@core/lib';
import { Link, useNavigate } from 'react-router-dom';

const forumTopics = [
    {
        title: "Как найти подработку в своём городе?",
        tag: "Работа"
    },
    {
        title: "Обсуждение цен на услуги в 2025 году",
        tag: "Экономика"
    },
    {
        title: "Отзывы о мастерах и исполнителях",
        tag: "Отзывы"
    },
    {
        title: "Поиск напарника для совместной работы",
        tag: "Сообщество"
    },
    {
        title: "Проблемы с заказчиком — что делать?",
        tag: "Помощь"
    },
    {
        title: "Лучшие инструменты для фрилансера",
        tag: "Инструменты"
    },
    {
        title: "Баги и предложения по улучшению WorkSwap",
        tag: "Разработка"
    }
];

export const ForumPage = () => {

    const [theme, setTheme] = useState("");
    const navigate = useNavigate();
    const [tag, setTag] = useState({name: ""});
    const [forumTopics, setForumTopics] = useState<ShortForumTopic[] | []>([]);

    const createTopic = async () => {
        const topicOpenId: string = await createForumTopic(theme, tag.name);
        if (topicOpenId) {
            navigate(`/forum/topic/${topicOpenId}`);
        }
    } 

    useEffect(() => {
        async function loadRecentTopics(count: number, translationsFilter: boolean) {
            const data = await getRecentTopics(count, translationsFilter);
            setForumTopics(data);
        }

        loadRecentTopics(20, false);
    }, [])

    return (
        <div className="forum-page">
            <h1>Форум</h1>
            <div className="forum-topic-list">
                <h3>Создать тему</h3>
                <div className='forum-topic-form'>
                    <textarea 
                        className="forum-input"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="Введите тему..."
                    />
                    <button onClick={createTopic} id="sendBtn" className="hover">
                        <i className="fa-solid fa-paper-plane-top fa-lg"></i>
                    </button>
                </div>
                <h3>Последние темы</h3>
                {forumTopics
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((topic) => (
                        <div key={topic.openId} className="forum-topic-card">
                            <div className="forum-topic-card-meta">
                                <span>{topic.theme}</span>
                                {topic.tagName && (
                                    <div className="forum-topic-card-tag">{topic.tagName}</div>
                                )}
                            </div>
                            <Link to={`/forum/topic/${topic.openId}`} className="read-btn">
                                <span>Читать</span>
                                <div>{topic.postsCount}<i className="fa-regular fa-messages"></i></div>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    );
} 

export {default as ForumLayout} from './ForumLayout';
export {default as ForumTagPage} from './ForumTagPage';
export {default as ForumTopicPage} from './ForumTopicPage';