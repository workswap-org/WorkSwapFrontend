import { TaskTypeValue } from "@core/lib/constants/taskTypes";
import { IStatus } from "../common";
import { IShortUser } from "./user";

export interface ITask {
    id: number;
    name: string;
    description: string;

    status: IStatus;

    type: TaskTypeValue;

    author: IShortUser;
    executor: IShortUser | null;

    createdAt: string;
    deadline: string;
    completed: string | null;
}

export interface IUserTasks {
    executing: ITask[];
    completedLastMonth: ITask[];
    completedBefore: number;
}

export interface ITaskCreate {
    name: string;
    description: string;
    type: TaskTypeValue;
    deadline: string;
}