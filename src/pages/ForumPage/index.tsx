import { useEffect, useState } from 'react';
import { ForumTag, getForumTags, getRecentTopics, ShortForumTopic } from '@core/lib';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ForumTopicCreateModal from './ForumTopicCreateModal';

export const ForumPage = () => {
    
    const [tags, setTags] = useState<ForumTag[] | []>([]);
    const [forumTopics, setForumTopics] = useState<ShortForumTopic[] | []>([]);

    useEffect(() => {
        async function loadRecentTopics(count: number, translationsFilter: boolean) {
            const data = await getRecentTopics(count, translationsFilter);
            setForumTopics(data);
        }
        async function loadTags() {
            const data = await getForumTags();
            setTags(data);
        }

        loadTags();
        loadRecentTopics(20, false);
    }, [])

    return (
        <div className="forum-page">
            <h1>Форум</h1>
            <div className="forum-topic-list">
                <ForumTopicCreateModal tags={tags}/>
                
                <h3>Последние темы</h3>
                {forumTopics
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((topic: ShortForumTopic) => (
                        <ForumTopicCard key={topic.openId} topic={topic} />
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

export {default as ForumTopicPage} from './ForumTopicPage';