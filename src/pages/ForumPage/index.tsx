import { useState } from 'react';
import { createForumTopic } from '@core/lib';
import { useNavigate } from 'react-router-dom';

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

    const createTopic = async () => {
        const topicOpenId: string = await createForumTopic(theme, tag.name);
        if (topicOpenId) {
            navigate(`/forum/topic/${topicOpenId}`);
        }
    } 

    return (
        <div className="forum-page">
            <div className="forum-topic-list">
                <div>
                    <h2>Создать тему</h2>
                    <input 
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="Введите тему..."
                    />
                    <button onClick={createTopic}>Начать обсуждение</button>
                </div>
                {forumTopics.map((topic) => (
                    <div key={topic.tag} className="forum-topic-card">
                        <div className="forum-topic-card-meta">
                            <span>{topic.title}</span>
                            <div className="forum-topic-card-tag">{topic.tag}</div>
                        </div>
                        <div className="read-btn">Читать</div>
                    </div>
                ))}
            </div>
        </div>
    );
} 

export {default as ForumLayout} from './ForumLayout';
export {default as ForumTagPage} from './ForumTagPage';
export {default as ForumTopicPage} from './ForumTopicPage';