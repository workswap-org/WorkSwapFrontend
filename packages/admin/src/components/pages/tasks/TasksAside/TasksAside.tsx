
import { Page } from "@core/lib/types/common/page";
import TaskCard from "../TaskCard/TaskCard";
import { ITask } from "@core/lib/types/models/task";
import styles from "./TasksAside.module.scss"

const TasksAside = ({tasks}: {tasks: Page<ITask> | null}) => {

    return (
        <div className={styles.aside}>
            <h2 className={styles.header}>Новые задачи</h2>
            <div className={styles.content}>
                {tasks?.content.map(task => (
                    <TaskCard key={task.id} task={task}/>
                ))}
            </div>
        </div>
    )
}

export default TasksAside;