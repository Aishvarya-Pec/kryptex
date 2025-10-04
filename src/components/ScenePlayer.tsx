"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import React, { Suspense, useMemo, useRef } from 'react';

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

function Model({ url, ...props }: { url: string } & React.ComponentProps<'group'>) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} {...props} />;
}

const RenderedObject = ({ obj }: { obj: SceneObject }) => {
  const ref = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (obj.animation?.preset === 'rotate' && ref.current) {
      const speed = obj.animation.params?.speed ?? 0.5;
      const axis = obj.animation.params?.axis ?? 'y';
      (ref.current.rotation as any)[axis] += delta * speed;
    }
  });

  const handleClick = () => {
    if (obj.interaction?.onClick) {
      console.log(`Clicked on ${obj.id}, action: ${obj.interaction.onClick.action}`);
    }
  };

  const pos = obj.transform?.position ?? { x: 0, y: 0, z: 0 };
  const rot = obj.transform?.rotation ?? { x: 0, y: 0, z: 0 };
  const scale = obj.transform?.scale ?? { x: 1, y: 1, z: 1 };
  const color = obj.material?.color ?? '#ffffff';

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
        <mesh>
          <boxGeometry args={[(obj.props?.text?.length ?? 5) * 0.2, 0.5, 0.1]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
      {obj.type === 'model' && obj.props?.src && <Model url={obj.props.src} />}
    </group>
  );
};

export default function ScenePlayer({ scene }: { scene: SceneJSON }) {
  const cam = useMemo(() => scene.camera ?? { type: 'orbit', position: { x: 0, y: 1.4, z: 6 }, fov: 50 }, [scene]);
  return (
    <Canvas camera={{ position: [cam.position?.x ?? 0, cam.position?.y ?? 1.4, cam.position?.z ?? 6], fov: cam.fov ?? 50 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 3, 2]} />
      <Suspense fallback={null}>
        {scene.objects?.map((obj) => <RenderedObject key={obj.id} obj={obj} />)}
      </Suspense>
      {cam.type === 'orbit' && <OrbitControls enablePan enableZoom />}
    </Canvas>
  );
}