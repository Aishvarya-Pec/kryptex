"use client";
import React from 'react';

export type HeroFloatingTextProps = {
  text?: string;
  fontSize?: number;
  floatAmplitude?: number;
  color?: string;
};

export function HeroFloatingText({ text = 'Hello', fontSize = 1.2, floatAmplitude = 0.12, color = '#ffffff' }: HeroFloatingTextProps) {
  return (
    <group>
      <mesh>
        {/* Placeholder text geometry; in production plug three-stdlib/text */}
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}