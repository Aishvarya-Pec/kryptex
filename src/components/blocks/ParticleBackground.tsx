"use client";
import React, { useMemo } from 'react';

export type ParticleBackgroundProps = { density?: number; speed?: number };

export function ParticleBackground({ density = 150, speed = 0.1 }: ParticleBackgroundProps) {
  const positions = useMemo(() => {
    return new Array(density).fill(0).map(() => [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 10,
    ]);
  }, [density]);
  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={p as any}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}