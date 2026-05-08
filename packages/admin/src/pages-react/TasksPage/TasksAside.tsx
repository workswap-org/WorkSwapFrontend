import { ITask, Page } from "@core/lib";
import TaskCard from "./TaskCard";

const TasksAside = ({tasks}: {tasks: Page<ITask> | null}) => {

    return (
        <div className="tasks-aside">
            <h2 className="tasks-aside-header">Новые задачи</h2>
            <div className="tasks-aside-content">
                {tasks?.content.map(task => (
                    <TaskCard key={task.id} task={task}/>
                ))}
            </div>
        </div>
    )
}

export default TasksAside;