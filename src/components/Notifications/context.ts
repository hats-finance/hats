import { createContext, useContext, ReactNode } from "react";

export interface NotificationContextValue {
  addNotification: (value: ReactNode) => void;
}

export const NotificationContext = createContext<NotificationContextValue>({
  addNotification: () => {
    throw new Error("addNotification error");
  },
});

export const useNotificationContext = (): NotificationContextValue =>
  useContext(NotificationContext);
