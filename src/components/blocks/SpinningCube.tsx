"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export type SpinningCubeProps = {
  size?: number;
  speed?: number;
  materialPreset?: 'matte' | 'metal' | 'neon';
  color?: string;
  throttleMs?: number;
};

export function SpinningCube({ size = 1, speed = 0.6, materialPreset = 'matte', color = '#9f5cff', throttleMs = 0 }: SpinningCubeProps) {
  const ref = useRef<any>();
  const last = useRef<number>(performance.now());
  useFrame((_, delta) => {
    const now = performance.now();
    if (throttleMs && now - last.current < throttleMs) return;
    last.current = now;
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} roughness={materialPreset === 'matte' ? 0.8 : 0.3} metalness={materialPreset === 'metal' ? 0.6 : 0.1} />
    </mesh>
  );
}