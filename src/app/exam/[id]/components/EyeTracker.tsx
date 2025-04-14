import InfoMessage from "@/app/components/InfoMessage";
import { useState, useCallback } from "react";
import { EyeTracking } from "react-eye-tracking";

type EyeTrackerProps = {
  gazeCountsRef: any;
  setStartExam: (v: boolean) => void;
};

export default function EyeTracker({
  gazeCountsRef,
  setStartExam,
}: EyeTrackerProps) {
  const [calibration, setCalibration] = useState(false);
  const [calibrationCount, setCalibrationCount] = useState(0);

  const handleGazeData = useCallback((data: any) => {
    if (!data || typeof data.x !== "number" || typeof data.y !== "number") {
      return;
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const thresholdX = 0.015; // 1% from left or right
    const thresholdY = 0.015; // 1% from top or bottom

    const isLeft = data.x < screenWidth * thresholdX;
    const isRight = data.x > screenWidth * (1 - thresholdX);
    const isTop = data.y < screenHeight * thresholdY;
    const isBottom = data.y > screenHeight * (1 - thresholdY);

    let currentArea: string | null = null;

    if (isLeft && isTop) currentArea = "topleft";
    else if (isRight && isTop) currentArea = "topright";
    else if (isLeft && isBottom) currentArea = "bottomleft";
    else if (isRight && isBottom) currentArea = "bottomright";
    else if (isLeft) currentArea = "left";
    else if (isRight) currentArea = "right";
    else if (isTop) currentArea = "top";
    else if (isBottom) currentArea = "bottom";

    if (currentArea) {
      gazeCountsRef.current[currentArea] += 1;
    }
  }, []);

  return (
    <>
      <section className="eyetracker-calibration-page">
        <h2>PRE-REQUISITES:</h2>
        <InfoMessage>
          - functioning camera and good lighting is required.
          <br />- this window must be in fullscreen.
          <br />- calibration is required before starting the exam.
        </InfoMessage>

        <div>
          <button
            onClick={() => {
              setCalibrationCount(calibrationCount + 1);
              setCalibration(true);
            }}
          >
            Calibrate
          </button>
          <button
            disabled={calibrationCount < 1}
            onClick={() => setStartExam(true)}
          >
            Start Exam
          </button>
        </div>
      </section>

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
