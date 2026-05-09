"use client"

import { createContext, useContext } from "react";

export const pageTitles = {
    dashboard: "Панель управления",
    listings: "Управление объявлениями",
    resumes: "Управление резюме",
    users: "Управление пользователями",
    news: "Управление новостями",
    locations: "Управление локациями",
    categories: "Управление категориями",
    tasks: "Задачи",
    localization: "Локализация",
    permissions: "Роли и разрешения",
} as const;

export type PageKey = keyof typeof pageTitles;

export const ActivePageContext = createContext<PageKey | null>(null);

export const useActivePage = () => {
    const ctx = useContext(ActivePageContext);
    if (ctx === undefined) {
        throw new Error("useActivePage must be used inside ActivePageProvider");
    }
    return ctx;
}