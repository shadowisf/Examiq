"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  duration: number;
  onTimeUp: () => void;
};

export default function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatTime = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="timer">
      {hours}:{formatTime(minutes)}:{formatTime(seconds)}
    </div>
  );
}
