import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleNotification } from "../../actions/index";
import { NotificationType } from "../../constants/constants";
import "../../styles/Shared/Notification.scss";

export default function Notification() {
  const dispatch = useDispatch();
  const { type, text }: { type: NotificationType, text: string } = useSelector(state => (state as any).layoutReducer.notification);

  const dismiss = useCallback(() => {
    dispatch(toggleNotification(false, undefined, ""));
  }, [dispatch])

  React.useEffect(() => {
    const timer = setTimeout(dismiss, 5000);
    return () => {
      clearTimeout(timer);
    }
  }, [dispatch, dismiss])

  return <div className={`notification-wrapper ${type}`}>
    <div className="type">{type}</div>
    <div className="text">{text}</div>
    <button className="dismiss-btn" onClick={dismiss}>&times;</button>
  </div>
}
