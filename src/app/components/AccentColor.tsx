"use client";

import { useEffect } from "react";

export default function AccentColor() {
  useEffect(() => {
    const root = document.documentElement;

    const accentColors = ["#a0ae8c", "#ffd2ed"];
    const randomColor = accentColors[Math.floor(Math.random() * 2)];
    root.style.setProperty("--accent-color", randomColor);
  }, []);

  return null;
}
