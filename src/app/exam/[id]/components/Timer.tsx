"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  duration: number;
  onTimeUp: () => void;
};

export default function Timer({ duration, onTimeUp }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(duration * 3600);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  function formatTime(secs: number) {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const secsLeft = secs % 60;

    return `${hrs}:${mins.toString().padStart(2, "0")}:${secsLeft
      .toString()
      .padStart(2, "0")}`;
  }

  return <div className="timer">{formatTime(secondsLeft)}</div>;
}
