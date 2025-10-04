"use client";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

type Vec3 = { x: number; y: number; z: number };

export type SceneObject = {
  id: string;
  type: 'mesh' | 'text' | 'model' | 'light' | 'particle' | 'group';
  transform?: { position?: Vec3; rotation?: Vec3; scale?: Vec3 };
  material?: { color?: string };
  props?: Record<string, any>;
  children?: SceneObject[];
};

export type SceneJSON = {
  camera?: { type?: 'orbit' | 'static'; position?: Vec3; fov?: number; controls?: Record<string, any> };
  objects: SceneObject[];
};

function Box({ color = '#9f5cff' }: { color?: string }) {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={new THREE.Color(color)} />
    </mesh>
  );
}

function Text3D({ text = 'Hello', color = '#ffffff' }: { text?: string; color?: string }) {
  return (
    <mesh>
      <textGeometry args={[text, { size: 0.5 }]} />
      <meshBasicMaterial color={new THREE.Color(color)} />
    </mesh>
  );
}

export default function ScenePlayer({ scene }: { scene: SceneJSON }) {
  const cam = useMemo(() => scene.camera ?? { type: 'orbit', position: { x: 0, y: 1.4, z: 6 }, fov: 50 }, [scene]);
  return (
    <Canvas camera={{ position: [cam.position?.x ?? 0, cam.position?.y ?? 1.4, cam.position?.z ?? 6], fov: cam.fov ?? 50 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 3, 2]} />
      {scene.objects?.map((obj) => {
        const pos = obj.transform?.position ?? { x: 0, y: 0, z: 0 };
        const rot = obj.transform?.rotation ?? { x: 0, y: 0, z: 0 };
        const scale = obj.transform?.scale ?? { x: 1, y: 1, z: 1 };
        const color = obj.material?.color ?? '#ffffff';
        return (
          <group key={obj.id} position={[pos.x, pos.y, pos.z]} rotation={[rot.x, rot.y, rot.z]} scale={[scale.x, scale.y, scale.z]}>
            {obj.type === 'mesh' && <Box color={color} />}
            {obj.type === 'text' && <Text3D text={obj.props?.text} color={color} />}
          </group>
        );
      })}
      {cam.type === 'orbit' && <OrbitControls enablePan enableZoom />}
    </Canvas>
  );
}