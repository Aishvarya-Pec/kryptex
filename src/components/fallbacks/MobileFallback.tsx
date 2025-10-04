"use client";
import React, { useEffect, useState } from 'react';

export function isLowPowerDevice() {
  const coarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const mem = (navigator as any).deviceMemory || 4;
  const cores = (navigator as any).hardwareConcurrency || 4;
  return coarse || mem <= 4 || cores <= 4;
}

export type MobileFallbackProps = {
  posterDataUrl?: string | null;
  title?: string;
  ctaLabel?: string;
  ctaActionId?: string;
};

export function MobileFallback({ posterDataUrl, title = 'Experience', ctaLabel = 'View Projects', ctaActionId }: MobileFallbackProps) {
  const [isLow, setIsLow] = useState(false);
  useEffect(() => setIsLow(isLowPowerDevice()), []);

  if (!isLow) return null;
  return (
    <div className="w-full h-full grid place-items-center">
      <div className="max-w-xl text-center space-y-3">
        {posterDataUrl ? <img src={posterDataUrl} alt="Preview poster" className="w-full rounded" /> : <div className="h-40 rounded bg-white/10" />}
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="px-3 py-2 rounded bg-purple-600"
          onClick={() => {
            if (ctaActionId) {
              window.dispatchEvent(new CustomEvent('sceneAction', { detail: { id: ctaActionId } }));
            }
          }}
          aria-label={ctaLabel}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}