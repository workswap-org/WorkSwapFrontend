import { Avatar } from "@core/components";
import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
    useAuth,
    getForumTopic,
    FullForumTopic, 
    createForumPost, 
    createForumComment,
    ForumComment,
    ForumPost,
    randomString,
    autoGrow
} from '@core/lib'

const ForumTopicPage = () => {

    const { user } = useAuth();
    const [topic, setTopic] = useState<FullForumTopic | null>(null);
    const { topicOpenId } = useParams();
    const [newPostTxt, setNewPostTxt] = useState('');
    const [sending, setSending] = useState(false);

    const createPost = async() => {
        setSending(true);
        const res = await createForumPost(topicOpenId, newPostTxt);
        if (res.ok) {
            setNewPostTxt('');
            const newPost: ForumPost = {
                openId: randomString(10), 
                content: newPostTxt,
                createdAt: new Date().toISOString(), 
                author: { name: user.name, avatarUrl: user.avatarUrl, openId: user.openId },
                comments: []
            };

            setTopic(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    posts: [...prev.posts, newPost] // добавляем новый пост в конец
                };
            });
        }
        setSending(false);
    }

    useEffect(() => {

        async function loadTopicTheme(topicOpenId: string | undefined) {
            const data: FullForumTopic = await getForumTopic(topicOpenId);
            setTopic(data);
        }

        if (topicOpenId) {
            loadTopicTheme(topicOpenId);
        }
    }, [])

    return (
        <div className="forum-page">
            <div className="forum-topic-theme">
                <Avatar user={topic?.author} size={50} />
                <div className="forum-topic-theme-content">
                    <span className="forum-topic-theme-content-author-name">{topic?.author.name}</span>
                    {topic?.theme}
                </div>
            </div>
            <div className="forum-post-list">
                <div className='forum-post-form'>
                    <Avatar user={user} size={40} />
                    <textarea
                        className="forum-input"
                        value={newPostTxt}
                        onChange={(e) => {
                            setNewPostTxt(e.target.value)
                            autoGrow(e)
                        }}
                        placeholder="Напишите ответ..."
                    />
                    {newPostTxt.length > 0 && (
                        <button 
                            onClick={createPost} 
                            disabled={sending}
                            id="sendBtn" 
                            className="hover"
                        >
                            <i className="fa-solid fa-paper-plane-top fa-lg"></i>
                        </button>
                    )}
                </div>
                {topic?.posts
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((post) => (
                    <ForumTopicPost key={post.openId} post={post} setTopic={setTopic} />
                ))}
            </div>
        </div>
    );
} 

const ForumTopicPost = ({
        post, setTopic
    }: {
        post: ForumPost, 
        setTopic: React.Dispatch<React.SetStateAction<FullForumTopic | null>>
    }) => {

    const [newCommentTxt, setNewCommentTxt] = useState('');
    const [sending, setSending] = useState(false);
    const { user } = useAuth();

    const createComment = async(postOpenId: string) => {
        setSending(true);
        const res = await createForumComment(postOpenId, newCommentTxt);
        if (res.ok) {
            setNewCommentTxt('');
            const newComment: ForumComment = {
                id: 1, 
                content: newCommentTxt, 
                targetOpenId: postOpenId, 
                createdAt: new Date().toISOString(), 
                author: { name: user.name, avatarUrl: user.avatarUrl, openId: user.openId }
            };
            setTopic(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    posts: prev.posts.map(post =>
                        post.openId === postOpenId
                            ? {
                                ...post,
                                comments: [...post.comments, newComment]
                            }
                            : post
                    )
                };
            });
        }
        setSending(false);
    }

    return (
        <article className="forum-post-card">
            <section className="forum-post">
                <Avatar user={post.author} size={40} />
                <div className="forum-post-content">
                    <span id="authorName">{post.author.name}</span>
                    <span id='content'>{post.content}</span>
                </div>
            </section>
            
            <section className="forum-comment-list">
                <div className="forum-comment-form">
                    <textarea 
                        className="forum-input"
                        value={newCommentTxt}
                        onChange={(e) => {
                            setNewCommentTxt(e.target.value)
                            autoGrow(e)
                        }}
                        placeholder="Введите комментарий..."
                    />
                    {newCommentTxt.length > 0 && (
                        <button 
                            onClick={() => createComment(post.openId)}
                            disabled={sending} 
                            id="sendBtn" 
                            className="hover"
                        >
                            <i className="fa-solid fa-paper-plane-top fa-lg"></i>
                        </button>
                    )}
                </div>
                {post.comments
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((comment) => (
                    <article key={comment.id} className="forum-comment-card">
                        <Avatar user={comment.author} size={40} />
                        <div className="forum-comment-content">
                            <span id='authorName'>{comment.author.name}</span>
                            <span id='content'>{comment.content}</span>
                        </div>
                    </article>
                ))}
            </section>
        </article>
    )
}

export default ForumTopicPage;