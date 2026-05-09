"use client"

import Avatar from "@core/components/common/Avatar/Avatar";
import TextareaRT1 from "@core/components/ui/primitives/TextareaRT1/TextareaRT1";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { IForumPost, IForumTopic } from "@core/lib/types/forum";
import { IShortUser } from "@core/lib/types/models/user";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ForumPost from "../../../../../components/pages/forum/ForumPost/ForumPost";
import { forumService } from "@core/lib/services/forumService"
import ActionMenu from "@core/components/ui/ActionMenu/ActionMenu";
import FormattedDateToNow from "@core/components/common/date/FormattedDateToNow"
import styles from "./ForumTopicPage.module.scss";
import PaperPlaneIcon from "@core/components/common/icons/PaperPlaneIcon";

const ForumTopicPage = () => {

    const { dict } = useI18n()

    const { user } = useAuth();
    const [topic, setTopic] = useState<IForumTopic| null>(null);
    const { id } = useParams();
    const topicOpenId = String(id)
    const [newPostTxt, setNewPostTxt] = useState('');
    const [sending, setSending] = useState(false);

    const createPost = async() => {
        setSending(true);
        const author: IShortUser = {
            id: user?.id ?? 0,
            name: user?.name ?? "",
            avatarUrl: user?.avatarUrl ?? "",
            openId: user?.openId ?? ""
        }
        const newPost: IForumPost = {
            topicOpenId: topicOpenId ?? "",
            openId: "", 
            content: newPostTxt,
            createdAt: new Date().toISOString(), 
            author: author,
            comments: []
        };
        const data = await forumService.createPost(newPost);
        if (data) {
            setNewPostTxt('');

            const savedPost: IForumPost = {
                ...newPost,
                openId: data
            };

            setTopic(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    posts: [...(prev.posts ?? []), savedPost] // добавляем новый пост в конец
                };
            });
        }
        setSending(false);
    }

    useEffect(() => {

        async function loadTopicTheme(topicOpenId: string) {
            const data: IForumTopic = await forumService.getTopic(topicOpenId);
            setTopic(data);
        }

        if (topicOpenId) {
            loadTopicTheme(topicOpenId);
        }
    }, [topicOpenId])

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
                if (confirmed && topic?.openId) {
                    const res = await forumService.deleteTopic(topic?.openId);
                    if (res.ok) {
                        redirect("/forum");
                    }
                }
            },
            icon: "trash"
        })
    }

    return topic && (
            <>
                <div className={styles.topic}>
                    <Avatar user={topic.author} size={50} />
                    <div className={styles.topicContent}>
                        <span className={styles.authorName}>{topic.author.name}</span>
                        <h3 id="title">{topic.title}</h3>
                        <span id="content">{topic.content}</span>
                        <div className={styles.actions}>
                            <FormattedDateToNow date={topic.createdAt} />
                            <ActionMenu actions={actions} />
                        </div>
                        {topic.tagName && (
                            <div className={styles.forumTag}>{dict.forumtags.topic.tagName}</div>
                        )}
                    </div>
                </div>
                <div className={styles.postList}>
                    <div className={styles.postForm}>
                        <Avatar user={user} size={40} />
                        <TextareaRT1 value={newPostTxt} setValue={setNewPostTxt} placeholder='Напишите ответ...' />
                        {newPostTxt.length > 0 && (
                            <button 
                                onClick={createPost} 
                                disabled={sending}
                                className={`${styles.sendBtn} hover`}
                            >
                                <PaperPlaneIcon />
                            </button>
                        )}
                    </div>
                    {topic.posts?.slice()
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        .map((post) => (
                        <ForumPost key={post.openId} post={post} setTopic={setTopic} />
                    ))}
                </div>
            </>
        );
}

export default ForumTopicPage;