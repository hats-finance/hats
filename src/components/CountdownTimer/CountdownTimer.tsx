import { useState, useEffect, useCallback } from "react";
import { StyledCountdownTimer } from "./styles";

interface IProps {
  endDate: number; // timestamp in milliseconds
  plainTextView?: boolean;
  onEnd?: Function;
  color?: "blue" | "yellow";
}

export function CountdownTimer({ endDate, plainTextView = false, onEnd, color = "blue" }: IProps) {
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const setNewTime = useCallback(() => {
    if (endDate) {
      const currentTime = Date.now();

      const distanceToDate = endDate - currentTime;
      if (distanceToDate < 0) return;

      const days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

      if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        if (onEnd) onEnd();
      }

      setTimer({ days: days, hours: hours, minutes: minutes, seconds: seconds });
    }
  }, [endDate, onEnd]);

  // Run once at mounting to avoid 1000ms delay of the interval
  useEffect(() => setNewTime(), [setNewTime]);

  useEffect(() => {
    const interval = setInterval(setNewTime, 1000);
    return () => clearInterval(interval);
  }, [setNewTime]);

  return (
    <StyledCountdownTimer color={color} plainTextView={plainTextView}>
      {timer.days > 0 && (
        <div className="time-element">
          <span className="value">{String(timer.days).padStart(2, "0")}</span>
          {plainTextView && ":"}
          {!plainTextView && <span className="type">DAYS</span>}
        </div>
      )}
      <div className="time-element">
        <span className="value">{String(timer.hours).padStart(2, "0")}</span>
        {!plainTextView && <span className="type">HOURS</span>}
        {plainTextView && ":"}
      </div>
      <div className="time-element">
        <span className="value">{String(timer.minutes).padStart(2, "0")}</span>
        {!plainTextView && <span className="type">MINUTES</span>}
        {plainTextView && ":"}
      </div>
      {String(timer.days) === "0" && (
        <div className="time-element">
          <span className="value">{String(timer.seconds).padStart(2, "0")}</span>
          {!plainTextView && <span className="type">SECONDS</span>}
        </div>
      )}
    </StyledCountdownTimer>
  );
}
