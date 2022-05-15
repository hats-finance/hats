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
  }, []);

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
        return { id: notification.id, type: NotificationType.Info, content: "Transaction Started ${notification.transactionName}" };

        break;
      case "transactionFailed":
        return { id: notification.id, type: NotificationType.Error, content: "Transaction Failed ${notification.transactionName}" };
        break;
      case "transactionSucceed":
        return { id: notification.id, type: NotificationType.Success, content: "Transaction Succeeded ${notification.transactionName}" };
        break;
      case "walletConnected":
        return { id: notification.id, type: NotificationType.Info, content: "Wallet connected" };
    }
  });

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="notifications-container">
        {[...notifications, ...useDappNotifications].map((notification, index) => {
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
