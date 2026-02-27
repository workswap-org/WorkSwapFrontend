import { useMemo } from "react";
import { Modal, TimeCounter } from "@core/components";
import { useAuth, useTasks } from "@core/lib";

const TaskDetails = () => {

    const { user } = useAuth();
    const { selectedTask, selectTask, pickUpTask, completeTask } = useTasks();

    const isInProgress = selectedTask?.status?.code === "IN_PROGRESS";
    const isCanceled = selectedTask?.status?.code === "CANCELED";
    const isNew = selectedTask?.status?.code === "NEW";
    const isCompleted = Boolean(selectedTask?.completed);

    const canPickUp = isNew || isCanceled;
    const canComplete = user?.id === selectedTask?.executor?.id && isInProgress;
    const canCancel = canComplete || isNew;
    const canEdit = user?.id === selectedTask?.executor?.id && isInProgress;

    const formattedCreatedAt = useMemo(
        () => (selectedTask?.createdAt ? new Date(selectedTask.createdAt).toLocaleString("ru-RU") : "-"),
        [selectedTask?.createdAt]
    );
    const formattedCompletedAt = useMemo(
        () => (selectedTask?.completed ? new Date(selectedTask.completed).toLocaleString("ru-RU") : null),
        [selectedTask?.completed]
    );

    if (!selectedTask) return null;

    return (
        <Modal 
            isOpen={!!selectedTask} 
            onClose={() => selectTask(null)} 
            title={"Задача: " + selectedTask.name} 
            id="tasksModal"
        >
            <div className={`task-details ${selectedTask ? "active" : ""}`}>
                <TaskDetail label="Название" value={selectedTask?.name} />
                <TaskDetail label="Описание" value={selectedTask?.description} />
                <TaskDetail label="Статус" value={selectedTask?.status?.name} />

                <br />

                <TaskDetail label="Автор" value={selectedTask?.author?.name} />

                {isCanceled && <TaskDetail label="Выполнил" value={selectedTask?.executor?.name ?? ""} />}
                {isInProgress && <TaskDetail label="Выполняющий" value={selectedTask?.executor?.name ?? ""} />}

                <br />

                <TaskDetail label="Создана" value={formattedCreatedAt} />

                {/* {!isCompleted && (
                    <TaskDetail
                        label="Дедлайн через"
                        value={<TimeCounter duration={new Date(task?.deadline).getTime() - new Date().getTime()} />}
                    />
                )} */}
                {isCompleted && <TaskDetail label="Завершена" value={formattedCompletedAt} />}

                <div className="button-actions">
                    {canPickUp && (
                        <ActionButton type="primary" icon="download" taskId={selectedTask?.id} action={() => pickUpTask(selectedTask?.id)} />
                    )}
                    {canComplete && (
                        <ActionButton type="confirm" icon="check" taskId={selectedTask?.id} action={() => completeTask(selectedTask?.id)} />
                    )}
                    {canCancel && (
                        <ActionButton type="danger" icon="trash" taskId={selectedTask?.id} />
                    )}
                    {canEdit && <ActionButton type="primary" icon="edit" taskId={selectedTask?.id}/>}
                    <ActionButton type="gold" icon="message" taskId={selectedTask?.id} />
                </div>
            </div>
        </Modal>
    );
};

const TaskDetail = ({ label, value}: {label: string, value: string | number | null}) => (
    <div className="task-detail">
        <h3 className="task-detail-title">{label}:</h3>
        <span>{value || "-"}</span>
    </div>
);

const ActionButton = ({ type, icon, taskId, action}: {type: string, icon: string, taskId: number, action?: () => void}) => (
    <button
        className={`btn btn-${type}`}
        data-task={taskId}
        onClick={action}
    >
        <i className={`fa-solid fa-${icon}`}></i>
    </button>
);

export default TaskDetails;