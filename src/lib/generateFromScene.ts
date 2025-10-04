import type { Scene, SceneObject } from './scene-schema';

function vec3ToArray(v?: { x: number; y: number; z: number }) {
  if (!v) return '[0,0,0]';
  return `[${v.x}, ${v.y}, ${v.z}]`;
}

function genObjectTSX(obj: SceneObject): string {
  const pos = vec3ToArray(obj.transform?.position);
  const rot = vec3ToArray(obj.transform?.rotation);
  const scale = vec3ToArray(obj.transform?.scale ?? { x: 1, y: 1, z: 1 });
  const color = obj.material?.color ?? '#ffffff';
  switch (obj.type) {
    case 'text':
      return `
      <group position={${pos}} rotation={${rot}} scale={${scale}}>
        {/* HeroFloatingText */}
        <mesh>
          {/* Placeholder text until font loader wired */}
          <meshBasicMaterial color={"${color}"} />
        </mesh>
      </group>`;
    case 'mesh':
      return `
      <group position={${pos}} rotation={${rot}} scale={${scale}}>
        <mesh>
          <boxGeometry args={[1,1,1]} />
          <meshStandardMaterial color={"${color}"} />
        </mesh>
      </group>`;
    case 'model':
      return `
      <group position={${pos}} rotation={${rot}} scale={${scale}}>
        {/* Dynamic glTF import recommended */}
        {/* <Suspense fallback={null}><Model url={modelUrl} /></Suspense> */}
      </group>`;
    default:
      return `
      <group position={${pos}} rotation={${rot}} scale={${scale}} />`;
  }
}

export function generateFromScene(scene: Scene): { files: Record<string, string> } {
  const files: Record<string, string> = {};

  // Entry ScenePlayer.tsx
  const cam = scene.camera;
  const entry = `import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React from 'react';

export default function ScenePlayer() {
  return (
    <Canvas camera={{ position: [${cam.position.x}, ${cam.position.y}, ${cam.position.z}], fov: ${cam.fov} }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[2,3,2]} />
      ${scene.objects.map((o) => genObjectTSX(o)).join('\n')}
      ${cam.type === 'orbit' ? '<OrbitControls enablePan enableZoom />' : ''}
    </Canvas>
  );
}
`;
  files['src/generated/ScenePlayer.tsx'] = entry;

  // Next.js preview route mounting generated scene
  const previewRoute = `import dynamic from 'next/dynamic';
const ScenePlayer = dynamic(() => import('../../src/generated/ScenePlayer'), { ssr: false });
export default function GeneratedPreview() {
  return (
    <main className="p-4">
      <div className="h-[75vh] rounded overflow-hidden border border-white/10">
        <ScenePlayer />
      </div>
    </main>
  );
}
`;
  files['app/preview-generated/page.tsx'] = previewRoute;

  return { files };
}

// Sample conversion result for floating text + rotating cube
export const sampleScene: Scene = {
  metadata: { version: '1.0.0', author: 'user' },
  camera: { type: 'orbit', position: { x: 0, y: 1.4, z: 6 }, fov: 50 },
  objects: [
    { id: 'obj_heroText_01', type: 'text', transform: { position: { x: 0, y: 1.2, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1 } }, material: { color: '#ffffff' } },
    { id: 'obj_cube_01', type: 'mesh', transform: { position: { x: 0, y: 0, z: 0 } }, material: { color: '#9f5cff' }, animation: { preset: 'rotate', params: { axis: 'y', speed: 0.4 } } },
  ],
};

export const sampleFiles = generateFromScene(sampleScene).files;