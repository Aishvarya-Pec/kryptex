"use client";
import React, { useMemo } from 'react';

export type OrbitMenuItem = { icon?: string; label: string; action?: () => void };
export type OrbitMenuProps = { items: OrbitMenuItem[]; radius?: number; rotationSpeed?: number };

export function OrbitMenu({ items, radius = 2.6 }: OrbitMenuProps) {
  const positions = useMemo(() => {
    return items.map((_, i) => {
      const angle = (i / items.length) * Math.PI * 2;
      return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as const;
    });
  }, [items, radius]);

  return (
    <group>
      {items.map((item, i) => (
        <group key={item.label} position={positions[i] as any}>
          <mesh onClick={item.action} onPointerDown={item.action}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={'#ff4db8'} />
          </mesh>
        </group>
      ))}
    </group>
  );
}