import { useState, useRef, useCallback } from "react";
import { EyeTracking } from "react-eye-tracking";

type EyeTrackerProps = {
  setStartExam: (start: boolean) => void;
};

export default function EyeTracker({ setStartExam }: EyeTrackerProps) {
  const [calibration, setCalibration] = useState(false);

  // Use useCallback to ensure the function updates when antiCheat changes
  const handleGazeData = (data: any, elapsedTime: any) => {
    // Handle the gaze data here.
    // `data` contains the x and y coordinates of the gaze prediction.
    // `elapsedTime` is the time since the WebGazer started.
  };

  return (
    <>
      <main className="eyetracker">
        <button onClick={() => setCalibration(true)}>Calibrate</button>

        <button onClick={() => setStartExam(true)}>Start Exam</button>
      </main>

      <EyeTracking
        show={calibration}
        setShow={setCalibration}
        showCamera={true}
        showPoint={true}
        listener={handleGazeData} // Pass the updated function
      />
    </>
  );
}
