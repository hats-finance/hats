import { useEffect } from "react";
import { INotification } from "../NotificationProvider";
import "./index.scss";

interface IProps {
  notification: INotification;
  removeNotification: () => void;
}

// export enum NotificationType {
//   Success = "SUCCESS",
//   Error = "ERROR",
//   Info = "INFO"
// }

const DISPLAY_DURATION = 5000;

export default function Notification({ notification, removeNotification }: IProps) {
  
  useEffect(() => {
    const removeTimeout = setTimeout(() => removeNotification(), DISPLAY_DURATION);
    return () => {
      clearTimeout(removeTimeout);
    };
  }, [notification.id, removeNotification])

  return (
    <div className="notification-wrapper">
      <div>{notification.content}</div>
      <button className="dismiss-btn" onClick={removeNotification}>OK</button>
    </div>
  )
}
