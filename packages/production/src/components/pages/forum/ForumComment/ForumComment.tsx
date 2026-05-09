import Avatar from "@core/components/common/Avatar/Avatar";
import FormattedDateToNow from "@core/components/common/date/FormattedDateToNow";
import ActionMenu from "@core/components/ui/ActionMenu/ActionMenu";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { forumService } from "@core/lib/services/forumService";
import { IForumComment, IForumTopic } from "@core/lib/types/forum";
import styles from "./ForumComment.module.scss"

const ForumComment = ({
    comment, setTopic
}: {
    comment: IForumComment,
    setTopic: React.Dispatch<React.SetStateAction<IForumTopic | null>>
}) => {

    const { user } = useAuth();

    const actions = [
        {
            title: "Изменить",
            func: () => null,
            icon: "pen",
            access: user?.openId == comment?.author.openId
        },
        {
            title: "Удалить",
            func: async () => {
                const confirmed = window.confirm("Вы уверены в том хотите удалить этот комментарий? Это действие необратимо!");
                if (confirmed) {
                    const commentId = comment.id
                    const res = await forumService.deleteComment(commentId);
                    if (res.ok) {
                        setTopic(prev => {
                            if (!prev?.posts) return prev;

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
            icon: "trash",
            access: user?.openId == comment?.author.openId
        }
    ];

    return comment && (
        <article className={styles.card}>
            <Avatar user={comment.author} size={40} />
            <div className={styles.content}>
                <span className={styles.authorName}>{comment.author.name}</span>
                <span id='content'>{comment.content}</span>
                <div className={styles.actions}>
                    <FormattedDateToNow date={comment.createdAt} />
                    <ActionMenu actions={actions}/>
                </div>
            </div>
        </article>
    )
}

export default ForumComment;