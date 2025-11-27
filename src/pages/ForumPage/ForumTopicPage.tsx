import { Avatar } from "@core/components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForumTopic, ForumTopic } from '@core/lib'

const topicPosts = [
    {
        content: "Я бы начал с локальных групп в соцсетях. Там часто публикуют просьбы о помощи на пару часов или один день.",
        author: {
            name: "Алексей Петров",
            avatarUrl: "https://i.pravatar.cc/150?img=1"
        }
    },
    {
        content: "Попробуйте доски объявлений. Часто люди ищут помощь с переездом, уборкой или мелким ремонтом именно на выходные дни.",
        author: {
            name: "Марина Ковалёва",
            avatarUrl: "https://i.pravatar.cc/150?img=2"
        }
    },
    {
        content: "Если хочешь что-то недалеко от центра, посмотри задания по доставке. Курьерские подработки всегда востребованы.",
        author: {
            name: "Денис Орлов",
            avatarUrl: "https://i.pravatar.cc/150?img=3"
        }
    },
    {
        content: "Я пару раз находил через WorkSwap. Советую оформить профиль, добавить фото и написать подробно, какие услуги можешь предложить — откликаются быстрее.",
        author: {
            name: "Игорь Смирнов",
            avatarUrl: "https://i.pravatar.cc/150?img=4"
        }
    },
    {
        content: "Если есть велосипед, можно попробовать фриланс-доставку покупок. Я иногда так подрабатываю — выходные обычно загружены заказами.",
        author: {
            name: "Анна Власова",
            avatarUrl: "https://i.pravatar.cc/150?img=5"
        }
    }
];

const ForumTopicPage = () => {

    const [topicTheme, setTopicTheme] = useState<ForumTopic | null>(null);
    const { topicOpenId } = useParams();

    useEffect(() => {

        async function loadTopicTheme(topicOpenId: string | undefined) {
            const data: ForumTopic = await getForumTopic(topicOpenId);
            setTopicTheme(data);
        }

        if (topicOpenId) {
            loadTopicTheme(topicOpenId);
        }
    }, [])

    return (
        <div className="forum-page">
            <div className="forum-topic-theme">
                <Avatar user={topicTheme?.author} size={50} />
                <div className="forum-topic-theme-content">
                    <span className="forum-topic-theme-content-author-name">{topicTheme?.author.name}</span>
                    {topicTheme?.theme}
                </div>
            </div>
            <div className="forum-topic-post-list">
                {topicPosts.map((post) => (
                    <div className="forum-topic-post">
                        <Avatar user={post.author} size={40} />
                        <div className="forum-topic-post-content">
                            <span className="forum-topic-post-author-name">{post.author.name}</span>
                            {post.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 

export default ForumTopicPage;