import { ITaskCreate } from '../types';
import { apiFetch, apiFetchJson } from './apiClient';

export const taskService = {
    getTasksPage: () => apiFetchJson("/tasks/get-tasks"),
    getTaskComments: (taskId: number) => apiFetchJson(`/tasks/${taskId}/comments`),
    getTaskDetails: (taskId: number) => apiFetchJson(`/tasks/${taskId}/details`),
    getTasksMetadata: () => apiFetchJson(`/tasks/metadata`),

    pickUpTask: (taskId: number) => apiFetch(`/tasks/${taskId}/pickup`, {method: "POST"}),
    completeTask: (taskId: number) => apiFetch(`/tasks/${taskId}/complete`, {method: "POST"}),
    cancelTask: (taskId: number) => apiFetch(`/tasks/${taskId}/cancel`, {method: "POST"}),

    createTask: (newTask: ITaskCreate) => 
        apiFetchJson("/tasks/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        })
};