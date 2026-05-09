import { IUserTasks } from "@core/lib";
import TaskCard from "./TaskCard";

const TasksGrid = ({tasks}: {tasks: IUserTasks | null}) => {
    
    return (
        <div className="tasks-container">
            <div className="column">
                <div className="column-header">В процессе</div>
                {tasks?.executing.map(task => (
                    <TaskCard key={task.id} task={task}/>
                ))}
            </div>
            <div className="column">
                <div className="column-header">Выполненные за месяц</div>
                {tasks?.completedLastMonth.map(task => (
                    <TaskCard key={task.id} task={task}/>
                ))}
                <div className="column-footer">Выполненые ранее: {tasks?.completedBefore}</div>
            </div>
        </div>
    )
}

export default TasksGrid;