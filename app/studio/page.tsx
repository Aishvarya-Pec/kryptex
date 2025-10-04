"use client";
import { useState } from 'react';
import ScenePlayer from '@/src/components/ScenePlayer';

const starterScene = {
  camera: { type: 'orbit', position: { x: 0, y: 1.4, z: 6 }, fov: 50 },
  objects: [
    { id: 'obj_cube_01', type: 'mesh', transform: { position: { x: 0, y: 0, z: 0 } }, material: { color: '#9f5cff' } },
  ],
};

export default function StudioPage() {
  const [scene, setScene] = useState(starterScene);
  return (
    <main className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Studio</h1>
        <button
          className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
          onClick={() => setScene((s) => ({ ...s, objects: [...s.objects, { id: `obj_cube_${s.objects.length + 1}`, type: 'mesh', transform: { position: { x: Math.random() * 2 - 1, y: Math.random() * 1, z: Math.random() * 2 - 1 } }, material: { color: '#ff4db8' } }] }))}
        >
          Add Cube
        </button>
      </header>
      <div className="h-[70vh] rounded overflow-hidden border border-white/10">
        <ScenePlayer scene={scene} />
      </div>
    </main>
  );
}