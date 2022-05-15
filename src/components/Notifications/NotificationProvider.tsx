import React, { useCallback, useMemo, useState, FC } from "react";
import { NotificationContext, NotificationContextValue } from "./context";
import Notification from "./Notification/Notification";
import "./index.scss";
import { useNotifications } from "@usedapp/core";
export interface INotification {
  id: string;
  content: React.ReactNode;
  type?: NotificationType;
}

export enum NotificationType {
  Success,
  Error,
  Info,
}

const MAX_NOTIFICATIONS_DISPLAY = 3;

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [lastId, setLastId] = useState(0);


  const addNotification = useCallback<NotificationContextValue["addNotification"]>((value, type) => {
    setNotifications((notifications) => notifications.concat({ id: lastId.toString(), content: value, type: type }));
    setLastId(oldLastId => oldLastId + 1);
  }, [lastId]);

  const removeNotification = useCallback((id: string) => {
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

  const useDappNotifications = useNotifications().notifications.map((notification): INotification => {
    switch (notification.type) {
      case "transactionStarted":
        return { id: notification.id, type: NotificationType.Info, content: `Transaction Started: ${notification.transactionName}` };
      case "transactionFailed":
        return { id: notification.id, type: NotificationType.Error, content: `Transaction Failed: ${notification.transactionName}` };
      case "transactionSucceed":
        return { id: notification.id, type: NotificationType.Success, content: `Transaction Succeeded: ${notification.transactionName}` };
      case "walletConnected":
        return { id: "walletconnected", type: NotificationType.Info, content: `Wallet Connected` };
    }
    return { id: "", type: NotificationType.Info, content: `unknown` };
  });

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="notifications-container">
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            notification={notification}
            removeNotification={() => removeNotification(notification.id)} />))
        }
        {useDappNotifications.map((notification, index) => (
          <Notification
            key={notifications.length + index}
            notification={notification} />))}

      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
