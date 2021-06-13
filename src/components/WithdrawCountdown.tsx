
import React, { useState, useEffect } from "react";
import "../styles/WithdrawCountdown.scss";
import moment from 'moment';
import { Colors } from "../constants/constants";

interface IProps {
  endDate: string
  compactView?: boolean
  onEnd?: Function
  textColor?: Colors
}

export default function WithdrawCountdown(props: IProps) {
  const { endDate, compactView, onEnd } = props;
  const countdownDate = moment.unix(Number(endDate)).utc().valueOf();
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const setNewTime = () => {
    if (countdownDate) {
      const currentTime = new Date().getTime();

      const distanceToDate = countdownDate - currentTime;

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

      setState({ days: days, hours: hours, minutes, seconds });
    }
  };

  // Run once at mounting to avoid 1000ms delay of the interval
  useEffect(() => {
    setNewTime();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setNewTime(), 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <div className={`withdraw-countdown-wrapper ${compactView && "compact-view"}`} style={{ color: `${props.textColor}` }}>
      {state.days > 0 && <div className="time-element">
        <span className="value">{state.days || '00'}</span>
        <span className="type">{String(state.days) === "1" ? "DAY" : "DAYS"}</span>
      </div>}
      <div className="time-element">
        <span className="value">{state.hours || '00'}</span>
        <span className="type">{String(state.hours) === "01" ? "HOUR" : "HOURS"}</span>
      </div>
      <div className="time-element">
        <span className="value">{state.minutes || '00'}</span>
        <span className="type">{String(state.minutes) === "01" ? "MINUTE" : "MINUTES"}</span>
      </div>
      {String(state.days) === "0" && (
        <div className="time-element">
          <span className="value">{state.seconds || '00'}</span>
          <span className="type">{String(state.seconds) === "01" ? "SECOND" : "SECONDS"}</span>
        </div>
      )}
    </div>
  )
}
