import { useEffect, useState } from 'react';
import { createForumTopic, ForumTag, getFoumTags, getRecentTopics, ShortForumTopic } from '@core/lib';
import { Link, useNavigate } from 'react-router-dom';
import { TextareaRT1 } from '@core/components';
import { useTranslation } from 'react-i18next';

export const ForumPage = () => {

    const { t } = useTranslation('forumtags')

    const [theme, setTheme] = useState("");
    const navigate = useNavigate();
    const [newThemeTag, setNewThemeTag] = useState<ForumTag | null>(null);
    const [tags, setTags] = useState<ForumTag[] | []>([]);
    const [sending, setSending] = useState(false);
    const [forumTopics, setForumTopics] = useState<ShortForumTopic[] | []>([]);

    const createTopic = async () => {
        setSending(true);
        const topicOpenId: string = await createForumTopic(theme, newThemeTag?.name);
        setSending(false);
        if (topicOpenId) {
            setTheme('');
            navigate(`/forum/topic/${topicOpenId}`);
        }
    } 

    useEffect(() => {
        async function loadRecentTopics(count: number, translationsFilter: boolean) {
            const data = await getRecentTopics(count, translationsFilter);
            setForumTopics(data);
        }
        async function loadTags() {
            const data = await getFoumTags();
            setTags(data);
        }

        loadTags();
        loadRecentTopics(20, false);
    }, [])

    return (
        <div className="forum-page">
            <h1>Форум</h1>
            <div className="forum-topic-list">
                <h3>Создать тему</h3>
                <div className='forum-topic-form'>
                    <TextareaRT1 
                        value={theme} 
                        setValue={setTheme} 
                        className="forum-comment" 
                        placeholder='Введите тему...'
                    />
                    <button onClick={createTopic} id="sendBtn" className="hover" disabled={sending}>
                        <i className="fa-solid fa-paper-plane-top fa-lg"></i>
                    </button>
                </div>
                <div className='tags-list'>
                    {tags.map(tag => (
                        <div 
                            className={`forum-tag ${tag.id == newThemeTag?.id ? "selected" : ""}`} 
                            onClick={() => setNewThemeTag(prev => prev?.id == tag.id ? null : tag)}
                        >
                            {t(tag.name)}
                        </div>
                    ))}
                </div>
                <h3>Последние темы</h3>
                {forumTopics
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((topic: ShortForumTopic) => (
                        <ForumTopicCard topic={topic} />
                    ))
                }
            </div>
        </div>
    );
} 

const ForumTopicCard = ({topic}: {topic: ShortForumTopic}) => {

    const { t } = useTranslation('forumtags')

    const [isOpen, setOpen] = useState(false);

    return (
        <div key={topic.openId} className="forum-topic-card">
            <div className="forum-topic-card-meta">
                <span id="topicTheme" className={isOpen ? "open" : ""}>{topic.theme}</span>
                {topic.tagName && (
                    <div className="forum-tag">{t(topic.tagName)}</div>
                )}
            </div>
            <div className='flex-row'>
                <button className='collapse-theme' onClick={() => setOpen(prev => !prev)}>
                    {isOpen ? "Свернуть" : "Развернуть полностью.."}
                </button>
                <Link to={`/forum/topic/${topic.openId}`} className="read-btn">
                    <span>Читать</span>
                    <div className='flex-row'>{topic.postsCount}<div><i className="fa-regular fa-messages"></i></div></div>
                </Link>
            </div>
        </div>
    );
}

export {default as ForumLayout} from './ForumLayout';
export {default as ForumTagPage} from './ForumTagPage';
export {default as ForumTopicPage} from './ForumTopicPage';