import { useState, useCallback, useEffect } from "react";
import { EyeTracking } from "react-eye-tracking";

type EyeTrackerProps = {
  startExam: boolean;
  setStartExam: (start: boolean) => void;
};

export default function EyeTracker({
  startExam,
  setStartExam,
}: EyeTrackerProps) {
  const [calibration, setCalibration] = useState(false);
  const [lastNotifiedCorner, setLastNotifiedCorner] = useState<string | null>(
    null
  );
  const [antiCheat, setAntiCheat] = useState(false);

  useEffect(() => {
    if (startExam) {
      setAntiCheat(true);
    }
  }, [startExam]);

  const handleGazeData = useCallback(
    (data: any, elapsedTime: number) => {
      if (!data || typeof data.x !== "number" || typeof data.y !== "number")
        return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const thresholdX = -1; // 10% from left or right (sides of the screen)
      const thresholdY = -1; // 10% from top or bottom (sides of the screen)

      const isLeft = data.x < screenWidth * thresholdX;
      const isRight = data.x > screenWidth * (1 - thresholdX);
      const isTop = data.y < screenHeight * thresholdY;
      const isBottom = data.y > screenHeight * (1 - thresholdY);

      let currentArea: string | null = null;

      if (isLeft && isTop) currentArea = "top-left";
      else if (isRight && isTop) currentArea = "top-right";
      else if (isLeft && isBottom) currentArea = "bottom-left";
      else if (isRight && isBottom) currentArea = "bottom-right";
      else if (isLeft) currentArea = "left";
      else if (isRight) currentArea = "right";
      else if (isTop) currentArea = "top";
      else if (isBottom) currentArea = "bottom";

      if (currentArea && currentArea !== lastNotifiedCorner) {
        alert(`You're looking at the ${currentArea} area!`);
        setLastNotifiedCorner(currentArea);

        // Reset lastNotifiedCorner after 3 seconds to allow new alerts
        setTimeout(() => setLastNotifiedCorner(null), 3000);
      }
    },
    [lastNotifiedCorner, startExam]
  );

  return (
    <>
      <main className="eyetracker">
        <button onClick={() => setCalibration(true)}>Calibrate</button>
        <button onClick={() => setStartExam(true)}>Start Exam</button>
      </main>

      {/* <EyeTracking
        show={calibration}
        setShow={setCalibration}
        showCamera={true}
        showPoint={true}
        listener={handleGazeData}
      /> */}
    </>
  );
}
