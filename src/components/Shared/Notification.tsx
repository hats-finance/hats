import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleNotification } from "../../actions/index";
import { DEFUALT_NOTIFICATION_DISPLAY_TIME } from "../../constants/constants";
import { RootState } from "../../reducers";
import "../../styles/Shared/Notification.scss";

export default function Notification() {
  const dispatch = useDispatch();
  const { type, text, disableAutoHide } = useSelector((state: RootState) => state.layoutReducer.notification);

  const dismiss = useCallback(() => {
    dispatch(toggleNotification(false, undefined, ""));
  }, [dispatch])

  React.useEffect(() => {
    if (!disableAutoHide) {
      const timer = setTimeout(dismiss, DEFUALT_NOTIFICATION_DISPLAY_TIME);
      return () => {
        clearTimeout(timer);
      }
    }
  }, [dispatch, dismiss, disableAutoHide])

  return (
    <div className={`notification-wrapper ${type}`}>
      <div className="type">{type}</div>
      <div className="text">{text}</div>
      <button className="dismiss-btn" onClick={dismiss}>&times;</button>
    </div>
  )
}
