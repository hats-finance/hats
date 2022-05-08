import {
  useNotificationContext,
  NotificationContextValue,
} from "../components/Notifications/context";

interface Return {
  notify: NotificationContextValue["addNotification"];
}

const useNotification = (): Return => {
  const { addNotification } = useNotificationContext();

  const notify: Return["notify"] = (value, type) => {
    addNotification(value, type);
  };

  return { notify };
};

export default useNotification;
