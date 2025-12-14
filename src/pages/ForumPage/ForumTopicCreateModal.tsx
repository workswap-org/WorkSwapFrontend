import ForumTagSelector from "@/components/ui/selectors/ForumTagSelector";
import { Modal, TextareaRT1 } from "@core/components";
import { createForumTopic, ForumTag } from "@core/lib";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ForumTopicCreateModal = ({tags}: {tags: ForumTag[] | []}) => {
    const { t } = useTranslation('forumtags')
    
    const [theme, setTheme] = useState("");
    const navigate = useNavigate();
    const [tag, setTag] = useState<ForumTag | null>(null);
    const [sending, setSending] = useState(false);
    const [isOpen, setOpen] = useState<boolean>(false)

    const createTopic = async () => {
        setSending(true);
        const newTopic = {
            createdAt: "",
            openId: "",
            theme: theme,
            tagName: tag?.name ?? "",
            postsCount: 0
        }
        const topicOpenId: string = await createForumTopic(newTopic);
        setSending(false);
        if (topicOpenId) {
            setTheme('');
            navigate(`/forum/topic/${topicOpenId}`);
        }
    } 
    
    return (
        <>
            <button 
                className="btn btn-primary" 
                id="forumTopicCreate" 
                onClick={() => setOpen(true)}
            >
                <i className="fa-solid fa-pen"/>Создать тему
            </button>
            <Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Создать тему">
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
                    <ForumTagSelector tags={tags} onChange={setTag} currentTag={tag} />
                </div>
            </Modal>
        </>
    );
}

export default ForumTopicCreateModal;