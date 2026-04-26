import { useState } from "react";
import ForumComment from "../ForumComment/ForumComment";
import { IForumComment, IForumPost, IForumTopic } from "@core/lib/types/forum";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { IShortUser } from "@core/lib/types/models/user";
import { forumService } from "@core/lib/services/forumService";
import Avatar from "@core/components/common/Avatar/Avatar";
import FormattedDateToNow from "@core/components/common/date/FormattedDateToNow";
import ActionMenu from "@core/components/ui/ActionMenu/ActionMenu";
import TextareaRT1 from "@core/components/ui/primitives/TextareaRT1/TextareaRT1";
import styles from "./ForumPost.module.scss"
import PaperPlaneIcon from "@core/components/common/icons/PaperPlaneIcon";

const ForumPost = ({
        post, setTopic
    }: {
        post: IForumPost,
        setTopic: React.Dispatch<React.SetStateAction<IForumTopic | null>>
    }) => {

    const [newCommentTxt, setNewCommentTxt] = useState('');
    const [sending, setSending] = useState(false);
    const { user } = useAuth();

    const createComment = async(postOpenId: string) => {
        const author: IShortUser = {
            id: user?.id ?? 0,
            name: user?.name ?? "",
            avatarUrl: user?.avatarUrl ?? "",
            openId: user?.openId ?? ""
        }
        const newComment: IForumComment = {
            id: 0,
            content: newCommentTxt,
            targetOpenId: postOpenId,
            createdAt: new Date().toISOString(),
            author: author
        }
        setSending(true);
        const data = await forumService.createComment(newComment);
        if (data) {
            setNewCommentTxt('');
            const savedComment: IForumComment = {
                ...newComment,
                id: Number(data)
            };
            setTopic(prev => {
                if (!prev?.posts) return prev;

                return {
                    ...prev,
                    posts: prev.posts.map(post =>
                        post.openId === postOpenId
                            ? {
                                ...post,
                                comments: [...post.comments, savedComment]
                            }
                            : post
                    )
                };
            });
        }
        setSending(false);
    }

    const actions = [
        {
            title: "Изменить",
            func: () => null,
            icon: "pen",
            access: user?.openId == post.author.openId
        },
        {
            title: "Удалить",
            func: async () => {
                const confirmed = window.confirm("Вы уверены в том хотите удалить этот ответ? Это действие необратимо!");
                if (confirmed) {
                    const postOpenId = post.openId
                    const res = await forumService.deletePost(postOpenId);
                    if (res.ok) {
                        setTopic(prev => {
                            if (!prev?.posts) return prev;

                            return {
                                ...prev,
                                posts: prev.posts.filter(post => post.openId !== postOpenId)
                            };
                        });
                    }
                }
            },
            icon: "trash",
            access: user?.openId == post.author.openId
        }
    ];

    return (
        <article className={styles.card}>
            <section className={styles.post}>
                <Avatar user={post.author} size={40} />
                <div className={styles.content}>
                    <span className={styles.authorName}>{post.author.name}</span>
                    <span id='content'>{post.content}</span>
                    <div className={styles.actions}>
                        <FormattedDateToNow date={post.createdAt}/>
                        <ActionMenu actions={actions}/>
                    </div>
                </div>
            </section>
            
            <section className={styles.commentList}>
                <div className={styles.commentForm}>
                    <TextareaRT1
                        value={newCommentTxt} 
                        setValue={setNewCommentTxt} 
                        className={styles.forumComment} 
                        placeholder='Введите комментарий...'
                    />
                    {newCommentTxt.length > 0 && (
                        <button 
                            onClick={() => createComment(post.openId)}
                            disabled={sending} 
                            className={`${styles.sendBtn} hover`}
                        >
                            <PaperPlaneIcon />
                        </button>
                    )}
                </div>
                {post.comments
                    .slice()
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map((comment) => (
                        <ForumComment key={comment.id} comment={comment} setTopic={setTopic} />
                    ))
                }
            </section>
        </article>
    )
}

export default ForumPost;