import { createContext, useContext } from "react";

export const useNotification = () => useContext(NotificationContext);

export const NotificationContext = createContext(null);