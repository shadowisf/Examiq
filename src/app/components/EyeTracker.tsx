"use client";

import { useState, useRef, useCallback } from "react";
import { EyeTracking } from "react-eye-tracking";

export default function EyeTracker() {
  const [calibration, setCalibration] = useState(false);
  const [antiCheat, setAntiCheat] = useState(false);

  // Refs to track time spent looking at edges
  const leftEdgeTime = useRef<number | null>(null);
  const rightEdgeTime = useRef<number | null>(null);
  const topEdgeTime = useRef<number | null>(null);
  const bottomEdgeTime = useRef<number | null>(null);

  // Use useCallback to ensure the function updates when antiCheat changes
  const handleGazeData = useCallback(
    (data: any) => {
      if (!antiCheat) {
        console.log("Anti-cheat is disabled.");
        return;
      }

      console.log("Anti-cheat is enabled.");

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const leftThreshold = screenWidth * 0.15; // Leftmost 15% of the screen
      const rightThreshold = screenWidth * 0.85; // Rightmost 15% of the screen
      const topThreshold = screenHeight * 0.15; // Topmost 15% of the screen
      const bottomThreshold = screenHeight * 0.85; // Bottommost 15% of the screen

      const now = Date.now();
      const edgeTimeThreshold = 1000; // 1 second

      // Left edge detection
      if (data.x < leftThreshold) {
        if (!leftEdgeTime.current) {
          leftEdgeTime.current = now;
        } else if (now - leftEdgeTime.current >= edgeTimeThreshold) {
          alert("Stay focused! Stop looking at the left.");
          leftEdgeTime.current = null; // Reset
        }
      } else {
        leftEdgeTime.current = null;
      }

      // Right edge detection
      if (data.x > rightThreshold) {
        if (!rightEdgeTime.current) {
          rightEdgeTime.current = now;
        } else if (now - rightEdgeTime.current >= edgeTimeThreshold) {
          alert("Stay focused! Stop looking at the right.");
          rightEdgeTime.current = null; // Reset
        }
      } else {
        rightEdgeTime.current = null;
      }

      // Top edge detection
      if (data.y < topThreshold) {
        if (!topEdgeTime.current) {
          topEdgeTime.current = now;
        } else if (now - topEdgeTime.current >= edgeTimeThreshold) {
          alert("Stay focused! Stop looking at the top.");
          topEdgeTime.current = null; // Reset
        }
      } else {
        topEdgeTime.current = null;
      }

      // Bottom edge detection
      if (data.y > bottomThreshold) {
        if (!bottomEdgeTime.current) {
          bottomEdgeTime.current = now;
        } else if (now - bottomEdgeTime.current >= edgeTimeThreshold) {
          alert("Stay focused! Stop looking at the bottom.");
          bottomEdgeTime.current = null; // Reset
        }
      } else {
        bottomEdgeTime.current = null;
      }
    },
    [antiCheat] // React updates this function whenever antiCheat changes
  );

  return (
    <>
      <main>
        <button onClick={() => setCalibration(true)}>Calibrate</button>
        <button
          onClick={() => {
            setAntiCheat(!antiCheat);
            console.log(antiCheat);
          }}
        >
          {antiCheat ? "Disable Anti-Cheat" : "Enable Anti-Cheat"}
        </button>
        <h1>Anti-cheat: {antiCheat ? "Enabled" : "Disabled"}</h1>
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
