"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SpinningCube } from "../../../src/components/blocks/SpinningCube";
import { LODGroup } from "../../../src/components/perf/LODGroup";

// Load UI/diagnostics client-only to avoid SSR hydration issues
const PerfPanel = dynamic(() => import("../../../src/components/perf/PerfPanel"), { ssr: false });
const WebXRToggle = dynamic(() => import("../../../src/components/fallbacks/WebXRToggle"), { ssr: false });

export default function BlocksShowcasePage(): JSX.Element {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="p-4">
      <div className="relative h-[75vh] rounded overflow-hidden border border-white/10">
        {/* Gate Canvas until after mount to prevent hydration warnings */}
        {mounted && (
          <Canvas camera={{ position: [0, 1.4, 6], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[2, 3, 2]} />

            {/* Spinning cube demo with throttle control */}
            <group position={[-1.5, 0, 0]}>
              <SpinningCube size={1} speed={0.8} materialPreset="matte" color="#9f5cff" throttleMs={0} />
            </group>

            {/* Simple LOD group demo using plain meshes as levels */}
            <group position={[1.5, 0, 0]}>
              <LODGroup thresholds={[3, 6]}>
                {[
                  <mesh key="lod-0">
                    <boxGeometry args={[1.2, 1.2, 1.2]} />
                    <meshStandardMaterial color="#ff4db8" />
                  </mesh>,
                  <mesh key="lod-1">
                    <boxGeometry args={[0.9, 0.9, 0.9]} />
                    <meshStandardMaterial color="#ff4db8" />
                  </mesh>,
                  <mesh key="lod-2">
                    <boxGeometry args={[0.6, 0.6, 0.6]} />
                    <meshStandardMaterial color="#ff4db8" />
                  </mesh>,
                ]}
              </LODGroup>
            </group>

            <OrbitControls enablePan enableZoom />
            <PerfPanel />
          </Canvas>
        )}
        {/* WebXR toggle button overlay */}
        <WebXRToggle />
      </div>
    </main>
  );
}