import { ActionMenu, Avatar, TextareaRT1 } from "@core/components";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    useAuth,
    getForumTopic,
    FullForumTopic, 
    createForumPost, 
    createForumComment,
    ForumComment,
    ForumPost,
    deleteForumTopic,
    deleteForumComment,
    deleteForumPost
} from '@core/lib'

import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTranslation } from "react-i18next";

const ForumTopicPage = () => {

    const { t } = useTranslation('forumtags')

    const { user } = useAuth();
    const [topic, setTopic] = useState<FullForumTopic | null>(null);
    const { topicOpenId } = useParams();
    const [newPostTxt, setNewPostTxt] = useState('');
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();

    const createPost = async() => {
        setSending(true);
        const data = await createForumPost(topicOpenId, newPostTxt);
        if (data) {
            setNewPostTxt('');
            const newPost: ForumPost = {
                openId: data, 
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

    const actions = [];
    if (user?.openId == topic?.author.openId) {
        actions.push({
            title: "Изменить",
            func: () => null,
            icon: "pen"
        })
        actions.push({
            title: "Удалить",
            func: async () => {
                const confirmed = window.confirm("Вы уверены в том хотите удалить это обсуждение? Это действие необратимо!");
                if (confirmed) {
                    const res = await deleteForumTopic(topic?.openId);
                    if (res.ok) {
                        navigate("/forum");
                    }
                }
            },
            icon: "trash"
        })
    }

    return (
        <div className="forum-page">
            {topic && (
                <>
                    <div className="forum-topic-theme">
                        <Avatar user={topic.author} size={50} />
                        <div className="forum-topic-theme-content">
                            <span id="authorName">{topic.author.name}</span>
                            {topic.theme}
                            <div className="absolute-actions">
                                <FormattedDate date={topic.createdAt} />
                                <ActionMenu 
                                    actions={actions}
                                />
                            </div>
                            {topic.tagName && (
                                <div className="forum-tag">{t(topic.tagName)}</div>
                            )}
                        </div>
                    </div>
                    <div className="forum-post-list">
                        <div className='forum-post-form'>
                            <Avatar user={user} size={40} />
                            <TextareaRT1 value={newPostTxt} setValue={setNewPostTxt} placeholder='Напишите ответ...' />
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
                        {topic.posts
                            .slice()
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((post) => (
                            <ForumTopicPost key={post.openId} post={post} setTopic={setTopic} />
                        ))}
                    </div>
                </>
            )}
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
        const data = await createForumComment(postOpenId, newCommentTxt);
        if (data) {
            setNewCommentTxt('');
            const newComment: ForumComment = {
                id: Number(data), 
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

    const actions = [];
    if (user.openId == post.author.openId) {
        actions.push({
            title: "Изменить",
            func: () => null,
            icon: "pen"
        })
        actions.push({
            title: "Удалить",
            func: async () => {
                const confirmed = window.confirm("Вы уверены в том хотите удалить этот ответ? Это действие необратимо!");
                if (confirmed) {
                    const postOpenId = post.openId
                    const res = await deleteForumPost(postOpenId);
                    if (res.ok) {
                        setTopic(prev => {
                            if (!prev) return prev;

                            return {
                                ...prev,
                                posts: prev.posts.filter(post => post.openId !== postOpenId)
                            };
                        });
                    }
                }
            },
            icon: "trash"
        })
    };

    return (
        <article className="forum-post-card">
            <section className="forum-post">
                <Avatar user={post.author} size={40} />
                <div className="forum-post-content">
                    <span id="authorName">{post.author.name}</span>
                    <span id='content'>{post.content}</span>
                    <div className="absolute-actions">
                        <FormattedDate date={post.createdAt}/>
                        <ActionMenu actions={actions}/>
                    </div>
                </div>
            </section>
            
            <section className="forum-comment-list">
                <div className="forum-comment-form">
                    <TextareaRT1 
                        value={newCommentTxt} 
                        setValue={setNewCommentTxt} 
                        className="forum-comment" 
                        placeholder='Введите комментарий...'
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
                        <ForumPostComment key={comment.id} comment={comment} setTopic={setTopic} />
                    ))
                }
            </section>
        </article>
    )
}

const ForumPostComment = ({
    comment, setTopic
}: {
    comment: ForumComment,
    setTopic: React.Dispatch<React.SetStateAction<FullForumTopic | null>>
}) => {

    const { user } = useAuth();

    const actions = [];
    if (user.openId == comment?.author.openId) {
        actions.push({
            title: "Изменить",
            func: () => null,
            icon: "pen"
        })
        actions.push({
            title: "Удалить",
            func: async () => {
                const confirmed = window.confirm("Вы уверены в том хотите удалить этот комментарий? Это действие необратимо!");
                if (confirmed) {
                    const commentId = comment.id
                    const res = await deleteForumComment(commentId);
                    if (res.ok) {
                        setTopic(prev => {
                            if (!prev) return prev;

                            return {
                                ...prev,
                                posts: prev.posts.map(post => ({
                                    ...post,
                                    comments: post.comments.filter(comment => comment.id !== commentId)
                                }))
                            };
                        });
                    }
                }
            },
            icon: "trash"
        })
    }

    return comment && (
        <article className="forum-comment-card">
            <Avatar user={comment.author} size={40} />
            <div className="forum-comment-content">
                <span id='authorName'>{comment.author.name}</span>
                <span id='content'>{comment.content}</span>
                <div className="absolute-actions">
                    <FormattedDate date={comment.createdAt} />
                    <ActionMenu actions={actions}/>
                </div>
            </div>
        </article>
    )
}

const FormattedDate = ({date}: {date: string}) => {
    return (
        <div id='date'>
            {formatDistanceToNow(
                new Date(date.endsWith('Z') ? date : date + 'Z'), 
                { 
                    addSuffix: true, 
                    locale: ru 
                }
            )}
        </div>
    )
}

export default ForumTopicPage;