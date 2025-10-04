"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import React, { Suspense, useMemo, useRef } from 'react';
import { ParticleBackground } from './blocks/ParticleBackground';
import { resolveAsset } from '../lib/asset-resolver';

type Vec3 = { x: number; y: number; z: number };

export type SceneObject = {
  id: string;
  type: 'mesh' | 'text' | 'model' | 'light' | 'particle' | 'group';
  transform?: { position?: Vec3; rotation?: Vec3; scale?: Vec3 };
  material?: { color?: string; roughness?: number; metalness?: number };
  animation?: { preset?: string; params?: { axis?: 'x' | 'y' | 'z'; speed?: number } };
  interaction?: { onClick?: { action: string } };
  props?: Record<string, any>;
  children?: SceneObject[];
};

export type SceneJSON = {
  camera?: { type?: 'orbit' | 'static'; position?: Vec3; fov?: number; controls?: Record<string, any> };
  objects: SceneObject[];
};

function Model({ url, assetEntries = [], ...props }: { url: string; assetEntries?: { name: string; url: string }[] } & React.ComponentProps<'group'>) {
  const assetMap = useMemo(() => new Map(assetEntries.map(a => [a.name, a.url])), [assetEntries]);
  const resolvedUrl = resolveAsset(url, assetMap);
  const { scene } = useGLTF(resolvedUrl);
  return <primitive object={scene} {...props} />;
}

const RenderedObject = ({ obj, assets = [] }: { obj: SceneObject; assets?: { name: string; url: string }[] }) => {
  const ref = useRef<THREE.Group>(null!);

  // Animation handler
  useFrame(({ clock }, delta) => {
    if (!ref.current) return;

    // Handle rotation
    if (obj.animation?.preset === 'rotate') {
      const speed = obj.animation.params?.speed ?? 0.5;
      const axis = obj.animation.params?.axis ?? 'y';
      (ref.current.rotation as any)[axis] += delta * speed;
    }

    // Handle float
    if (obj.animation?.preset === 'float') {
      const speed = obj.animation.params?.speed ?? 1;
      const amplitude = obj.animation.params?.amplitude ?? 0.1;
      ref.current.position.y = (obj.transform?.position?.y ?? 0) + Math.sin(clock.elapsedTime * speed) * amplitude;
    }
  });

  const handleClick = () => {
    if (obj.interaction?.onClick) {
      console.log(`Clicked on ${obj.id}, action: ${obj.interaction.onClick.action}`);
      // Dispatch a global event for the interaction system
      window.dispatchEvent(new CustomEvent('sceneAction', { detail: obj.interaction.onClick }));
    }
  };

  const pos = obj.transform?.position ?? { x: 0, y: 0, z: 0 };
  const rot = obj.transform?.rotation ?? { x: 0, y: 0, z: 0 };
  const scale = obj.transform?.scale ?? { x: 1, y: 1, z: 1 };
  const color = obj.material?.color ?? '#ffffff';

  // For non-animating objects, set the initial position
  if (obj.animation?.preset !== 'float') {
    ref.current?.position.set(pos.x, pos.y, pos.z);
  }

  if (obj.type === 'light') {
    return (
      <pointLight
        position={[pos.x, pos.y, pos.z]}
        color={color}
        intensity={obj.props?.intensity ?? 1}
      />
    );
  }

  if (obj.type === 'particle') {
    return <ParticleBackground {...obj.props} />;
  }

  return (
    <group
      ref={ref}
      key={obj.id}
      position={[pos.x, pos.y, pos.z]}
      rotation={[rot.x, rot.y, rot.z]}
      scale={[scale.x, scale.y, scale.z]}
      onClick={handleClick}
    >
      {obj.type === 'mesh' && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={color}
            roughness={obj.material?.roughness ?? 0.5}
            metalness={obj.material?.metalness ?? 0.5}
          />
        </mesh>
      )}
      {obj.type === 'text' && (
        <Text
          fontSize={obj.props?.fontSize ?? 0.5}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {obj.props?.text ?? '...'}
        </Text>
      )}
      {obj.type === 'model' && obj.props?.src && <Model url={obj.props.src} assetEntries={assets} />}
    </group>
  );
};

export default function ScenePlayer({ scene, assets }: { scene: SceneJSON; assets?: { name: string; url: string }[] }) {
  const cam = useMemo(() => scene.camera ?? { type: 'orbit', position: { x: 0, y: 1.4, z: 6 }, fov: 50 }, [scene]);
  return (
    <Canvas camera={{ position: [cam.position?.x ?? 0, cam.position?.y ?? 1.4, cam.position?.z ?? 6], fov: cam.fov ?? 50 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 3, 2]} />
      <Suspense fallback={null}>
        {scene.objects?.map((obj) => <RenderedObject key={obj.id} obj={obj} assets={assets} />)}
      </Suspense>
      {cam.type === 'orbit' && <OrbitControls enablePan enableZoom />}
    </Canvas>
  );
}