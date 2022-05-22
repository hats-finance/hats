import { createContext, useContext, ReactNode } from "react";
import { NotificationType } from "./NotificationProvider";

export interface NotificationContextValue {
  addNotification: (value: ReactNode, type?: NotificationType) => void;
}

export const NotificationContext = createContext<NotificationContextValue>({
  addNotification: () => {
    throw new Error("addNotification error");
  },
});

export const useNotificationContext = (): NotificationContextValue =>
  useContext(NotificationContext);
