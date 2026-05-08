import { useEffect, useState } from "react";
import { getTaskComments } from "@core/lib";
import { useAuth } from "@core/lib";
import { Avatar } from "@core/components";

const TaskComments = ({taskId}) => {
    
    const { user } = useAuth();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!taskId) return;

        async function loadTaskComments() {
            try {
                const data = await getTaskComments(taskId);
                console.log(data);
                setComments(data || {});
            } catch (err) {
                console.error(err);
            }
        }
        
        loadTaskComments();
    }, [taskId]);

    useEffect(() => {
        document.querySelectorAll(".task-comment-card").forEach(comment => {
            comment.classList.add("active");
        });
    })

    return (
        <div className="task-comments">
            {comments.map((comment) => (
                <div key={comment.id} className="task-comment-card">
                    <div className="task-comment flex-row">
                        <div className="flex-column">
                            <div className="flex-row" style={{ gap: "0.5rem" }}>
                                {/* Аватар */}
                                <Avatar 
                                    user={comment.author}        // передаём объект пользователя
                                    size={32}          // размер аватара, например 40px
                                    className="" // дополнительные классы, если нужны
                                />
                                <span style={{ margin: "auto 0" }}>
                                    {comment.author?.name}
                                </span>
                            </div>
                            <br />
                            <span>{comment.content}</span>
                        </div>

                        {user?.id === comment.author?.id && (
                            <div className="button-actions flex-column task-comment-actions">
                                <button
                                    data-comment={comment.id}
                                    data-task={taskId}
                                    className="btn btn-danger delete-taskcomment-btn"
                                    style={{ height: "auto", right: 0 }}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskComments;