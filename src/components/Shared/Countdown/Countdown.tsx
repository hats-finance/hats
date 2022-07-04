
import { useState, useEffect, useCallback } from "react";
import moment from 'moment';
import classNames from "classnames";
import { Colors } from "../../../constants/constants";
import "./index.scss";

interface IProps {
  endDate: string
  plainTextView?: boolean
  onEnd?: Function
  textColor?: Colors
}

export default function Countdown(props: IProps) {
  const { endDate, plainTextView, onEnd } = props;
  const countdownDate = moment.unix(Number(endDate)).utc().valueOf();
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const setNewTime = useCallback(() => {
    if (countdownDate) {
      const currentTime = new Date().getTime();

      const distanceToDate = countdownDate - currentTime;
      if (distanceToDate < 0) {
        return;
      }

      let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      let minutes = Math.floor(
        (distanceToDate % (1000 * 60 * 60)) / (1000 * 60),
      );
      let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

      if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        if (onEnd) {
          onEnd();
        }
      }

      const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      (days as any) = `${days}`;
      if (numbersToAddZeroTo.includes(hours)) {
        (hours as any) = `0${hours}`;
      } else if (numbersToAddZeroTo.includes(minutes)) {
        (minutes as any) = `0${minutes}`;
      } else if (numbersToAddZeroTo.includes(seconds)) {
        (seconds as any) = `0${seconds}`;
      }

      setTimer({ days: days, hours: hours, minutes: minutes, seconds: seconds });
    }
  }, [countdownDate, onEnd]);

  // Run once at mounting to avoid 1000ms delay of the interval
  useEffect(() => {
    setNewTime();
  }, [setNewTime])

  useEffect(() => {
    const interval = setInterval(() => setNewTime(), 1000);
    return () => {
      clearInterval(interval);
    }
  }, [setNewTime]);

  return (
    <div className="withdraw-countdown-wrapper" style={{ color: `${props.textColor}` }}>
      {timer.days > 0 && (
        <div className={classNames("time-element", { "plain-text-view": plainTextView })}>
          <span className="value">{timer.days || '00'}</span>
          {plainTextView && ":"}
          {!plainTextView && <span className="type">DAYS</span>}
        </div>)}
      <div className={classNames("time-element", { "plain-text-view": plainTextView })}>
        <span className="value">{timer.hours || '00'}</span>
        {!plainTextView && <span className="type">HOURS</span>}
        {plainTextView && ":"}
      </div>
      <div className={classNames("time-element", { "plain-text-view": plainTextView })}>
        <span className="value">{timer.minutes || '00'}</span>
        {!plainTextView && <span className="type">MINUTES</span>}
        {plainTextView && ":"}
      </div>
      {String(timer.days) === "0" && (
        <div className={classNames("time-element", { "plain-text-view": plainTextView })}>
          <span className="value">{timer.seconds || '00'}</span>
          {!plainTextView && <span className="type">SECONDS</span>}
        </div>
      )}
    </div>
  )
}
