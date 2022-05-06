import React, { useCallback, useMemo, useState, FC } from "react";
import { NotificationContext, NotificationContextValue } from "./context";
import Notification from "./Notification/Notification";
import "./index.scss";

export interface INotification {
  id: number;
  content: React.ReactNode;
}

const MAX_NOTIFICATIONS_DISPLAY = 3;

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const addNotification = useCallback<NotificationContextValue["addNotification"]>((value) => {
    setNotifications((notifications) => notifications.concat({ id: notifications.length, content: value }));
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((notifications) => notifications.filter((notification) => notification.id !== id));
  }, []);

  const contextValue = useMemo<NotificationContextValue>(
    () => ({
      addNotification,
    }),
    [addNotification]
  );

  if (notifications.length > MAX_NOTIFICATIONS_DISPLAY) {
    setNotifications((notifications) => notifications.filter((notification, index) => index !== 0));
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="notifications-container">
        {notifications.map((notification, index) => {
          return (
            <Notification
              key={index}
              notification={notification}
              removeNotification={() => removeNotification(notification.id)} />);
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
