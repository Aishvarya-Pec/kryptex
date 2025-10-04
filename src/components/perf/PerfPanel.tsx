"use client";
import React, { useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { createPortal } from "react-dom";

type PerfMetrics = {
  fps: number;
  drawCalls: number;
  programs: number;
  textures: number;
  buffers: number;
};

// Render stats overlay safely via a portal and read gl.info with light throttling
export default function PerfPanel(): JSX.Element {
  const { gl } = useThree();
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState<PerfMetrics | null>(null);
  const [fps, setFps] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(0);
  const lastFrameTime = useState<number>(performance.now())[0];

  useEffect(() => setMounted(true), []);

  useFrame(({ clock }, delta) => {
    const now = clock.elapsedTime * 1000;
    // Simple FPS estimator with exponential smoothing
    const currentFps = 1 / Math.max(delta, 1e-6);
    setFps((prev) => prev * 0.9 + currentFps * 0.1);
    // Throttle to ~2 Hz to avoid excessive re-renders
    if (now - lastUpdate < 500) return;
    setLastUpdate(now);
    const info = gl.info as any;
    setMetrics({
      fps: Math.round(fps),
      drawCalls: info?.render?.calls ?? 0,
      programs: Array.isArray(info?.programs) ? info.programs.length : 0,
      textures: info?.memory?.textures ?? 0,
      buffers: info?.memory?.buffers ?? 0,
    });
  });

  return (
    <>
      {/* Move the DOM overlay outside the R3F scene graph via a portal */}
      {mounted &&
        createPortal(
          <div
            aria-label="Performance diagnostics overlay"
            style={{
              position: "fixed",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              padding: "8px 10px",
              borderRadius: 8,
              fontSize: 12,
              lineHeight: 1.4,
              zIndex: 50,
              pointerEvents: "none",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Diagnostics</div>
            {metrics ? (
              <>
                <div>FPS: {metrics.fps}</div>
                <div>Draw calls: {metrics.drawCalls}</div>
                <div>Programs: {metrics.programs}</div>
                <div>Textures: {metrics.textures}</div>
                <div>Buffers: {metrics.buffers}</div>
              </>
            ) : (
              <div>Collecting metrics…</div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}