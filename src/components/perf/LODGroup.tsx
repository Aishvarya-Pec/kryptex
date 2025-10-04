"use client";
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export type LODGroupProps = {
  thresholds: number[]; // distances at which to switch to child index
  children: React.ReactNode[];
};

export function LODGroup({ thresholds, children }: LODGroupProps) {
  const groupRef = useRef<any>();
  const { camera } = useThree();
  const [index, setIndex] = useState(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const pos = groupRef.current.getWorldPosition(new (camera.position.constructor as any)());
    const dist = camera.position.distanceTo(pos);
    let next = 0;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (dist >= thresholds[i]) {
        next = i + 1;
        break;
      }
    }
    if (next !== index) setIndex(next);
  });

  return <group ref={groupRef}>{children[index] ?? children[children.length - 1]}</group>;
}