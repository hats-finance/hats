import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleNotification } from "../../actions/index";
import { RootState } from "../../reducers";
import "../../styles/Shared/Notification.scss";

export default function Notification() {
  const dispatch = useDispatch();
  const { type, text } = useSelector((state: RootState) => state.layoutReducer.notification);

  const dismiss = useCallback(() => {
    dispatch(toggleNotification(false, undefined, ""));
  }, [dispatch])

  // React.useEffect(() => {
  //   const timer = setTimeout(dismiss, 5000);
  //   return () => {
  //     clearTimeout(timer);
  //   }
  // }, [dispatch, dismiss])

  return (
    <div className={`notification-wrapper ${type}`}>
      <div className="type">{type}</div>
      <div className="text">{text}</div>
      <button className="dismiss-btn" onClick={dismiss}>&times;</button>
    </div>
  )
}
