"use client";
import React, { useEffect, useState } from "react";

export default function WebXRToggle(): JSX.Element | null {
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasXR = typeof navigator !== "undefined" && "xr" in navigator;
    setSupported(Boolean(hasXR));
  }, []);

  if (!mounted || !supported) return null;

  const enterXR = async () => {
    // Placeholder: integrate WebXR session start via appropriate library or native API
    alert("Attempting to enter WebXR (VR/AR). Implement session start.");
  };

  return (
    <button
      type="button"
      aria-label="Enter VR or AR experience"
      onClick={enterXR}
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 60,
        background: "#111",
        color: "#fff",
        border: "1px solid #444",
        padding: "6px 10px",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      Enter VR/AR
    </button>
  );
}