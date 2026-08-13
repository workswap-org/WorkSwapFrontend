import ForumTagSelector from "@/components/ui/selectors/ForumTagSelector";
import Modal from "@core/components/ui/Modal/Modal";
import TextareaRT1 from "@core/components/ui/primitives/TextareaRT1/TextareaRT1";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { forumService } from "@core/lib/services/forumService";
import { ForumTag } from "@core/lib/types/forum";
import { useState } from "react";
import PaperPlaneIcon from "@core/components/common/icons/PaperPlaneIcon"
import styles from "./ForumTopicCreateModal.module.scss"
import { useRouter } from "next/navigation";

const ForumTopicCreateModal = ({tags}: {tags: ForumTag[] | null}) => {
    const { dict } = useI18n()
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tag, setTag] = useState<ForumTag | null>(null);
    const [sending, setSending] = useState(false);
    const [isOpen, setOpen] = useState<boolean>(false)
    const router = useRouter();

    const createTopic = async () => {
        setSending(true);
        const newTopic = {
            createdAt: "",
            openId: "",
            title,
            content,
            tagName: tag?.name ?? "",
            language: "",
            author: { id: 0, openId: "", name: ""},
            posts: [],
            postsCount: 0
        }
        const topicOpenId: string = await forumService.createTopic(newTopic);
        setSending(false);
        if (topicOpenId) {
            setTitle('');
            router.push(`/forum/topic/${topicOpenId}`);
        }
    } 
    
    return (
        <>
            <button 
                className={`${styles.createBtn} btn btn-primary`} 
                onClick={() => setOpen(true)}
            >
                <i className="fa-solid fa-pen"/>{dict.buttons.forum.createTopic}
            </button>
            <Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Создать тему">
                <div className={styles.form}>
                    <input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Введите название топика...'
                    />
                    <TextareaRT1
                        value={content} 
                        setValue={setContent}
                        className={styles.contentInput}
                        placeholder='Контент топика'
                    />
                    <button onClick={createTopic} className={`${styles.sendBtn} hover`} disabled={sending}>
                        <PaperPlaneIcon />
                    </button>
                </div>
                {tags && (
                    <div className={styles.tags}>
                        <ForumTagSelector tags={tags} currentTag={tag} onChange={setTag}/>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default ForumTopicCreateModal;