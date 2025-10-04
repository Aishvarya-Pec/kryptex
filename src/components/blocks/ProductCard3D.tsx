"use client";
import React from 'react';
import { useGLTF } from '@react-three/drei';

export type ProductCard3DProps = {
  url: string;
  hoverScale?: number;
  clickActionId?: string;
};

export function ProductCard3D({ url, hoverScale = 1.05, clickActionId }: ProductCard3DProps) {
  const gltf = useGLTF(url, true);
  return (
    <group
      onClick={() => {
        if (clickActionId) {
          window.dispatchEvent(new CustomEvent('sceneAction', { detail: { id: clickActionId } }));
        }
      }}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}