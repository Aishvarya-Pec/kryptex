import type { Scene, SceneObject } from './scene-schema';

function vec3ToArray(v?: { x: number; y: number; z: number }) { 
  if (!v) return '[0,0,0]'; 
  return `[${v.x}, ${v.y}, ${v.z}]`; 
} 

function genObjectComponent(obj: SceneObject): string { 
  const pos = vec3ToArray(obj.transform?.position); 
  const rot = vec3ToArray(obj.transform?.rotation); 
  const scale = vec3ToArray(obj.transform?.scale ?? { x: 1, y: 1, z: 1 }); 
  const color = obj.material?.color ?? '#ffffff'; 
  const roughness = obj.material?.roughness ?? 0.5; 
  const metalness = obj.material?.metalness ?? 0.5; 
  
  const animationHook = obj.animation?.preset === 'rotate' 
    ? `useFrame((_, delta) => { if (ref.current) ref.current.rotation.${obj.animation.params?.axis || 'y'} += delta * ${obj.animation.params?.speed || 0.5}; });` 
    : ''; 

  const componentName = `SceneObject_${obj.id.replace(/[^a-zA-Z0-9]/g, '')}`; 
  
  return ` 
const ${componentName} = () => { 
  const ref = React.useRef<THREE.Group>(null!); 
  ${animationHook} 
  
  return ( 
    <group ref={ref} position={${pos}} rotation={${rot}} scale={${scale}}> 
      ${obj.type === 'mesh' ? ` 
      <mesh> 
        <boxGeometry args={[1, 1, 1]} /> 
        <meshStandardMaterial color={"${color}"} roughness={${roughness}} metalness={${metalness}} /> 
      </mesh>` : ''} 
      ${obj.type === 'text' ? ` 
      <mesh> {/* Placeholder for 3D Text */} 
        <boxGeometry args={[2, 0.5, 0.1]} /> 
        <meshBasicMaterial color={"${color}"} /> 
      </mesh>` : ''} 
      ${obj.type === 'model' && obj.props?.src ? ` 
      <Suspense fallback={null}><Model url="${obj.props.src}" /></Suspense>` : ''} 
    </group> 
  ); 
};`; 
} 

export function generateFromScene(scene: Scene): { files: Record<string, string> } { 
  const files: Record<string, string> = {}; 
  const objectComponents = scene.objects.map(genObjectComponent).join('\n'); 
  const cam = scene.camera; 
 
  files['src/components/ScenePlayer.tsx'] = ` 
"use client"; 
 import { Canvas, useFrame } from '@react-three/fiber'; 
 import { OrbitControls, useGLTF } from '@react-three/drei'; 
 import React, { Suspense, useRef } from 'react'; 
 import * as THREE from 'three'; 
 
 function Model({ url, ...props }: any) { 
   const { scene } = useGLTF(url); 
   return <primitive object={scene} {...props} />; 
 } 
 
 ${objectComponents} 
 
 export default function ScenePlayer() { 
   return ( 
     <Canvas camera={{ position: [${cam.position.x}, ${cam.position.y}, ${cam.position.z}], fov: ${cam.fov} }}> 
       <ambientLight intensity={0.8} /> 
       <pointLight intensity={1} position={[10, 10, 10]} /> 
       <Suspense fallback={null}> 
         ${scene.objects.map(o => `<${`SceneObject_${o.id.replace(/[^a-zA-Z0-9]/g, '')}`} />`).join('\n        ')} 
       </Suspense> 
       ${cam.type === 'orbit' ? '<OrbitControls />' : ''} 
     </Canvas> 
   ); 
 }`; 
 
 files['app/preview-generated/page.tsx'] = ` 
 import dynamic from 'next/dynamic'; 
 const ScenePlayer = dynamic(() => import('../../src/components/ScenePlayer'), { ssr: false }); 
 
 export default function GeneratedPreviewPage() { 
   return ( 
     <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh' }}> 
       <ScenePlayer /> 
     </div> 
   ); 
 }`; 
 
 files['package.json'] = JSON.stringify({ 
   name: "generated-kryptex-scene", 
   version: "0.1.0", 
   private: true, 
   scripts: { "dev": "next dev", "build": "next build", "start": "next start" }, 
   dependencies: { 
     "next": "^14.1.0", "react": "^18.2.0", "react-dom": "^18.2.0", 
     "three": "^0.162.0", "@react-three/fiber": "^8.15.1", "@react-three/drei": "^9.102.6" 
   } 
 }, null, 2); 
 
 return { files }; 
}